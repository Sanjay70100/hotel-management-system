package com.hotelmanagement.repository;

import com.hotelmanagement.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find bookings by guest ID
    List<Booking> findByGuestId(Long guestId);

    // Find bookings by status
    List<Booking> findByStatus(String status);

    // Count bookings by status
    long countByStatus(String status);
}