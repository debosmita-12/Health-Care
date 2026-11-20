package com.healthandcare.service;

import com.healthandcare.exception.ResourceNotFoundException;
import com.healthandcare.model.DoctorProfile;
import com.healthandcare.repository.DoctorRepository;
import com.healthandcare.repository.NotificationRepository;
import com.healthandcare.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public DoctorService(DoctorRepository doctorRepository,
                         UserRepository userRepository,
                         NotificationRepository notificationRepository) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    public DoctorProfile getProfileByUserId(Long userId) {
        return doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user ID " + userId));
    }

    public List<DoctorProfile> getApprovedDoctors() {
        return doctorRepository.findAllApproved();
    }

    public List<DoctorProfile> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public List<DoctorProfile> getPendingDoctors() {
        return doctorRepository.findPending();
    }

    @Transactional
    public void verifyDoctor(Long userId, boolean approved) {
        String status = approved ? "APPROVED" : "REJECTED";
        doctorRepository.updateVerificationStatus(userId, status);
        userRepository.updateStatus(userId, approved ? "ACTIVE" : "SUSPENDED");

        notificationRepository.save(userId,
                approved ? "Application Approved!" : "Application Not Approved",
                approved ? "Congratulations! Your doctor profile has been verified. You can now login and manage clinical appointments."
                         : "Your doctor verification application was reviewed and rejected. Please contact administration.",
                "VERIFICATION");
    }

    @Transactional
    public DoctorProfile updateProfile(Long userId, DoctorProfile updated) {
        DoctorProfile existing = getProfileByUserId(userId);
        existing.setQualification(updated.getQualification());
        existing.setSpecialization(updated.getSpecialization());
        existing.setExperienceYears(updated.getExperienceYears());
        existing.setConsultationFee(updated.getConsultationFee());
        existing.setBio(updated.getBio());
        existing.setAvailableDays(updated.getAvailableDays());
        existing.setWorkingHours(updated.getWorkingHours());
        if (updated.getDepartmentId() != null) existing.setDepartmentId(updated.getDepartmentId());

        doctorRepository.updateProfile(existing);

        if (updated.getFullName() != null && updated.getPhone() != null) {
            userRepository.updateProfile(userId, updated.getFullName(), updated.getPhone());
        }

        return getProfileByUserId(userId);
    }
}
