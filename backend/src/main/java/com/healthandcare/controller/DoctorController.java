package com.healthandcare.controller;

import com.healthandcare.dto.UpdateStatusRequest;
import com.healthandcare.model.Appointment;
import com.healthandcare.model.DoctorProfile;
import com.healthandcare.model.User;
import com.healthandcare.repository.UserRepository;
import com.healthandcare.service.AppointmentService;
import com.healthandcare.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

    private final DoctorService doctorService;
    private final AppointmentService appointmentService;
    private final UserRepository userRepository;

    public DoctorController(DoctorService doctorService,
                            AppointmentService appointmentService,
                            UserRepository userRepository) {
        this.doctorService = doctorService;
        this.appointmentService = appointmentService;
        this.userRepository = userRepository;
    }

    private Long getUserId(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @GetMapping("/profile")
    public ResponseEntity<DoctorProfile> getProfile(Authentication auth) {
        return ResponseEntity.ok(doctorService.getProfileByUserId(getUserId(auth)));
    }

    @PutMapping("/profile")
    public ResponseEntity<DoctorProfile> updateProfile(Authentication auth, @RequestBody DoctorProfile updated) {
        return ResponseEntity.ok(doctorService.updateProfile(getUserId(auth), updated));
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAppointments(Authentication auth) {
        return ResponseEntity.ok(appointmentService.getDoctorAppointments(getUserId(auth)));
    }

    @PostMapping("/appointments/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest req) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, req.getStatus(), req.getNotes()));
    }
}
