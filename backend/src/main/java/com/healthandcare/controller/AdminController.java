package com.healthandcare.controller;

import com.healthandcare.dto.AdminStatsDto;
import com.healthandcare.dto.RegisterDoctorRequest;
import com.healthandcare.dto.RegisterPatientRequest;
import com.healthandcare.model.Appointment;
import com.healthandcare.model.Department;
import com.healthandcare.model.DoctorProfile;
import com.healthandcare.model.PatientProfile;
import com.healthandcare.model.Prescription;
import com.healthandcare.repository.UserRepository;
import com.healthandcare.service.AdminService;
import com.healthandcare.service.AppointmentService;
import com.healthandcare.service.AuthService;
import com.healthandcare.service.ClinicalService;
import com.healthandcare.service.DepartmentService;
import com.healthandcare.service.DoctorService;
import com.healthandcare.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final DoctorService doctorService;
    private final PatientService patientService;
    private final AppointmentService appointmentService;
    private final DepartmentService departmentService;
    private final ClinicalService clinicalService;
    private final AuthService authService;
    private final UserRepository userRepository;

    public AdminController(AdminService adminService,
                           DoctorService doctorService,
                           PatientService patientService,
                           AppointmentService appointmentService,
                           DepartmentService departmentService,
                           ClinicalService clinicalService,
                           AuthService authService,
                           UserRepository userRepository) {
        this.adminService = adminService;
        this.doctorService = doctorService;
        this.patientService = patientService;
        this.appointmentService = appointmentService;
        this.departmentService = departmentService;
        this.clinicalService = clinicalService;
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDto> getStats() {
        return ResponseEntity.ok(adminService.getSystemStatistics());
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorProfile>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/doctors/pending")
    public ResponseEntity<List<DoctorProfile>> getPendingDoctors() {
        return ResponseEntity.ok(doctorService.getPendingDoctors());
    }

    @PostMapping("/doctors/{userId}/verify")
    public ResponseEntity<Void> verifyDoctor(@PathVariable Long userId, @RequestParam boolean approved) {
        doctorService.verifyDoctor(userId, approved);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/doctors")
    public ResponseEntity<DoctorProfile> createDoctor(@RequestBody RegisterDoctorRequest request) {
        authService.registerDoctor(request);
        Long userId = userRepository.findByEmail(request.getEmail()).orElseThrow().getId();
        doctorService.verifyDoctor(userId, true);
        return ResponseEntity.ok(doctorService.getProfileByUserId(userId));
    }

    @PutMapping("/doctors/{userId}")
    public ResponseEntity<DoctorProfile> updateDoctor(@PathVariable Long userId, @RequestBody DoctorProfile profile) {
        return ResponseEntity.ok(doctorService.updateProfile(userId, profile));
    }

    @DeleteMapping("/doctors/{userId}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long userId) {
        doctorService.deleteDoctor(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/patients")
    public ResponseEntity<List<PatientProfile>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @PostMapping("/patients")
    public ResponseEntity<PatientProfile> createPatient(@RequestBody RegisterPatientRequest request) {
        authService.registerPatient(request);
        Long userId = userRepository.findByEmail(request.getEmail()).orElseThrow().getId();
        return ResponseEntity.ok(patientService.getProfileByUserId(userId));
    }

    @PutMapping("/patients/{userId}")
    public ResponseEntity<PatientProfile> updatePatient(@PathVariable Long userId, @RequestBody PatientProfile profile) {
        return ResponseEntity.ok(patientService.updateProfile(userId, profile));
    }

    @DeleteMapping("/patients/{userId}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long userId) {
        patientService.deletePatient(userId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/patients/{userId}/status")
    public ResponseEntity<Void> updatePatientStatus(@PathVariable Long userId, @RequestParam String status) {
        patientService.updateStatus(userId, status);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/records/prescriptions")
    public ResponseEntity<List<Prescription>> getAllPrescriptions() {
        return ResponseEntity.ok(clinicalService.getAllPrescriptions());
    }

    @DeleteMapping("/records/prescriptions/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable Long id) {
        clinicalService.deletePrescription(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAll());
    }

    @PostMapping("/departments")
    public ResponseEntity<Department> createDepartment(@RequestBody Department dept) {
        return ResponseEntity.ok(departmentService.createDepartment(dept));
    }

    @PutMapping("/departments/{id}")
    public ResponseEntity<Department> updateDepartment(@PathVariable Long id, @RequestBody Department dept) {
        dept.setId(id);
        return ResponseEntity.ok(departmentService.updateDepartment(dept));
    }

    @DeleteMapping("/departments/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok().build();
    }
}
