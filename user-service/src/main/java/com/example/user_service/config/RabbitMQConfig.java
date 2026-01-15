package com.example.user_service.config;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;

@Configuration
public class RabbitMQConfig {
    public static final String SYNC_EXCHANGE = "synchronization.exchange";

    @Bean
    public TopicExchange syncExchange() {
        return new TopicExchange(SYNC_EXCHANGE);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        // Folosim Jackson2JsonMessageConverter pentru a serializa ca JSON
        return new Jackson2JsonMessageConverter();
    }
}
