package com.example.monitoring_service.config;

import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.fasterxml.jackson.databind.ObjectMapper; // 👈 Import nou

@Configuration
public class RabbitMQConfig {


    public static final String SYNC_EXCHANGE = "synchronization.exchange";

    public static final String MONITORING_SERVICE_DEVICE_QUEUE = "monitoring.service.device.sync.queue";

    public static final String DATA_COLLECTION_EXCHANGE = "data.collection.exchange";

    public static final String DATA_COLLECTION_QUEUE = "data.collection.queue";

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        return mapper;
    }

    @Bean
    public TopicExchange syncExchange() {
        return new TopicExchange(SYNC_EXCHANGE);
    }

    @Bean
    public DirectExchange dataCollectionExchange() {
        return new DirectExchange(DATA_COLLECTION_EXCHANGE);
    }

    @Bean
    public Queue dataCollectionQueue() {
        return new Queue(DATA_COLLECTION_QUEUE, true);
    }

    @Bean
    public Queue monitoringServiceDeviceQueue() {
        return new Queue(MONITORING_SERVICE_DEVICE_QUEUE, true);
    }

    @Bean
    public Binding dataCollectionBinding(Queue dataCollectionQueue, DirectExchange dataCollectionExchange) {
        return BindingBuilder.bind(dataCollectionQueue).to(dataCollectionExchange).with(DATA_COLLECTION_QUEUE);
    }

    @Bean
    public Binding deviceSyncBinding(Queue monitoringServiceDeviceQueue, TopicExchange syncExchange) {
        return BindingBuilder.bind(monitoringServiceDeviceQueue).to(syncExchange).with("device.*");
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }



}
