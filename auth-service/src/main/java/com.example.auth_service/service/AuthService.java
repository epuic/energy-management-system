package com.example.auth_service.service;


import com.example.auth_service.dto.*;
import com.example.auth_service.model.*;
import com.example.auth_service.repository.CredentialRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {
    private final CredentialRepository repo;
    private final JwtUtil jwt;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(CredentialRepository repo, JwtUtil jwt) {
        this.repo = repo;
        this.jwt = jwt;
    }

    public RegisterResponse register(RegisterRequest req) {
        if (repo.findByUsername(req.username()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        Credential c = new Credential();
        c.setUsername(req.username());
        c.setRole(req.role());
        c.setPasswordHash(encoder.encode(req.password()));

        Credential saved = repo.save(c);

        return new RegisterResponse(saved.getId(), saved.getUsername(), saved.getRole());
    }

    public AuthResponse login(LoginRequest req) {
        Credential c = repo.findByUsername(req.username())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!encoder.matches(req.password(), c.getPasswordHash())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwt.generateToken(c.getUsername(), List.of(c.getRole().name()));
        return new AuthResponse(token, c.getUsername(), List.of(c.getRole()));
    }


}
