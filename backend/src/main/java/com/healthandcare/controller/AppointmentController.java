package com.healthandcare.controller;

import com.healthandcare.dto.BookAppointmentRequest;
import com.healthandcare.dto.UpdateStatusRequest;
import com.healthandcare.model.Appointment;
import com.healthandcare.model.User;
import com.healthandcare.repository.UserRepository;
import com.healthandcare.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepository;

    public AppointmentController(AppointmentService appointmentService, UserRepository userRepository) {
        this.appointmentService = appointmentService;
        this.userRepository = userRepository;
    }

    private Long getUserId(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @PostMapping("/book")
    public ResponseEntity<Appointment> bookAppointment(
            Authentication auth,
            @Valid @RequestBody BookAppointmentRequest req) {
        return ResponseEntity.ok(appointmentService.bookAppointment(getUserId(auth), req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest req) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, req.getStatus(), req.getNotes()));
    }
}
