package com.hotelmanagement.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hotelmanagement.dto.GuestRequest;
import com.hotelmanagement.exception.ResourceNotFoundException;
import com.hotelmanagement.model.Guest;
import com.hotelmanagement.repository.GuestRepository;

@Service
public class GuestService {

    private final GuestRepository guestRepository;

    public GuestService(GuestRepository guestRepository) {
        this.guestRepository = guestRepository;
    }

    // CREATE
    public Guest createGuest(GuestRequest request) {

        if (guestRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException(
                    "Guest with this email already exists"
            );
        }

        Guest guest = new Guest(
                request.getName(),
                request.getEmail(),
                request.getPhone(),
                request.getAddress()
        );

        return guestRepository.save(guest);
    }

    // READ ALL
    public List<Guest> getAllGuests() {
        return guestRepository.findAll();
    }

    // READ BY ID
    public Guest getGuestById(Long id) {

        return guestRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Guest not found with ID: " + id
                        )
                );
    }

    // UPDATE
    public Guest updateGuest(
            Long id,
            GuestRequest request) {

        Guest guest = getGuestById(id);

        if (!guest.getEmail().equalsIgnoreCase(request.getEmail())
                && guestRepository.existsByEmail(request.getEmail())) {

            throw new IllegalArgumentException(
                    "Another guest already uses this email"
            );
        }

        guest.setName(request.getName());
        guest.setEmail(request.getEmail());
        guest.setPhone(request.getPhone());
        guest.setAddress(request.getAddress());

        return guestRepository.save(guest);
    }

    // DELETE
    public void deleteGuest(Long id) {

        Guest guest = getGuestById(id);

        guestRepository.delete(guest);
    }
}