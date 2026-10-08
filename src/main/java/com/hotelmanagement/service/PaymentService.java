package com.hotelmanagement.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hotelmanagement.dto.PaymentRequest;
import com.hotelmanagement.exception.ResourceNotFoundException;
import com.hotelmanagement.model.Booking;
import com.hotelmanagement.model.Payment;
import com.hotelmanagement.repository.BookingRepository;
import com.hotelmanagement.repository.PaymentRepository;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentService(
            PaymentRepository paymentRepository,
            BookingRepository bookingRepository) {

        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    // CREATE PAYMENT
    public Payment createPayment(PaymentRequest request) {

        Booking booking = bookingRepository.findById(
                request.getBookingId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Booking not found with ID: "
                                + request.getBookingId()
                )
        );

        Payment payment = new Payment(
                booking.getId(),
                request.getAmount(),
                request.getPaymentMethod().toUpperCase(),
                request.getPaymentStatus().toUpperCase(),
                LocalDateTime.now()
        );

        return paymentRepository.save(payment);
    }

    // READ ALL
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // READ BY ID
    public Payment getPaymentById(Long id) {

        return paymentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found with ID: " + id
                        )
                );
    }

    // GET PAYMENTS BY BOOKING
    public List<Payment> getPaymentsByBooking(Long bookingId) {

        if (!bookingRepository.existsById(bookingId)) {

            throw new ResourceNotFoundException(
                    "Booking not found with ID: " + bookingId
            );
        }

        return paymentRepository.findByBookingId(bookingId);
    }

    // UPDATE
    public Payment updatePayment(
            Long id,
            PaymentRequest request) {

        Payment payment = getPaymentById(id);

        if (!bookingRepository.existsById(
                request.getBookingId())) {

            throw new ResourceNotFoundException(
                    "Booking not found with ID: "
                            + request.getBookingId()
            );
        }

        payment.setBookingId(request.getBookingId());
        payment.setAmount(request.getAmount());

        payment.setPaymentMethod(
                request.getPaymentMethod().toUpperCase()
        );

        payment.setPaymentStatus(
                request.getPaymentStatus().toUpperCase()
        );

        return paymentRepository.save(payment);
    }

    // DELETE
    public void deletePayment(Long id) {

        Payment payment = getPaymentById(id);

        paymentRepository.delete(payment);
    }
}