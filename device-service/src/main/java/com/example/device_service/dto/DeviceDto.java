package com.example.device_service.dto;


public record DeviceDto(
    Long id,
    String name,
    Double maximumConsumption,
    Long userId,      // Necesar pentru dropdown-ul din Frontend
    String username
){}
