package com.example.monitoring_service.controller;

import com.example.monitoring_service.model.HourlyConsumption;
import com.example.monitoring_service.service.ConsumptionAggregationService;
import lombok.RequiredArgsConstructor;
// Nu mai avem nevoie de org.springframework.format.annotation.DateTimeFormat
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
// NOU: Importăm DateTimeFormatter pentru a parsa String-ul de dată
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/monitoring")
@RequiredArgsConstructor
public class MonitoringController {

    private final ConsumptionAggregationService service;

    @GetMapping("/consumption/{deviceId}")
    public List<HourlyConsumption> getHourlyConsumption(
            @PathVariable Long deviceId,
            @RequestParam String date)
    {

        LocalDate localDate = LocalDate.parse(date);

        return service.getDailyConsumption(deviceId, localDate);
    }
}