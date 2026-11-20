package com.healthandcare.config;

import com.healthandcare.model.Department;
import com.healthandcare.model.DoctorProfile;
import com.healthandcare.model.PatientProfile;
import com.healthandcare.model.User;
import com.healthandcare.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    public DataInitializer(UserRepository userRepository,
                           PatientRepository patientRepository,
                           DoctorRepository doctorRepository,
                           DepartmentRepository departmentRepository,
                           PasswordEncoder passwordEncoder,
                           JdbcTemplate jdbcTemplate) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jdbcTemplate = jdbcTemplate;
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

        List<Department> allDepts = departmentRepository.findAll();
        Long cardDeptId = allDepts.stream().filter(d -> d.getName().contains("Cardiology")).findFirst().map(Department::getId).orElse(null);
        Long dentDeptId = allDepts.stream().filter(d -> d.getName().contains("Dental")).findFirst().map(Department::getId).orElse(null);
        Long pedDeptId = allDepts.stream().filter(d -> d.getName().contains("Pediatrics")).findFirst().map(Department::getId).orElse(null);
        Long orthoDeptId = allDepts.stream().filter(d -> d.getName().contains("Orthopedics")).findFirst().map(Department::getId).orElse(null);
        Long dermDeptId = allDepts.stream().filter(d -> d.getName().contains("Dermatology")).findFirst().map(Department::getId).orElse(null);
        Long neuroDeptId = allDepts.stream().filter(d -> d.getName().contains("Neurology")).findFirst().map(Department::getId).orElse(null);

        // 2. Seed Admin User
        if (userRepository.findByEmail("admin@healthandcare.com").isEmpty()) {
            User admin = new User(null, "admin@healthandcare.com", passwordEncoder.encode("admin123"), "System Administrator", "+91 98000 11000", "ROLE_ADMIN", "ACTIVE", null);
            userRepository.save(admin);
        }

        // 3. Seed Demo Doctors for ALL 6 Specialties

        // 3.1 Cardiology: Dr. Rajesh Iyer
        if (userRepository.findByEmail("rajesh.iyer@healthandcare.com").isEmpty()) {
            User doc1 = new User(null, "rajesh.iyer@healthandcare.com", passwordEncoder.encode("doctor123"), "Dr. Rajesh Iyer", "+91 98111 22334", "ROLE_DOCTOR", "ACTIVE", null);
            Long uid1 = userRepository.save(doc1);
            DoctorProfile p1 = new DoctorProfile();
            p1.setUserId(uid1);
            p1.setDepartmentId(cardDeptId);
            p1.setQualification("MD, DM (Cardiology)");
            p1.setSpecialization("Interventional Cardiology");
            p1.setExperienceYears(12);
            p1.setMedicalRegistrationNo("MCI-88321-CARD");
            p1.setConsultationFee(BigDecimal.valueOf(800.00));
            p1.setBio("Senior Cardiologist specializing in preventive heart health, angioplasty, and lipid management.");
            p1.setVerificationStatus("APPROVED");
            p1.setAvailableDays("Mon,Tue,Wed,Thu,Fri");
            p1.setWorkingHours("09:00 - 15:00");
            doctorRepository.save(p1);
        } else {
            userRepository.findByEmail("rajesh.iyer@healthandcare.com").ifPresent(u -> {
                jdbcTemplate.update("UPDATE doctor_profiles SET department_id = ?, verification_status = 'APPROVED' WHERE user_id = ?", cardDeptId, u.getId());
            });
        }

        // 3.2 Dental & Maxillofacial: Dr. Sneha Roy
        if (userRepository.findByEmail("sneha.roy@healthandcare.com").isEmpty()) {
            User doc2 = new User(null, "sneha.roy@healthandcare.com", passwordEncoder.encode("doctor123"), "Dr. Sneha Roy", "+91 98222 33445", "ROLE_DOCTOR", "ACTIVE", null);
            Long uid2 = userRepository.save(doc2);
            DoctorProfile p2 = new DoctorProfile();
            p2.setUserId(uid2);
            p2.setDepartmentId(dentDeptId);
            p2.setQualification("BDS, MDS (Orthodontics)");
            p2.setSpecialization("Cosmetic & Restorative Dentistry");
            p2.setExperienceYears(8);
            p2.setMedicalRegistrationNo("DCI-91422-DENT");
            p2.setConsultationFee(BigDecimal.valueOf(600.00));
            p2.setBio("Specialist in smile aesthetics, aligners, and painless dental restorations.");
            p2.setVerificationStatus("APPROVED");
            p2.setAvailableDays("Mon,Wed,Fri,Sat");
            p2.setWorkingHours("10:00 - 18:00");
            doctorRepository.save(p2);
        } else {
            userRepository.findByEmail("sneha.roy@healthandcare.com").ifPresent(u -> {
                jdbcTemplate.update("UPDATE doctor_profiles SET department_id = ?, verification_status = 'APPROVED' WHERE user_id = ?", dentDeptId, u.getId());
            });
        }

        // 3.3 Pediatrics & Child Care: Dr. Vikram Seth
        if (userRepository.findByEmail("vikram.seth@healthandcare.com").isEmpty()) {
            User doc3 = new User(null, "vikram.seth@healthandcare.com", passwordEncoder.encode("doctor123"), "Dr. Vikram Seth", "+91 98333 44556", "ROLE_DOCTOR", "ACTIVE", null);
            Long uid3 = userRepository.save(doc3);
            DoctorProfile p3 = new DoctorProfile();
            p3.setUserId(uid3);
            p3.setDepartmentId(pedDeptId);
            p3.setQualification("MBBS, MD (Pediatrics)");
            p3.setSpecialization("Pediatric Care & Immunization");
            p3.setExperienceYears(7);
            p3.setMedicalRegistrationNo("MCI-72109-PED");
            p3.setConsultationFee(BigDecimal.valueOf(500.00));
            p3.setBio("Senior Pediatrician dedicated to childhood wellness, neonatal care, and growth tracking.");
            p3.setVerificationStatus("APPROVED");
            p3.setAvailableDays("Mon,Tue,Thu,Sat");
            p3.setWorkingHours("09:00 - 14:00");
            doctorRepository.save(p3);
        } else {
            userRepository.findByEmail("vikram.seth@healthandcare.com").ifPresent(u -> {
                jdbcTemplate.update("UPDATE users SET status = 'ACTIVE' WHERE id = ?", u.getId());
                jdbcTemplate.update("UPDATE doctor_profiles SET department_id = ?, verification_status = 'APPROVED' WHERE user_id = ?", pedDeptId, u.getId());
            });
        }

        // 3.4 Orthopedics & Joint Care: Dr. Arjun Kapoor
        if (userRepository.findByEmail("arjun.kapoor@healthandcare.com").isEmpty()) {
            User doc4 = new User(null, "arjun.kapoor@healthandcare.com", passwordEncoder.encode("doctor123"), "Dr. Arjun Kapoor", "+91 98444 55667", "ROLE_DOCTOR", "ACTIVE", null);
            Long uid4 = userRepository.save(doc4);
            DoctorProfile p4 = new DoctorProfile();
            p4.setUserId(uid4);
            p4.setDepartmentId(orthoDeptId);
            p4.setQualification("MBBS, MS (Orthopedics), MCh");
            p4.setSpecialization("Orthopedic Surgery & Joint Care");
            p4.setExperienceYears(14);
            p4.setMedicalRegistrationNo("MCI-55410-ORTHO");
            p4.setConsultationFee(BigDecimal.valueOf(900.00));
            p4.setBio("Consultant Orthopedic Surgeon specializing in joint replacement, sports trauma, and spine wellness.");
            p4.setVerificationStatus("APPROVED");
            p4.setAvailableDays("Mon,Wed,Thu,Fri");
            p4.setWorkingHours("10:00 - 16:00");
            doctorRepository.save(p4);
        } else {
            userRepository.findByEmail("arjun.kapoor@healthandcare.com").ifPresent(u -> {
                jdbcTemplate.update("UPDATE doctor_profiles SET department_id = ?, verification_status = 'APPROVED' WHERE user_id = ?", orthoDeptId, u.getId());
            });
        }

        // 3.5 Dermatology & Skin Care: Dr. Kavita Menon
        if (userRepository.findByEmail("kavita.menon@healthandcare.com").isEmpty()) {
            User doc5 = new User(null, "kavita.menon@healthandcare.com", passwordEncoder.encode("doctor123"), "Dr. Kavita Menon", "+91 98555 66778", "ROLE_DOCTOR", "ACTIVE", null);
            Long uid5 = userRepository.save(doc5);
            DoctorProfile p5 = new DoctorProfile();
            p5.setUserId(uid5);
            p5.setDepartmentId(dermDeptId);
            p5.setQualification("MD (Dermatology, Venereology & Leprosy)");
            p5.setSpecialization("Clinical & Aesthetic Dermatology");
            p5.setExperienceYears(9);
            p5.setMedicalRegistrationNo("MCI-66321-DERM");
            p5.setConsultationFee(BigDecimal.valueOf(750.00));
            p5.setBio("Consultant Dermatologist providing clinical therapies, acne care, and dermatological wellness.");
            p5.setVerificationStatus("APPROVED");
            p5.setAvailableDays("Tue,Wed,Fri,Sat");
            p5.setWorkingHours("11:00 - 17:00");
            doctorRepository.save(p5);
        } else {
            userRepository.findByEmail("kavita.menon@healthandcare.com").ifPresent(u -> {
                jdbcTemplate.update("UPDATE doctor_profiles SET department_id = ?, verification_status = 'APPROVED' WHERE user_id = ?", dermDeptId, u.getId());
            });
        }

        // 3.6 Neurology & Brain Health: Dr. Farhan Qureshi
        if (userRepository.findByEmail("farhan.qureshi@healthandcare.com").isEmpty()) {
            User doc6 = new User(null, "farhan.qureshi@healthandcare.com", passwordEncoder.encode("doctor123"), "Dr. Farhan Qureshi", "+91 98666 77889", "ROLE_DOCTOR", "ACTIVE", null);
            Long uid6 = userRepository.save(doc6);
            DoctorProfile p6 = new DoctorProfile();
            p6.setUserId(uid6);
            p6.setDepartmentId(neuroDeptId);
            p6.setQualification("MD, DM (Neurology)");
            p6.setSpecialization("Neurology & Neuro-Rehabilitation");
            p6.setExperienceYears(15);
            p6.setMedicalRegistrationNo("MCI-77889-NEURO");
            p6.setConsultationFee(BigDecimal.valueOf(1000.00));
            p6.setBio("Senior Neurologist with expertise in stroke management, epilepsy, migraines, and cognitive disorders.");
            p6.setVerificationStatus("APPROVED");
            p6.setAvailableDays("Mon,Tue,Wed,Fri");
            p6.setWorkingHours("09:30 - 15:30");
            doctorRepository.save(p6);
        } else {
            userRepository.findByEmail("farhan.qureshi@healthandcare.com").ifPresent(u -> {
                jdbcTemplate.update("UPDATE doctor_profiles SET department_id = ?, verification_status = 'APPROVED' WHERE user_id = ?", neuroDeptId, u.getId());
            });
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
