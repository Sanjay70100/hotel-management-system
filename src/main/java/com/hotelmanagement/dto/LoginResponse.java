package com.hotelmanagement.dto;

public class LoginResponse {

    private Long id;
    private String username;
    private String role;
    private String token;
    private String message;

    public LoginResponse() {
    }

    public LoginResponse(Long id,
                         String username,
                         String role,
                         String token,
                         String message) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.token = token;
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}