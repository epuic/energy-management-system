package com.example.device_service.service;

import com.example.device_service.model.UserReference;
import com.example.device_service.repository.UserReferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserReferenceService {

    private final UserReferenceRepository repo;

    @Transactional
    public void saveOrUpdateUserReference(Long userId, String username) {

        UserReference ref = repo.findById(userId).orElse(new UserReference());

        ref.setId(userId);
        ref.setUsername(username);

        repo.save(ref);

        System.out.println("User ID " + userId + " synchronized locally in Device Service.");
    }

    @Transactional
    public void deleteUserReference(Long userId) {
        repo.deleteById(userId);
        System.out.println("User ID " + userId + " deleted locally from Device Service.");
    }
}