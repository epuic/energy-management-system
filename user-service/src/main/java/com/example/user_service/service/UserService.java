package com.example.user_service.service;

import com.example.user_service.dto.UserCreateWithIdRequest;
import com.example.user_service.dto.UserDto;
import com.example.user_service.model.User;
import com.example.user_service.repository.UserRepository;
import com.example.user_service.util.UserMapper;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository r) {
        this.repo = r;
    }


    public List<UserDto> all() {
        return repo.findAll().stream().map(UserMapper::toDto).toList();
    }

    public UserDto byId(Long id) {
        return repo.findById(id).map(UserMapper::toDto).orElseThrow();
    }

    public UserDto byUsername(String username) {
        return repo.findByUsername(username).map(UserMapper::toDto).orElseThrow();
    }

    public UserDto create(UserDto dto) {
        User u = new User();
        u.setUsername(dto.username());
        u.setRole(dto.role());
        return UserMapper.toDto(repo.save(u));
    }

    public UserDto update(Long id, UserDto dto) {
        User u = repo.findById(id).orElseThrow();
        u.setUsername(dto.username());
        u.setRole(dto.role());
        return UserMapper.toDto(repo.save(u));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }


    @Transactional
    public User createWithId(UserCreateWithIdRequest req) {
        if (req.id() == null) throw new IllegalArgumentException("id is required");
        if (repo.findById(req.id()).isPresent())
            throw new IllegalStateException("id already exists in user-db");
        if (repo.findByUsername(req.username()).isPresent())
            throw new IllegalStateException("username already exists in user-db");

        int rows = repo.insertWithId(req.id(), req.username(), req.role().name());
        if (rows != 1) {
            throw new IllegalStateException("Failed to insert user with given id");
        }
        return repo.findById(req.id()).orElseThrow();
    }
}
