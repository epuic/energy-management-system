package com.example.auth_service.dto;

import com.example.auth_service.model.Role;

public record AdminCredentialUpdate(String username, String password, Role role) {
}
