package com.example.device_service.controller;


import com.example.device_service.dto.DeviceDto;
import com.example.device_service.service.DeviceService;
import com.example.device_service.service.SyncProducerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
public class DeviceController {
    private final DeviceService service;
    private final SyncProducerService syncProducerService; // 👈 NOU

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
        DeviceDto createdDevice = service.create(dto);
        syncProducerService.sendDeviceSync(createdDevice.id(), createdDevice.name(), "CREATED",createdDevice.maximumConsumption(),
                createdDevice.userId() ,dto.username()); // 👈 NOU
        return createdDevice;
    }

    @PutMapping("/{id}")
    public DeviceDto update(@PathVariable Long id, @RequestBody DeviceDto dto) {
        DeviceDto updatedDevice = service.update(id, dto);
        syncProducerService.sendDeviceSync(updatedDevice.id(), updatedDevice.name(), "UPDATED",updatedDevice.maximumConsumption(),
                updatedDevice.userId() ,updatedDevice.username()); // 👈 NOU
        return updatedDevice;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        // Pentru stergere, ar trebui sa obtii DeviceDto inainte de stergere pentru a avea numele/id-ul.
        DeviceDto deletedDevice = service.byId(id);
        service.delete(id);

        syncProducerService.sendDeviceSync(deletedDevice.id(), deletedDevice.name(), "DELETED",deletedDevice.maximumConsumption(),
                deletedDevice.userId(),deletedDevice.username()); // 👈 NOU
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public List<DeviceDto> forUser(@PathVariable Long userId) {
        return service.forUser(userId);
    }

}
