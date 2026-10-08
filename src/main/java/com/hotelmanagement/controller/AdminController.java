package com.hotelmanagement.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotelmanagement.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Get complete admin dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    // Get total number of guests
    @GetMapping("/guests/count")
    public ResponseEntity<Long> getGuestCount() {
        return ResponseEntity.ok(adminService.getGuestCount());
    }

    // Get total number of rooms
    @GetMapping("/rooms/count")
    public ResponseEntity<Long> getRoomCount() {
        return ResponseEntity.ok(adminService.getRoomCount());
    }

    // Get total number of bookings
    @GetMapping("/bookings/count")
    public ResponseEntity<Long> getBookingCount() {
        return ResponseEntity.ok(adminService.getBookingCount());
    }

    // Get total revenue
    @GetMapping("/revenue")
    public ResponseEntity<Double> getRevenue() {
        return ResponseEntity.ok(adminService.getRevenue());
    }
}