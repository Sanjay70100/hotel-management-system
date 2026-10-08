package com.hotelmanagement.controller;

import com.hotelmanagement.dto.GuestRequest;
import com.hotelmanagement.model.Guest;
import com.hotelmanagement.service.GuestService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guests")
@CrossOrigin(origins = "*")
public class GuestController {

    private final GuestService guestService;

    public GuestController(GuestService guestService) {
        this.guestService = guestService;
    }

    @PostMapping
    public ResponseEntity<Guest> createGuest(
            @Valid @RequestBody GuestRequest request) {

        return ResponseEntity.ok(
                guestService.createGuest(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<Guest>> getAllGuests() {

        return ResponseEntity.ok(
                guestService.getAllGuests()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Guest> getGuestById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                guestService.getGuestById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Guest> updateGuest(
            @PathVariable Long id,
            @Valid @RequestBody GuestRequest request) {

        return ResponseEntity.ok(
                guestService.updateGuest(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGuest(
            @PathVariable Long id) {

        guestService.deleteGuest(id);

        return ResponseEntity.ok(
                "Guest deleted successfully"
        );
    }
}