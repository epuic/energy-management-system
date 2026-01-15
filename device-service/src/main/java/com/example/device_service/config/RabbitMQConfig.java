package com.example.device_service.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;

@Configuration
public class RabbitMQConfig {

    public static final String SYNC_EXCHANGE = "synchronization.exchange";

    public static final String DEVICE_SERVICE_USER_QUEUE = "device.service.user.sync.queue";

    @Bean
    public TopicExchange syncExchange() {
        return new TopicExchange(SYNC_EXCHANGE);
    }


    @Bean
    public Queue deviceServiceUserQueue() {
        return new Queue(DEVICE_SERVICE_USER_QUEUE, true);
    }

    @Bean
    public Binding userSyncBinding(Queue deviceServiceUserQueue, TopicExchange syncExchange) {
        return BindingBuilder.bind(deviceServiceUserQueue).to(syncExchange).with("user.*");
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}