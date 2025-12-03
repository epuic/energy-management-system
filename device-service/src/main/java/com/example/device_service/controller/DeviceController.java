package com.example.device_service.controller;


import com.example.device_service.dto.DeviceDto;
import com.example.device_service.service.DeviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
public class DeviceController {
    private final DeviceService service;

    @GetMapping
    public List<DeviceDto> all() {
        return service.all();
    }

    @GetMapping("/{id}")
    public DeviceDto one(@PathVariable Long id) {
        return service.byId(id);
    }

    @PostMapping
    public DeviceDto create(@RequestBody DeviceDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public DeviceDto update(@PathVariable Long id, @RequestBody DeviceDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public List<DeviceDto> forUser(@PathVariable Long userId) {
        return service.forUser(userId);
    }

}
