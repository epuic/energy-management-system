package com.example.device_service.service;


import com.example.device_service.dto.DeviceDto;
import com.example.device_service.model.Device;
import com.example.device_service.repository.DeviceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeviceService {

    private final DeviceRepository repo;

    public DeviceService(DeviceRepository r) {
        this.repo = r;
    }


    public List<DeviceDto> all() {
        return repo.findAll().stream().map(this::toDto).toList();
    }

    public DeviceDto byId(Long id) {
        return repo.findById(id).map(this::toDto).orElseThrow();
    }

    public DeviceDto create(DeviceDto dto) {
        Device d = toEntity(dto);
        return toDto(repo.save(d));
    }

    public DeviceDto update(Long id, DeviceDto dto) {
        Device d = repo.findById(id).orElseThrow();
        d.setName(dto.name());
        d.setMaximumConsumption(dto.maximumConsumption());
        d.setUserId(dto.userId());
        return toDto(repo.save(d));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public List<DeviceDto> forUser(Long userId) {
        return repo.findByUserId(userId).stream().map(this::toDto).toList();
    }


    private Device toEntity(DeviceDto dto) {
        Device d = new Device();
        d.setName(dto.name());
        d.setMaximumConsumption(dto.maximumConsumption());
        d.setUserId(dto.userId());
        return d;
    }

    private DeviceDto toDto(Device d) {
        return new DeviceDto(d.getId(), d.getName(), d.getMaximumConsumption(), d.getUserId());
    }
}
