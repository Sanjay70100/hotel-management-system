package com.hotelmanagement.controller;

import com.hotelmanagement.dto.StaffRequest;
import com.hotelmanagement.model.Staff;
import com.hotelmanagement.service.StaffService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @PostMapping
    public ResponseEntity<Staff> createStaff(
            @Valid @RequestBody StaffRequest request) {

        return ResponseEntity.ok(
                staffService.createStaff(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<Staff>> getAllStaff() {

        return ResponseEntity.ok(
                staffService.getAllStaff()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Staff> getStaffById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                staffService.getStaffById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Staff> updateStaff(
            @PathVariable Long id,
            @Valid @RequestBody StaffRequest request) {

        return ResponseEntity.ok(
                staffService.updateStaff(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStaff(
            @PathVariable Long id) {

        staffService.deleteStaff(id);

        return ResponseEntity.ok(
                "Staff deleted successfully"
        );
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<Staff>> getStaffByDepartment(
            @PathVariable String department) {

        return ResponseEntity.ok(
                staffService.getStaffByDepartment(department)
        );
    }
}