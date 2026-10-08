package com.hotelmanagement.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hotelmanagement.dto.StaffRequest;
import com.hotelmanagement.exception.ResourceNotFoundException;
import com.hotelmanagement.model.Staff;
import com.hotelmanagement.repository.StaffRepository;

@Service
public class StaffService {

    private final StaffRepository staffRepository;

    public StaffService(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    // CREATE
    public Staff createStaff(StaffRequest request) {

        if (staffRepository.existsByEmail(
                request.getEmail())) {

            throw new IllegalArgumentException(
                    "Staff member with this email already exists"
            );
        }

        Staff staff = new Staff(
                request.getName(),
                request.getEmail(),
                request.getPhone(),
                request.getDepartment(),
                request.getPosition()
        );

        return staffRepository.save(staff);
    }

    // READ ALL
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    // READ BY ID
    public Staff getStaffById(Long id) {

        return staffRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Staff not found with ID: " + id
                        )
                );
    }

    // UPDATE
    public Staff updateStaff(
            Long id,
            StaffRequest request) {

        Staff staff = getStaffById(id);

        if (!staff.getEmail().equalsIgnoreCase(
                request.getEmail())
                && staffRepository.existsByEmail(
                request.getEmail())) {

            throw new IllegalArgumentException(
                    "Another staff member already uses this email"
            );
        }

        staff.setName(request.getName());
        staff.setEmail(request.getEmail());
        staff.setPhone(request.getPhone());
        staff.setDepartment(request.getDepartment());
        staff.setPosition(request.getPosition());

        return staffRepository.save(staff);
    }

    // DELETE
    public void deleteStaff(Long id) {

        Staff staff = getStaffById(id);

        staffRepository.delete(staff);
    }

    // GET BY DEPARTMENT
    public List<Staff> getStaffByDepartment(
            String department) {

        return staffRepository.findByDepartment(
                department
        );
    }
}