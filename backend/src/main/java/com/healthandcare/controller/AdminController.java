package com.healthandcare.controller;

import com.healthandcare.dto.AdminStatsDto;
import com.healthandcare.model.Appointment;
import com.healthandcare.model.Department;
import com.healthandcare.model.DoctorProfile;
import com.healthandcare.model.PatientProfile;
import com.healthandcare.service.AdminService;
import com.healthandcare.service.AppointmentService;
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

    public AdminController(AdminService adminService,
                           DoctorService doctorService,
                           PatientService patientService,
                           AppointmentService appointmentService,
                           DepartmentService departmentService) {
        this.adminService = adminService;
        this.doctorService = doctorService;
        this.patientService = patientService;
        this.appointmentService = appointmentService;
        this.departmentService = departmentService;
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

    @GetMapping("/patients")
    public ResponseEntity<List<PatientProfile>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
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
