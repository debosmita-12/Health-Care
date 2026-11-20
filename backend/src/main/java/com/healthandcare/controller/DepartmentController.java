package com.healthandcare.controller;

import com.healthandcare.model.Department;
import com.healthandcare.model.DoctorProfile;
import com.healthandcare.service.DepartmentService;
import com.healthandcare.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class DepartmentController {

    private final DepartmentService departmentService;
    private final DoctorService doctorService;

    public DepartmentController(DepartmentService departmentService, DoctorService doctorService) {
        this.departmentService = departmentService;
        this.doctorService = doctorService;
    }

    @GetMapping("/api/departments")
    public ResponseEntity<List<Department>> getActiveDepartments() {
        return ResponseEntity.ok(departmentService.getAllActive());
    }

    @GetMapping("/api/doctors/approved")
    public ResponseEntity<List<DoctorProfile>> getApprovedDoctors() {
        return ResponseEntity.ok(doctorService.getApprovedDoctors());
    }
}
