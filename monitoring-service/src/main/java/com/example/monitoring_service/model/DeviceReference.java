package com.example.monitoring_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "device_references")
@Getter
@Setter
public class DeviceReference {
    @Id
    private Long id;
    private String name;
    private Double maximumConsumption; // Adăugat
    private Long userId;          // ÎNAPOI CA ÎNAINTE
    private String ownerUsername; // Stocăm username-ul aici pentru alertă
}