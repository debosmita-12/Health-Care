package com.healthandcare.service;

import com.healthandcare.exception.ResourceNotFoundException;
import com.healthandcare.model.PatientProfile;
import com.healthandcare.repository.PatientRepository;
import com.healthandcare.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public PatientService(PatientRepository patientRepository, UserRepository userRepository) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    public PatientProfile getProfileByUserId(Long userId) {
        return patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user ID " + userId));
    }

    public List<PatientProfile> getAllPatients() {
        return patientRepository.findAll();
    }

    @Transactional
    public PatientProfile updateProfile(Long userId, PatientProfile updated) {
        PatientProfile existing = getProfileByUserId(userId);
        existing.setDateOfBirth(updated.getDateOfBirth());
        existing.setGender(updated.getGender());
        existing.setBloodGroup(updated.getBloodGroup());
        existing.setAddress(updated.getAddress());
        existing.setEmergencyContact(updated.getEmergencyContact());

        patientRepository.update(existing);

        if (updated.getFullName() != null && updated.getPhone() != null) {
            userRepository.updateProfile(userId, updated.getFullName(), updated.getPhone());
        }

        return getProfileByUserId(userId);
    }
}
