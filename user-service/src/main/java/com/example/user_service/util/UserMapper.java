package com.example.user_service.util;

import com.example.user_service.dto.UserDto;
import com.example.user_service.model.User;

public class UserMapper {
    public static UserDto toDto(User u) {
        return new UserDto(u.getId(), u.getUsername(), u.getRole());
    }
}
