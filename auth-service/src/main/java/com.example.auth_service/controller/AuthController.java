package com.example.auth_service.controller;


import com.example.auth_service.dto.*;
import com.example.auth_service.model.Credential;
import com.example.auth_service.repository.CredentialRepository;
import com.example.auth_service.service.AuthService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService service;
    private final CredentialRepository repo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest req) {
        return ResponseEntity.ok(service.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        return ResponseEntity.ok(service.login(req));
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody AdminCredentialUpdate req) {
        Credential c = repo.findById(id).orElseThrow();
        if (req.username() != null && !req.username().isBlank()) c.setUsername(req.username());
        if (req.role() != null) c.setRole(req.role());
        if (req.password() != null && !req.password().isBlank()) {
            c.setPasswordHash(encoder.encode(req.password()));
        }
        repo.save(c);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/create-with-id")
    @Transactional
    public ResponseEntity<Credential> createWithId(@RequestBody UserCreateWithIdRequest req) {
        if (req.id() == null) throw new IllegalArgumentException("id is required");
        if (repo.findById(req.id()).isPresent())
            throw new IllegalStateException("id already exists in auth-db");
        if (repo.existsByUsername(req.username()))
            throw new IllegalStateException("username already exists in auth-db");

        String hash = encoder.encode(req.password());

        repo.insertWithId(req.id(), req.username(), hash, req.role().name());

        Credential created = repo.findById(req.id()).orElseThrow();
        return ResponseEntity.ok(created);
    }
}
