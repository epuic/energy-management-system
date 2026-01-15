package com.example.monitoring_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeasurementDTO {
    private Long deviceId;
    private Long timestamp;
    private Double measurementValue;
}