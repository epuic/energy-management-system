package com.example.device_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user_references")
@Getter
@Setter
public class UserReference {
    @Id
    private Long id; // ID-ul utilizatorului
    private String username;
}