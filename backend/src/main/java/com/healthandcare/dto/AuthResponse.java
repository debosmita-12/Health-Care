package com.healthandcare.dto;

import com.healthandcare.model.User;

public class AuthResponse {
    private String token;
    private Long id;
    private String email;
    private String fullName;
    private String role;
    private String status;
    private String message;

    public AuthResponse() {}

    public AuthResponse(String token, User user, String message) {
        this.token = token;
        if (user != null) {
            this.id = user.getId();
            this.email = user.getEmail();
            this.fullName = user.getFullName();
            this.role = user.getRole();
            this.status = user.getStatus();
        }
        this.message = message;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
