package com.example.user_service.repository;

import com.example.user_service.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO users (id, username, role) VALUES (:id, :username, :role)", nativeQuery = true)
    int insertWithId(@Param("id") Long id,
                     @Param("username") String username,
                     @Param("role") String role);
}
