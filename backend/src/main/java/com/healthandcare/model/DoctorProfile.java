package com.healthandcare.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DoctorProfile {
    private Long id;
    private Long userId;
    private Long departmentId;
    private String departmentName;
    private String qualification;
    private String specialization;
    private Integer experienceYears;
    private String medicalRegistrationNo;
    private BigDecimal consultationFee;
    private String bio;
    private String verificationStatus; // PENDING, APPROVED, REJECTED
    private String availableDays;
    private String workingHours;
    private LocalDateTime createdAt;

    // Joined fields from User
    private String fullName;
    private String email;
    private String phone;

    public DoctorProfile() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public String getMedicalRegistrationNo() { return medicalRegistrationNo; }
    public void setMedicalRegistrationNo(String medicalRegistrationNo) { this.medicalRegistrationNo = medicalRegistrationNo; }

    public BigDecimal getConsultationFee() { return consultationFee; }
    public void setConsultationFee(BigDecimal consultationFee) { this.consultationFee = consultationFee; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getAvailableDays() { return availableDays; }
    public void setAvailableDays(String availableDays) { this.availableDays = availableDays; }

    public String getWorkingHours() { return workingHours; }
    public void setWorkingHours(String workingHours) { this.workingHours = workingHours; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
