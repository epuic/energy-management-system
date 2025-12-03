package com.example.user_service.dto;

import com.example.user_service.model.Role;

public record UserDto(Long id, String username, Role role) {
}
