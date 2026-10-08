package com.hotelmanagement.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class PaymentRequest {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotNull(message = "Payment amount is required")
    @DecimalMin(
            value = "0.01",
            message = "Payment amount must be greater than 0"
    )
    private Double amount;

    @NotBlank(message = "Payment method is required")
    @Pattern(
            regexp = "CASH|CARD|UPI|NET_BANKING",
            message = "Payment method must be CASH, CARD, UPI, or NET_BANKING"
    )
    private String paymentMethod;

    @NotBlank(message = "Payment status is required")
    @Pattern(
            regexp = "PENDING|PAID|FAILED|REFUNDED",
            message = "Payment status must be PENDING, PAID, FAILED, or REFUNDED"
    )
    private String paymentStatus;

    public PaymentRequest() {
    }

    public PaymentRequest(Long bookingId,
                          Double amount,
                          String paymentMethod,
                          String paymentStatus) {
        this.bookingId = bookingId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}