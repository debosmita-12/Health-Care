package com.healthandcare.service;

import com.healthandcare.dto.AdminStatsDto;
import com.healthandcare.repository.AppointmentRepository;
import com.healthandcare.repository.DepartmentRepository;
import com.healthandcare.repository.DoctorRepository;
import com.healthandcare.repository.PatientRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final DepartmentRepository departmentRepository;

    public AdminService(PatientRepository patientRepository,
                        DoctorRepository doctorRepository,
                        AppointmentRepository appointmentRepository,
                        DepartmentRepository departmentRepository) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.departmentRepository = departmentRepository;
    }

    public AdminStatsDto getSystemStatistics() {
        long totalPatients = patientRepository.count();
        long totalDoctors = doctorRepository.count();
        long pendingDoctors = doctorRepository.countByStatus("PENDING");
        long totalAppointments = appointmentRepository.count();
        long completedAppointments = appointmentRepository.countByStatus("COMPLETED");
        long pendingAppointments = appointmentRepository.countByStatus("PENDING");
        long totalDepartments = departmentRepository.count();

        return new AdminStatsDto(
                totalPatients,
                totalDoctors,
                pendingDoctors,
                totalAppointments,
                completedAppointments,
                pendingAppointments,
                totalDepartments
        );
    }
}
