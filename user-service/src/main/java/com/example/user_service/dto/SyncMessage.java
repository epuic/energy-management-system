package com.example.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SyncMessage implements Serializable {
    private Long id;
    private String type; // "USER"
    private String operation; // "CREATED", "UPDATED"
    private String entityName;
}