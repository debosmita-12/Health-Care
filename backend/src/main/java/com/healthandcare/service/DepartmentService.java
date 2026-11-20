package com.healthandcare.service;

import com.healthandcare.exception.ResourceNotFoundException;
import com.healthandcare.model.Department;
import com.healthandcare.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<Department> getAllActive() {
        return departmentRepository.findAllActive();
    }

    public List<Department> getAll() {
        return departmentRepository.findAll();
    }

    public Department getById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department #" + id + " not found."));
    }

    public Department createDepartment(Department dept) {
        Long id = departmentRepository.save(dept);
        dept.setId(id);
        return dept;
    }

    public Department updateDepartment(Department dept) {
        departmentRepository.update(dept);
        return getById(dept.getId());
    }

    public boolean deleteDepartment(Long id) {
        return departmentRepository.delete(id);
    }
}
