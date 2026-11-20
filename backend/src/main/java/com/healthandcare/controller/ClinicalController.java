package com.healthandcare.controller;

import com.healthandcare.dto.CreateConsultationRequest;
import com.healthandcare.dto.CreatePrescriptionRequest;
import com.healthandcare.model.Consultation;
import com.healthandcare.model.Prescription;
import com.healthandcare.model.User;
import com.healthandcare.repository.UserRepository;
import com.healthandcare.service.ClinicalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clinical")
public class ClinicalController {

    private final ClinicalService clinicalService;
    private final UserRepository userRepository;

    public ClinicalController(ClinicalService clinicalService, UserRepository userRepository) {
        this.clinicalService = clinicalService;
        this.userRepository = userRepository;
    }

    private Long getUserId(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @PostMapping("/consultation")
    public ResponseEntity<Consultation> createConsultation(
            Authentication auth,
            @Valid @RequestBody CreateConsultationRequest req) {
        return ResponseEntity.ok(clinicalService.createConsultation(getUserId(auth), req));
    }

    @PostMapping("/prescription")
    public ResponseEntity<Prescription> createPrescription(
            Authentication auth,
            @Valid @RequestBody CreatePrescriptionRequest req) {
        return ResponseEntity.ok(clinicalService.createPrescription(getUserId(auth), req));
    }
}
