package com.example.monitoring_service.consumer;

import com.example.monitoring_service.config.RabbitMQConfig;
import com.example.monitoring_service.dto.SyncMessage;
import com.example.monitoring_service.service.DeviceReferenceService;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DeviceSyncConsumer {
    private final DeviceReferenceService deviceReferenceService;

    @Autowired
    public DeviceSyncConsumer(DeviceReferenceService deviceReferenceService) {
        this.deviceReferenceService = deviceReferenceService;
    }

    @RabbitListener(queues = RabbitMQConfig.MONITORING_SERVICE_DEVICE_QUEUE)
    public void handleDeviceSync(SyncMessage message) {
        if ("DEVICE".equals(message.getType())) {
            System.out.println("SYNC PRIMIT: Device=" + message.getEntityName() + ", User=" + message.getUserUsername());

            deviceReferenceService.saveDeviceReference(
                    message.getId(),
                    message.getEntityName(),
                    message.getMaxConsumption(),
                    message.getUserId(),      // ID-ul numeric
                    message.getUserUsername()
            );
        }
    }
}