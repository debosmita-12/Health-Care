package com.healthandcare.controller;

import com.healthandcare.model.*;
import com.healthandcare.repository.NotificationRepository;
import com.healthandcare.repository.UserRepository;
import com.healthandcare.service.AppointmentService;
import com.healthandcare.service.ClinicalService;
import com.healthandcare.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    private final PatientService patientService;
    private final AppointmentService appointmentService;
    private final ClinicalService clinicalService;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public PatientController(PatientService patientService,
                             AppointmentService appointmentService,
                             ClinicalService clinicalService,
                             NotificationRepository notificationRepository,
                             UserRepository userRepository) {
        this.patientService = patientService;
        this.appointmentService = appointmentService;
        this.clinicalService = clinicalService;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    private Long getUserId(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @GetMapping("/profile")
    public ResponseEntity<PatientProfile> getProfile(Authentication auth) {
        return ResponseEntity.ok(patientService.getProfileByUserId(getUserId(auth)));
    }

    @PutMapping("/profile")
    public ResponseEntity<PatientProfile> updateProfile(Authentication auth, @RequestBody PatientProfile updated) {
        return ResponseEntity.ok(patientService.updateProfile(getUserId(auth), updated));
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAppointments(Authentication auth) {
        return ResponseEntity.ok(appointmentService.getPatientAppointments(getUserId(auth)));
    }

    @GetMapping("/prescriptions")
    public ResponseEntity<List<Prescription>> getPrescriptions(Authentication auth) {
        return ResponseEntity.ok(clinicalService.getPrescriptionsForPatient(getUserId(auth)));
    }

    @GetMapping("/consultations")
    public ResponseEntity<List<Consultation>> getConsultations(Authentication auth) {
        return ResponseEntity.ok(clinicalService.getConsultationsForPatient(getUserId(auth)));
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getNotifications(Authentication auth) {
        return ResponseEntity.ok(notificationRepository.findByUserId(getUserId(auth)));
    }

    @PostMapping("/notifications/read")
    public ResponseEntity<Void> markNotificationsRead(Authentication auth) {
        notificationRepository.markAllAsRead(getUserId(auth));
        return ResponseEntity.ok().build();
    }
}
