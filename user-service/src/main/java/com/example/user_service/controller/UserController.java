package com.example.user_service.controller;


import com.example.user_service.dto.UserCreateWithIdRequest;
import com.example.user_service.dto.UserDto;
import com.example.user_service.model.User;
import com.example.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService service;

    @GetMapping
    public List<UserDto> all() {
        return service.all();
    }

    @GetMapping("/{id}")
    public UserDto one(@PathVariable Long id) {
        return service.byId(id);
    }

    @GetMapping("/by-username/{username}")
    public UserDto byUsername(@PathVariable String username) {
        return service.byUsername(username);
    }

    @PostMapping
    public UserDto create(@RequestBody UserDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public UserDto update(@PathVariable Long id, @RequestBody UserDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/create-with-id")
    public ResponseEntity<User> createWithId(@RequestBody UserCreateWithIdRequest req) {
        return ResponseEntity.ok(service.createWithId(req));
    }


    @GetMapping("/me")
    public UserDto me(Authentication auth) {
        String username = auth.getName();
        return service.byUsername(username);
    }
}
