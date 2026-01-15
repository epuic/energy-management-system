package com.example.device_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
public class SyncMessage implements Serializable {
    private Long id;
    private String type;      // "DEVICE"
    private String operation; // "CREATED", "UPDATED", "DELETED"
    private String entityName;
    private Double maxConsumption; // NOU: Adăugat aici
    private Long userId;         // ÎNAPOI CA ÎNAINTE
    private String userUsername;
}
