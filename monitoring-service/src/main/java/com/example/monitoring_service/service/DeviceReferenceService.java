package com.example.monitoring_service.service;

import com.example.monitoring_service.model.DeviceReference;
import com.example.monitoring_service.repository.DeviceReferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeviceReferenceService {
    private final DeviceReferenceRepository repo;

    public void saveDeviceReference(Long deviceId, String deviceName, Double maxConsumption,Long userId, String username) {
        // Căutăm device-ul existent sau creăm unul nou
        DeviceReference ref = repo.findById(deviceId).orElse(new DeviceReference());

        ref.setId(deviceId);
        ref.setName(deviceName);
        ref.setMaximumConsumption(maxConsumption);
        ref.setUserId(userId);
        ref.setOwnerUsername(username);                     // NOU: Salvăm posesorul pentru alertă chat

        repo.save(ref);
        System.out.println("Device ID " + deviceId + " synchronized locally with limit: " + maxConsumption);
    }
}