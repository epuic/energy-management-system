package com.example.monitoring_service.consumer;

import com.example.monitoring_service.config.RabbitMQConfig;
import com.example.monitoring_service.dto.MeasurementDTO;
import com.example.monitoring_service.service.ConsumptionAggregationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class DataCollectionConsumer {

    private final ConsumptionAggregationService aggregationService;
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = RabbitMQConfig.DATA_COLLECTION_QUEUE)
    public void handleMeasurement(MeasurementDTO measurement) {
        aggregationService.processMeasurement(measurement);
    }
}