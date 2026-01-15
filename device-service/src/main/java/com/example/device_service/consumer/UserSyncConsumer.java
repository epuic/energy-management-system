package com.example.device_service.consumer;

import com.example.device_service.config.RabbitMQConfig;
import com.example.device_service.dto.SyncMessage;
import com.example.device_service.service.UserReferenceService; // 👈 NOU: Importul serviciului

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserSyncConsumer {

    private final UserReferenceService userReferenceService;

    @Autowired
    public UserSyncConsumer(UserReferenceService userReferenceService) {
        this.userReferenceService = userReferenceService;
    }

    @RabbitListener(queues = RabbitMQConfig.DEVICE_SERVICE_USER_QUEUE)
    public void handleUserSync(SyncMessage message) {

        if (!"USER".equals(message.getType())) {
            return;
        }

        System.out.println("Received User Sync Event: " + message.getOperation()
                + " User ID: " + message.getId() + ", Name: " + message.getEntityName());

        String operation = message.getOperation();

        if ("CREATED".equals(operation) || "UPDATED".equals(operation)) {
            userReferenceService.saveOrUpdateUserReference(
                    message.getId(),
                    message.getEntityName()
            );
        } else if ("DELETED".equals(operation)) {
            // Ștergere
            userReferenceService.deleteUserReference(message.getId());
        }
    }
}