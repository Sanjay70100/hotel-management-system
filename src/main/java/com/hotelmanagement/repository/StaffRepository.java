package com.hotelmanagement.repository;

import com.hotelmanagement.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {

    // Find staff members by department
    List<Staff> findByDepartment(String department);

    // Check whether a staff member with the given email already exists
    boolean existsByEmail(String email);
}