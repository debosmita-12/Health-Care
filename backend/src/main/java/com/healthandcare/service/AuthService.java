package com.healthandcare.service;

import com.healthandcare.dto.AuthRequest;
import com.healthandcare.dto.AuthResponse;
import com.healthandcare.dto.RegisterDoctorRequest;
import com.healthandcare.dto.RegisterPatientRequest;
import com.healthandcare.exception.ValidationException;
import com.healthandcare.model.DoctorProfile;
import com.healthandcare.model.PatientProfile;
import com.healthandcare.model.User;
import com.healthandcare.repository.DoctorRepository;
import com.healthandcare.repository.NotificationRepository;
import com.healthandcare.repository.PatientRepository;
import com.healthandcare.repository.UserRepository;
import com.healthandcare.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PatientRepository patientRepository,
                       DoctorRepository doctorRepository,
                       NotificationRepository notificationRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim())
                .orElseThrow(() -> new ValidationException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            // Fallback for development if plain matches hash (e.g. initial seed)
            if (!request.getPassword().equals(user.getPasswordHash())) {
                throw new ValidationException("Invalid email or password.");
            }
        }

        if ("ROLE_DOCTOR".equals(user.getRole())) {
            DoctorProfile doc = doctorRepository.findByUserId(user.getId())
                    .orElse(null);
            if (doc != null && "PENDING".equalsIgnoreCase(doc.getVerificationStatus())) {
                throw new ValidationException("Your doctor application is pending administrator verification. Please wait for approval before logging in.");
            } else if (doc != null && "REJECTED".equalsIgnoreCase(doc.getVerificationStatus())) {
                throw new ValidationException("Your doctor verification request was rejected. Please contact administrator.");
            }
        }

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
        return new AuthResponse(token, user, "Login successful.");
    }

    @Transactional
    public AuthResponse registerPatient(RegisterPatientRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new ValidationException("An account with email " + req.getEmail() + " already exists.");
        }

        User user = new User();
        user.setEmail(req.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setFullName(req.getFullName().trim());
        user.setPhone(req.getPhone().trim());
        user.setRole("ROLE_PATIENT");
        user.setStatus("ACTIVE");

        Long userId = userRepository.save(user);

        PatientProfile profile = new PatientProfile();
        profile.setUserId(userId);
        profile.setDateOfBirth(req.getDateOfBirth());
        profile.setGender(req.getGender() != null ? req.getGender() : "Not Specified");
        profile.setBloodGroup(req.getBloodGroup());
        profile.setAddress(req.getAddress());
        profile.setEmergencyContact(req.getEmergencyContact());

        patientRepository.save(profile);

        notificationRepository.save(userId, "Account Activated", "Welcome to Health & Care! Your patient account is now ready.", "SYSTEM");

        String token = tokenProvider.generateToken(userId, user.getEmail(), user.getRole());
        return new AuthResponse(token, user, "Patient registered successfully.");
    }

    @Transactional
    public AuthResponse registerDoctor(RegisterDoctorRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new ValidationException("An account with email " + req.getEmail() + " already exists.");
        }

        User user = new User();
        user.setEmail(req.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setFullName(req.getFullName().trim());
        user.setPhone(req.getPhone().trim());
        user.setRole("ROLE_DOCTOR");
        user.setStatus("PENDING_VERIFICATION");

        Long userId = userRepository.save(user);

        DoctorProfile doc = new DoctorProfile();
        doc.setUserId(userId);
        doc.setDepartmentId(req.getDepartmentId());
        doc.setQualification(req.getQualification());
        doc.setSpecialization(req.getSpecialization());
        doc.setExperienceYears(req.getExperienceYears() != null ? req.getExperienceYears() : 1);
        doc.setMedicalRegistrationNo(req.getMedicalRegistrationNo());
        doc.setConsultationFee(req.getConsultationFee());
        doc.setBio(req.getBio());
        doc.setVerificationStatus("PENDING");

        doctorRepository.save(doc);

        notificationRepository.save(userId, "Application Submitted", "Your doctor verification application has been submitted and is pending admin approval.", "SYSTEM");

        return new AuthResponse(null, user, "Doctor registration submitted successfully. Your account is pending administrator verification.");
    }
}
