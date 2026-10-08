package com.hotelmanagement.repository;

import com.hotelmanagement.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Get all payments for a particular booking
    List<Payment> findByBookingId(Long bookingId);

    // Calculate total revenue from successful payments
    @Query("SELECT COALESCE(SUM(p.amount), 0) " +
           "FROM Payment p " +
           "WHERE p.paymentStatus = 'PAID'")
    Double getTotalRevenue();
}