package com.hotelmanagement.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hotelmanagement.dto.LoginRequest;
import com.hotelmanagement.dto.LoginResponse;
import com.hotelmanagement.dto.UserRequest;
import com.hotelmanagement.exception.ResourceNotFoundException;
import com.hotelmanagement.model.User;
import com.hotelmanagement.repository.UserRepository;
import com.hotelmanagement.security.JwtService;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    /*
     * Create a new user.
     */
    public User createUser(UserRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException(
                    "Username already exists"
            );
        }

        String encodedPassword =
                passwordEncoder.encode(request.getPassword());

        User user = new User(
                request.getUsername(),
                encodedPassword,
                request.getRole()
        );

        return userRepository.save(user);
    }

    /*
     * Get all users.
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /*
     * Get a user by ID.
     */
    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with ID: " + id
                        ));
    }

    /*
     * Update an existing user.
     */
    public User updateUser(
            Long id,
            UserRequest request) {

        User user = getUserById(id);

        /*
         * Check whether the new username is already
         * used by another user.
         */
        if (!user.getUsername()
                .equalsIgnoreCase(request.getUsername())
                && userRepository.existsByUsername(
                        request.getUsername())) {

            throw new IllegalArgumentException(
                    "Username already exists"
            );
        }

        user.setUsername(request.getUsername());

        /*
         * Always encode the new password.
         */
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole(request.getRole());

        return userRepository.save(user);
    }

    /*
     * Delete a user.
     */
    public void deleteUser(Long id) {

        User user = getUserById(id);

        /*
         * Prevent accidental deletion of the
         * main administrator account.
         */
        if ("admin".equalsIgnoreCase(user.getUsername())) {
            throw new IllegalArgumentException(
                    "The main admin account cannot be deleted"
            );
        }

        userRepository.delete(user);
    }

    /*
     * Authenticate user and generate JWT.
     */
    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid username or password"
                        ));

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {
            throw new IllegalArgumentException(
                    "Invalid username or password"
            );
        }

        String token = jwtService.generateToken(
                user.getUsername(),
                user.getRole()
        );

        return new LoginResponse(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                token,
                "Login successful"
        );
    }
}