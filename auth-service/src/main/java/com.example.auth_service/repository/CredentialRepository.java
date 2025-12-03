package com.example.auth_service.repository;

import com.example.auth_service.model.Credential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CredentialRepository extends JpaRepository<Credential, Long> {
    Optional<Credential> findByUsername(String username);
    Optional<Credential> findById(Long id);

    boolean existsByUsername(String username);

    @Modifying
    @Query(value = "INSERT INTO credentials(id, username, password_hash, role) " +
            "VALUES (:id, :username, :passwordHash, :role)", nativeQuery = true)
    void insertWithId(@Param("id") Long id,
                      @Param("username") String username,
                      @Param("passwordHash") String passwordHash,
                      @Param("role") String role);
}
