package com.healthandcare.config;

import com.healthandcare.model.Department;
import com.healthandcare.model.DoctorProfile;
import com.healthandcare.model.PatientProfile;
import com.healthandcare.model.User;
import com.healthandcare.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           PatientRepository patientRepository,
                           DoctorRepository doctorRepository,
                           DepartmentRepository departmentRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // 1. Seed Departments if empty
        if (departmentRepository.count() == 0) {
            departmentRepository.save(new Department(null, "Cardiology", "Cardiovascular diagnostics, ECG, echocardiography, and heart health.", "HeartPulse", true, null));
            departmentRepository.save(new Department(null, "Dental & Maxillofacial", "Preventive dentistry, aesthetic smile design, and pain-free treatments.", "Smile", true, null));
            departmentRepository.save(new Department(null, "Pediatrics & Child Care", "Specialized pediatric wellness, growth tracking, and immunizations.", "Baby", true, null));
            departmentRepository.save(new Department(null, "Orthopedics & Joint Care", "Joint rehabilitation, fracture care, and musculoskeletal wellness.", "Bone", true, null));
            departmentRepository.save(new Department(null, "Dermatology & Skin Care", "Clinical dermatological therapies, acne treatment, and skin rejuvenation.", "Sparkles", true, null));
            departmentRepository.save(new Department(null, "Neurology & Brain Health", "Cognitive therapy, migraine management, and nervous system diagnosis.", "Brain", true, null));
        }

        // 2. Seed Admin User
        if (userRepository.findByEmail("admin@healthandcare.com").isEmpty()) {
            User admin = new User(null, "admin@healthandcare.com", passwordEncoder.encode("admin123"), "System Administrator", "+91 98000 11000", "ROLE_ADMIN", "ACTIVE", null);
            userRepository.save(admin);
        }

        // 3. Seed Doctors
        if (userRepository.findByEmail("rajesh.iyer@healthandcare.com").isEmpty()) {
            User doc1 = new User(null, "rajesh.iyer@healthandcare.com", passwordEncoder.encode("doctor123"), "Dr. Rajesh Iyer", "+91 98111 22334", "ROLE_DOCTOR", "ACTIVE", null);
            Long uid1 = userRepository.save(doc1);
            DoctorProfile p1 = new DoctorProfile();
            p1.setUserId(uid1);
            p1.setQualification("MD, DM (Cardiology)");
            p1.setSpecialization("Interventional Cardiology");
            p1.setExperienceYears(12);
            p1.setMedicalRegistrationNo("MCI-88321-CARD");
            p1.setConsultationFee(BigDecimal.valueOf(800.00));
            p1.setBio("Senior Cardiologist specializing in preventive heart health and lipid management.");
            p1.setVerificationStatus("APPROVED");
            p1.setAvailableDays("Mon,Tue,Wed,Thu,Fri");
            p1.setWorkingHours("09:00 - 15:00");
            doctorRepository.save(p1);
        }

        if (userRepository.findByEmail("sneha.roy@healthandcare.com").isEmpty()) {
            User doc2 = new User(null, "sneha.roy@healthandcare.com", passwordEncoder.encode("doctor123"), "Dr. Sneha Roy", "+91 98222 33445", "ROLE_DOCTOR", "ACTIVE", null);
            Long uid2 = userRepository.save(doc2);
            DoctorProfile p2 = new DoctorProfile();
            p2.setUserId(uid2);
            p2.setQualification("BDS, MDS (Orthodontics)");
            p2.setSpecialization("Cosmetic & Restorative Dentistry");
            p2.setExperienceYears(8);
            p2.setMedicalRegistrationNo("DCI-91422-DENT");
            p2.setConsultationFee(BigDecimal.valueOf(600.00));
            p2.setBio("Specialist in smile design, invisible aligners, and painless dental care.");
            p2.setVerificationStatus("APPROVED");
            p2.setAvailableDays("Mon,Wed,Fri,Sat");
            p2.setWorkingHours("10:00 - 18:00");
            doctorRepository.save(p2);
        }

        if (userRepository.findByEmail("vikram.seth@healthandcare.com").isEmpty()) {
            User doc3 = new User(null, "vikram.seth@healthandcare.com", passwordEncoder.encode("doctor123"), "Dr. Vikram Seth", "+91 98333 44556", "ROLE_DOCTOR", "PENDING_VERIFICATION", null);
            Long uid3 = userRepository.save(doc3);
            DoctorProfile p3 = new DoctorProfile();
            p3.setUserId(uid3);
            p3.setQualification("MBBS, MD (Pediatrics)");
            p3.setSpecialization("Pediatric Care & Immunization");
            p3.setExperienceYears(5);
            p3.setMedicalRegistrationNo("MCI-72109-PED");
            p3.setConsultationFee(BigDecimal.valueOf(500.00));
            p3.setBio("Pediatrician dedicated to early childhood wellness and growth tracking.");
            p3.setVerificationStatus("PENDING");
            p3.setAvailableDays("Tue,Thu,Sat");
            p3.setWorkingHours("09:00 - 14:00");
            doctorRepository.save(p3);
        }

        // 4. Seed Patients
        if (userRepository.findByEmail("aarav.sharma@example.com").isEmpty()) {
            User pat1 = new User(null, "aarav.sharma@example.com", passwordEncoder.encode("patient123"), "Aarav Sharma", "+91 98765 43210", "ROLE_PATIENT", "ACTIVE", null);
            Long puid1 = userRepository.save(pat1);
            PatientProfile pp1 = new PatientProfile();
            pp1.setUserId(puid1);
            pp1.setDateOfBirth(LocalDate.of(1992, 5, 14));
            pp1.setGender("Male");
            pp1.setBloodGroup("O+");
            pp1.setAddress("42 Marine Drive, Mumbai");
            pp1.setEmergencyContact("+91 98765 00001");
            patientRepository.save(pp1);
        }

        if (userRepository.findByEmail("priya.patel@example.com").isEmpty()) {
            User pat2 = new User(null, "priya.patel@example.com", passwordEncoder.encode("patient123"), "Priya Patel", "+91 98765 43211", "ROLE_PATIENT", "ACTIVE", null);
            Long puid2 = userRepository.save(pat2);
            PatientProfile pp2 = new PatientProfile();
            pp2.setUserId(puid2);
            pp2.setDateOfBirth(LocalDate.of(1996, 8, 22));
            pp2.setGender("Female");
            pp2.setBloodGroup("B+");
            pp2.setAddress("15 Senapati Bapat Marg, Pune");
            pp2.setEmergencyContact("+91 98765 00002");
            patientRepository.save(pp2);
        }
    }
}
