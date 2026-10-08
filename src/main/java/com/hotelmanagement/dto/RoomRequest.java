package com.hotelmanagement.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RoomRequest {

    @NotBlank(message = "Room number is required")
    @Size(max = 20, message = "Room number cannot exceed 20 characters")
    private String roomNumber;

    @NotBlank(message = "Room type is required")
    @Size(max = 50, message = "Room type cannot exceed 50 characters")
    private String roomType;

    @DecimalMin(
            value = "0.0",
            inclusive = false,
            message = "Room price must be greater than 0"
    )
    private Double price;

    @NotBlank(message = "Room status is required")
    private String status;

    public RoomRequest() {
    }

    public RoomRequest(String roomNumber, String roomType,
                       Double price, String status) {
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.price = price;
        this.status = status;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}