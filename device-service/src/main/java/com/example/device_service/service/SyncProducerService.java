package com.example.device_service.service;

import com.example.device_service.config.RabbitMQConfig; // Presupunem ca ai copiat config-ul si aici
import com.example.device_service.dto.SyncMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SyncProducerService {
    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public SyncProducerService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendDeviceSync(Long id, String name, String operation, Double maxConsumption, Long userId, String username) {
        // Actualizează apelul constructorului pentru a include noile argumente
        SyncMessage message = new SyncMessage(
                id,
                "DEVICE",
                operation,
                name,
                maxConsumption,
                userId,
                username
        );

        rabbitTemplate.convertAndSend(RabbitMQConfig.SYNC_EXCHANGE, "device." + operation.toLowerCase(), message);
    }
}
