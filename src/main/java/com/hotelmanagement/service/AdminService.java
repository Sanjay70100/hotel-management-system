package com.hotelmanagement.service;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.hotelmanagement.repository.BookingRepository;
import com.hotelmanagement.repository.GuestRepository;
import com.hotelmanagement.repository.PaymentRepository;
import com.hotelmanagement.repository.RoomRepository;

@Service
public class AdminService {

    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    public AdminService(
            GuestRepository guestRepository,
            RoomRepository roomRepository,
            BookingRepository bookingRepository,
            PaymentRepository paymentRepository) {

        this.guestRepository = guestRepository;
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
    }

    public Map<String, Object> getDashboard() {

        Map<String, Object> dashboard =
                new LinkedHashMap<>();

        long totalGuests =
                guestRepository.count();

        long totalRooms =
                roomRepository.count();

        long availableRooms =
                roomRepository.countByStatus("AVAILABLE");

        long occupiedRooms =
                roomRepository.countByStatus("OCCUPIED");

        long maintenanceRooms =
                roomRepository.countByStatus("MAINTENANCE");

        long totalBookings =
                bookingRepository.count();

        long confirmedBookings =
                bookingRepository.countByStatus("CONFIRMED");

        long cancelledBookings =
                bookingRepository.countByStatus("CANCELLED");

        Double revenue =
                paymentRepository.getTotalRevenue();

        if (revenue == null) {
            revenue = 0.0;
        }

        dashboard.put("totalGuests", totalGuests);
        dashboard.put("totalRooms", totalRooms);
        dashboard.put("availableRooms", availableRooms);
        dashboard.put("occupiedRooms", occupiedRooms);
        dashboard.put("maintenanceRooms", maintenanceRooms);
        dashboard.put("totalBookings", totalBookings);
        dashboard.put("confirmedBookings", confirmedBookings);
        dashboard.put("cancelledBookings", cancelledBookings);
        dashboard.put("totalRevenue", revenue);

        return dashboard;
    }

    public long getGuestCount() {
        return guestRepository.count();
    }

    public long getRoomCount() {
        return roomRepository.count();
    }

    public long getBookingCount() {
        return bookingRepository.count();
    }

    public Double getRevenue() {

        Double revenue =
                paymentRepository.getTotalRevenue();

        return revenue != null ? revenue : 0.0;
    }
}