package com.example.monitoring_service.repository;

import com.example.monitoring_service.model.HourlyConsumption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface HourlyConsumptionRepository extends JpaRepository<HourlyConsumption, Long> {

    // Gaseste un consum pentru o anumita ora, necesar pentru agregare
    Optional<HourlyConsumption> findByDeviceIdAndTimestampHour(Long deviceId, LocalDateTime timestampHour);

    // Interogare pentru vizualizarea in Frontend
    @Query("SELECT h FROM HourlyConsumption h WHERE h.deviceId = :deviceId AND h.timestampHour >= :start AND h.timestampHour < :end ORDER BY h.timestampHour")
    List<HourlyConsumption> findDailyConsumption(@Param("deviceId") Long deviceId,
                                                 @Param("start") LocalDateTime startOfDay,
                                                 @Param("end") LocalDateTime endOfNextDay);
}