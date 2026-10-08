package com.hotelmanagement.repository;

import com.hotelmanagement.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    // Find rooms by status
    List<Room> findByStatus(String status);

    // Count rooms by status
    long countByStatus(String status);

    // Find room by room number
    Optional<Room> findByRoomNumber(String roomNumber);

    // Check whether a room number already exists
    boolean existsByRoomNumber(String roomNumber);
}