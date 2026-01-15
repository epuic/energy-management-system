package com.example.monitoring_service.service;

import com.example.monitoring_service.config.RabbitMQConfig;
import com.example.monitoring_service.dto.MeasurementDTO;
import com.example.monitoring_service.model.DeviceReference;
import com.example.monitoring_service.model.HourlyConsumption;
import com.example.monitoring_service.repository.DeviceReferenceRepository;
import com.example.monitoring_service.repository.HourlyConsumptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConsumptionAggregationService {

    private final HourlyConsumptionRepository consumptionRepository;
    private final DeviceReferenceRepository deviceReferenceRepository;
    private final RabbitTemplate rabbitTemplate;
    private final RestTemplate restTemplate = new RestTemplate();

    // Constants
    private static final double DEFAULT_MAX_CONSUMPTION = 100.0; // Default limit if not found

    /**
     * Process incoming measurement from IoT device
     */
    public void processMeasurement(MeasurementDTO measurement) {
        try {
            log.info("Processing measurement for device {} with value {} kWh",
                    measurement.getDeviceId(), measurement.getMeasurementValue());

            LocalDateTime timestampHour = LocalDateTime.ofInstant(
                    Instant.ofEpochMilli(measurement.getTimestamp()),
                    ZoneId.systemDefault()
            ).withMinute(0).withSecond(0).withNano(0);

            aggregateHourlyConsumption(measurement.getDeviceId(),
                    measurement.getMeasurementValue(),
                    timestampHour);


            checkLimitAndNotify(measurement.getDeviceId(), timestampHour);

        } catch (Exception e) {
            log.error("Error processing measurement for device {}: {}",
                    measurement.getDeviceId(), e.getMessage(), e);
        }
    }

    private void checkLimitAndNotify(Long deviceId, LocalDateTime hour) {
        DeviceReference device = deviceReferenceRepository.findById(deviceId).orElse(null);
        HourlyConsumption consumption = consumptionRepository.findByDeviceIdAndTimestampHour(deviceId, hour).orElse(null);

        if (device == null) {
            log.error("Alerta ESUATA: Nu am gasit DeviceReference pentru ID {}", deviceId);
            return;
        }

        log.info("Verificare limita: Device={}, Consum Curent={}, Limita={}, User={}",
                device.getName(),
                consumption != null ? consumption.getEnergyConsumedKWh() : 0,
                device.getMaximumConsumption(),
                device.getOwnerUsername());

        if (consumption != null && device.getMaximumConsumption() != null) {
            if (consumption.getEnergyConsumedKWh() > device.getMaximumConsumption()) {
                if (device.getOwnerUsername() == null) {
                    log.warn("Alerta nu poate fi trimisa: ownerUsername este NULL!");
                    return;
                }

                log.info("LIMITA DEPASITA! Trimit alerta REST catre Chat pentru {}", device.getOwnerUsername());
                triggerChatAlert(device.getOwnerUsername(), deviceId, consumption.getEnergyConsumedKWh(), device.getMaximumConsumption());
            }
        }
    }

    private void triggerChatAlert(String username, Long deviceId, double current, double limit) {
        String url = "http://chat-service:8086/chat/internal/alert";

        Map<String, Object> request = new HashMap<>();
        request.put("username", username);
        request.put("message", "ATENTIE! Dispozitivul " + deviceId + " a depasit limita orara (" + limit + " kWh). Consum actual: " + String.format("%.2f", current) + " kWh.");

        try {
            restTemplate.postForObject(url, request, Void.class);
            log.info("Cererea REST catre Chat Service a fost trimisa cu succes.");
        } catch (Exception e) {
            log.error("Nu s-a putut contacta Chat Service: " + e.getMessage());
        }
    }

    private void sendToChatService(Long deviceId, Long userId, double current, double limit) {
        String chatServiceUrl = "http://chat-service:8086/api/alerts/notify";
        Map<String, Object> payload = Map.of(
                "userId", userId,
                "message", "ATENȚIE! Dispozitivul " + deviceId + " a depășit limita (" + limit + " kWh). Consum actual: " + current + " kWh"
        );
        try {
            restTemplate.postForObject(chatServiceUrl, payload, Void.class);
        } catch (Exception e) {
            log.error("Nu s-a putut trimite alerta către Chat Service: {}", e.getMessage());
        }
    }

    /**
     * Aggregate consumption for an hour
     */
    private void aggregateHourlyConsumption(Long deviceId, Double value, LocalDateTime timestampHour) {
        Optional<HourlyConsumption> existing = consumptionRepository
                .findByDeviceIdAndTimestampHour(deviceId, timestampHour);

        HourlyConsumption consumption;
        if (existing.isPresent()) {
            consumption = existing.get();
            consumption.setEnergyConsumedKWh(consumption.getEnergyConsumedKWh() + value);
        } else {
            consumption = new HourlyConsumption();
            consumption.setDeviceId(deviceId);
            consumption.setTimestampHour(timestampHour);
            consumption.setEnergyConsumedKWh(value);
        }

        consumptionRepository.save(consumption);
        log.debug("Saved hourly consumption: device={}, value={}, hour={}", 
                deviceId, consumption.getEnergyConsumedKWh(), timestampHour);
    }



    /**
     * Get daily consumption for a specific device and date
     */
    public List<HourlyConsumption> getDailyConsumption(Long deviceId, 
                                                       java.time.LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();

        return consumptionRepository.findDailyConsumption(deviceId, startOfDay, endOfDay);
    }

    /**
     * Get maximum consumption limit for device
     * TODO: This should query the device-service API to get the actual limit
     * For now, returns a default value
     */
    private Double getMaximumConsumption(Long deviceId) {
        // In the future, this could call device-service API:
        // return deviceServiceClient.getDeviceMaxConsumption(deviceId);
        return DEFAULT_MAX_CONSUMPTION;
    }
}
