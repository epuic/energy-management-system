package com.example.monitoring_service.repository;

import com.example.monitoring_service.model.DeviceReference;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceReferenceRepository extends JpaRepository<DeviceReference, Long> {
}