package com.example.device_service.repository;

import com.example.device_service.model.UserReference;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserReferenceRepository extends JpaRepository<UserReference, Long> {
}