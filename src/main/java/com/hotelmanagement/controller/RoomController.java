package com.hotelmanagement.controller;

import com.hotelmanagement.dto.RoomRequest;
import com.hotelmanagement.model.Room;
import com.hotelmanagement.service.RoomService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    public ResponseEntity<Room> createRoom(
            @Valid @RequestBody RoomRequest request) {

        return ResponseEntity.ok(
                roomService.createRoom(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {

        return ResponseEntity.ok(
                roomService.getAllRooms()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                roomService.getRoomById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody RoomRequest request) {

        return ResponseEntity.ok(
                roomService.updateRoom(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoom(
            @PathVariable Long id) {

        roomService.deleteRoom(id);

        return ResponseEntity.ok(
                "Room deleted successfully"
        );
    }

    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAvailableRooms() {

        return ResponseEntity.ok(
                roomService.getAvailableRooms()
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Room> updateRoomStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(
                roomService.updateRoomStatus(id, status)
        );
    }
}