package org.example;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeasurementDTO {
    private long timestamp;
    private Long deviceId;
    private Double measurementValue;
}