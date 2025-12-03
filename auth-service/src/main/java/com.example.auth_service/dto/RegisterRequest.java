package com.example.auth_service.dto;

import com.example.auth_service.model.Role;


public record RegisterRequest(String username, String password, Role role) {
}