package com.example.auth_service.dto;

import com.example.auth_service.model.Role;

import java.util.List;

public record AuthResponse(String token, String username, List<Role> roles) {
}
