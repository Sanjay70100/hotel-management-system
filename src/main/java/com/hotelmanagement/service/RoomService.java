package com.hotelmanagement.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hotelmanagement.dto.RoomRequest;
import com.hotelmanagement.exception.ResourceNotFoundException;
import com.hotelmanagement.model.Room;
import com.hotelmanagement.repository.RoomRepository;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    // CREATE
    public Room createRoom(RoomRequest request) {

        if (roomRepository.existsByRoomNumber(
                request.getRoomNumber())) {

            throw new IllegalArgumentException(
                    "Room number already exists"
            );
        }

        validateRoomStatus(request.getStatus());

        Room room = new Room(
                request.getRoomNumber(),
                request.getRoomType(),
                request.getPrice(),
                request.getStatus().toUpperCase()
        );

        return roomRepository.save(room);
    }

    // READ ALL
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // READ BY ID
    public Room getRoomById(Long id) {

        return roomRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Room not found with ID: " + id
                        )
                );
    }

    // UPDATE
    public Room updateRoom(
            Long id,
            RoomRequest request) {

        Room room = getRoomById(id);

        if (!room.getRoomNumber().equalsIgnoreCase(
                request.getRoomNumber())
                && roomRepository.existsByRoomNumber(
                request.getRoomNumber())) {

            throw new IllegalArgumentException(
                    "Another room already uses this room number"
            );
        }

        validateRoomStatus(request.getStatus());

        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setPrice(request.getPrice());
        room.setStatus(request.getStatus().toUpperCase());

        return roomRepository.save(room);
    }

    // DELETE
    public void deleteRoom(Long id) {

        Room room = getRoomById(id);

        if ("OCCUPIED".equalsIgnoreCase(room.getStatus())) {

            throw new IllegalArgumentException(
                    "Occupied room cannot be deleted"
            );
        }

        roomRepository.delete(room);
    }

    // GET AVAILABLE ROOMS
    public List<Room> getAvailableRooms() {

        return roomRepository.findByStatus("AVAILABLE");
    }

    // UPDATE ROOM STATUS
    public Room updateRoomStatus(
            Long id,
            String status) {

        Room room = getRoomById(id);

        validateRoomStatus(status);

        room.setStatus(status.toUpperCase());

        return roomRepository.save(room);
    }

    // VALIDATE ROOM STATUS
    private void validateRoomStatus(String status) {

        if (status == null) {

            throw new IllegalArgumentException(
                    "Room status is required"
            );
        }

        String normalizedStatus = status.toUpperCase();

        if (!normalizedStatus.equals("AVAILABLE")
                && !normalizedStatus.equals("OCCUPIED")
                && !normalizedStatus.equals("MAINTENANCE")) {

            throw new IllegalArgumentException(
                    "Room status must be AVAILABLE, OCCUPIED, or MAINTENANCE"
            );
        }
    }
}