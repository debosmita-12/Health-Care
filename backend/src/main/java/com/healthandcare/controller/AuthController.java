package com.healthandcare.controller;

import com.healthandcare.dto.AuthRequest;
import com.healthandcare.dto.AuthResponse;
import com.healthandcare.dto.RegisterDoctorRequest;
import com.healthandcare.dto.RegisterPatientRequest;
import com.healthandcare.exception.ValidationException;
import com.healthandcare.model.User;
import com.healthandcare.repository.UserRepository;
import com.healthandcare.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register/patient")
    public ResponseEntity<AuthResponse> registerPatient(@Valid @RequestBody RegisterPatientRequest request) {
        return ResponseEntity.ok(authService.registerPatient(request));
    }

    @PostMapping("/register/doctor")
    public ResponseEntity<AuthResponse> registerDoctor(@Valid @RequestBody RegisterDoctorRequest request) {
        return ResponseEntity.ok(authService.registerDoctor(request));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ValidationException("User is not authenticated.");
        }
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ValidationException("User not found"));
        // Mask password hash for security
        user.setPasswordHash(null);
        return ResponseEntity.ok(user);
    }
}
