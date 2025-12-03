package com.example.auth_service.dto;

import com.example.auth_service.model.Role;

public record RegisterResponse(Long id, String username, Role role) {
}
