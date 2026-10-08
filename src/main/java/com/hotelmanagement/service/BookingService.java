package com.hotelmanagement.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hotelmanagement.dto.BookingRequest;
import com.hotelmanagement.exception.ResourceNotFoundException;
import com.hotelmanagement.model.Booking;
import com.hotelmanagement.model.Guest;
import com.hotelmanagement.model.Room;
import com.hotelmanagement.repository.BookingRepository;
import com.hotelmanagement.repository.GuestRepository;
import com.hotelmanagement.repository.RoomRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;

    public BookingService(
            BookingRepository bookingRepository,
            GuestRepository guestRepository,
            RoomRepository roomRepository) {

        this.bookingRepository = bookingRepository;
        this.guestRepository = guestRepository;
        this.roomRepository = roomRepository;
    }

    // CREATE BOOKING
    @Transactional
    public Booking createBooking(BookingRequest request) {

        validateDates(
                request.getCheckInDate(),
                request.getCheckOutDate()
        );

        Guest guest = guestRepository.findById(
                request.getGuestId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Guest not found with ID: "
                                + request.getGuestId()
                )
        );

        Room room = roomRepository.findById(
                request.getRoomId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Room not found with ID: "
                                + request.getRoomId()
                )
        );

        if (!"AVAILABLE".equalsIgnoreCase(room.getStatus())) {

            throw new IllegalArgumentException(
                    "Room is not available for booking"
            );
        }

        Booking booking = new Booking(
                guest.getId(),
                room.getId(),
                request.getCheckInDate(),
                request.getCheckOutDate(),
                request.getNumberOfGuests(),
                "CONFIRMED"
        );

        room.setStatus("OCCUPIED");
        roomRepository.save(room);

        return bookingRepository.save(booking);
    }

    // READ ALL
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // READ BY ID
    public Booking getBookingById(Long id) {

        return bookingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found with ID: " + id
                        )
                );
    }

    // UPDATE
    @Transactional
    public Booking updateBooking(
            Long id,
            BookingRequest request) {

        Booking booking = getBookingById(id);

        validateDates(
                request.getCheckInDate(),
                request.getCheckOutDate()
        );

        Guest guest = guestRepository.findById(
                request.getGuestId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Guest not found with ID: "
                                + request.getGuestId()
                )
        );

        Room newRoom = roomRepository.findById(
                request.getRoomId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Room not found with ID: "
                                + request.getRoomId()
                )
        );

        // Change room if necessary
        if (!booking.getRoomId().equals(newRoom.getId())) {

            if (!"AVAILABLE".equalsIgnoreCase(
                    newRoom.getStatus())) {

                throw new IllegalArgumentException(
                        "New room is not available"
                );
            }

            Room oldRoom = roomRepository.findById(
                    booking.getRoomId()
            ).orElse(null);

            if (oldRoom != null) {

                oldRoom.setStatus("AVAILABLE");
                roomRepository.save(oldRoom);
            }

            newRoom.setStatus("OCCUPIED");
            roomRepository.save(newRoom);
        }

        booking.setGuestId(guest.getId());
        booking.setRoomId(newRoom.getId());
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setNumberOfGuests(request.getNumberOfGuests());

        if (request.getStatus() != null
                && !request.getStatus().isBlank()) {

            validateBookingStatus(request.getStatus());

            booking.setStatus(
                    request.getStatus().toUpperCase()
            );
        }

        return bookingRepository.save(booking);
    }

    // CANCEL BOOKING
    @Transactional
    public void cancelBooking(Long id) {

        Booking booking = getBookingById(id);

        if ("CANCELLED".equalsIgnoreCase(
                booking.getStatus())) {

            throw new IllegalArgumentException(
                    "Booking is already cancelled"
            );
        }

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);

        Room room = roomRepository.findById(
                booking.getRoomId()
        ).orElse(null);

        if (room != null) {

            room.setStatus("AVAILABLE");
            roomRepository.save(room);
        }
    }

    // GET BOOKINGS BY GUEST
    public List<Booking> getBookingsByGuest(Long guestId) {

        if (!guestRepository.existsById(guestId)) {

            throw new ResourceNotFoundException(
                    "Guest not found with ID: " + guestId
            );
        }

        return bookingRepository.findByGuestId(guestId);
    }

    // GET BOOKINGS BY STATUS
    public List<Booking> getBookingsByStatus(String status) {

        validateBookingStatus(status);

        return bookingRepository.findByStatus(
                status.toUpperCase()
        );
    }

    // VALIDATE DATES
    private void validateDates(
            LocalDate checkIn,
            LocalDate checkOut) {

        if (checkIn == null || checkOut == null) {

            throw new IllegalArgumentException(
                    "Check-in and check-out dates are required"
            );
        }

        if (!checkOut.isAfter(checkIn)) {

            throw new IllegalArgumentException(
                    "Check-out date must be after check-in date"
            );
        }
    }

    // VALIDATE BOOKING STATUS
    private void validateBookingStatus(String status) {

        if (status == null) {

            throw new IllegalArgumentException(
                    "Booking status is required"
            );
        }

        String normalized = status.toUpperCase();

        if (!normalized.equals("CONFIRMED")
                && !normalized.equals("CANCELLED")
                && !normalized.equals("COMPLETED")
                && !normalized.equals("PENDING")) {

            throw new IllegalArgumentException(
                    "Booking status must be CONFIRMED, CANCELLED, COMPLETED, or PENDING"
            );
        }
    }
}