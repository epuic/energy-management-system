package com.example.user_service.service;

import com.example.user_service.config.RabbitMQConfig;
import com.example.user_service.dto.SyncMessage;
import com.example.user_service.dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SyncProducerService {

    private final RabbitTemplate rabbitTemplate;

    public void sendUserSync(UserDto userDto, String operation) {

        SyncMessage message = new SyncMessage(
                userDto.id(),
                "USER",
                operation,
                userDto.username()
        );

        String routingKey = "user." + operation.toLowerCase();

        System.out.println("Publishing User Sync Event: " + routingKey + " for User ID: " + userDto.id());

        rabbitTemplate.convertAndSend(RabbitMQConfig.SYNC_EXCHANGE, routingKey, message);
    }
}