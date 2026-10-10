package com.hotelmanagement.controller;

import com.hotelmanagement.dto.LoginRequest;
import com.hotelmanagement.dto.LoginResponse;
import com.hotelmanagement.model.User;
import com.hotelmanagement.repository.UserRepository;
import com.hotelmanagement.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;

    public AuthController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response = userService.login(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        return userRepository.findByUsername(authentication.getName())
                .map(user -> {
                    Map<String, Object> details = new HashMap<>();
                    details.put("id", user.getId());
                    details.put("username", user.getUsername());
                    details.put("role", user.getRole());
                    return ResponseEntity.ok(details);
                })
                .orElse(ResponseEntity.status(404).body(Map.of("message", "User not found")));
    }
}