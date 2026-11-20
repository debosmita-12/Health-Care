package com.healthandcare.service;

import com.healthandcare.dto.BookAppointmentRequest;
import com.healthandcare.exception.ResourceNotFoundException;
import com.healthandcare.exception.ValidationException;
import com.healthandcare.model.Appointment;
import com.healthandcare.model.DoctorProfile;
import com.healthandcare.repository.AppointmentRepository;
import com.healthandcare.repository.DoctorRepository;
import com.healthandcare.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final NotificationRepository notificationRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              DoctorRepository doctorRepository,
                              NotificationRepository notificationRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public Appointment bookAppointment(Long patientId, BookAppointmentRequest req) {
        // 1. Past-date validation
        if (req.getAppointmentDate().isBefore(LocalDate.now())) {
            throw new ValidationException("Cannot book an appointment in the past. Please select today or a future date.");
        }

        // 2. Doctor existence and verification check
        DoctorProfile doc = doctorRepository.findByUserId(req.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Selected doctor profile was not found."));

        if (!"APPROVED".equalsIgnoreCase(doc.getVerificationStatus())) {
            throw new ValidationException("Selected doctor is not currently verified to accept clinical bookings.");
        }

        // 3. Double-booking / Slot-collision check
        if (appointmentRepository.isDoctorSlotTaken(req.getDoctorId(), req.getAppointmentDate(), req.getAppointmentTime())) {
            throw new ValidationException("Dr. " + doc.getFullName() + " is already booked on " + req.getAppointmentDate() + " at " + req.getAppointmentTime() + ". Please select another slot.");
        }

        // 4. Save Appointment via Spring JDBC
        Appointment appt = new Appointment();
        appt.setPatientId(patientId);
        appt.setDoctorId(req.getDoctorId());
        appt.setDepartmentId(req.getDepartmentId() != null ? req.getDepartmentId() : doc.getDepartmentId());
        appt.setAppointmentDate(req.getAppointmentDate());
        appt.setAppointmentTime(req.getAppointmentTime());
        appt.setStatus("PENDING");
        appt.setReason(req.getReason());
        appt.setNotes("Appointment request submitted by patient.");

        Long apptId = appointmentRepository.save(appt);
        appt.setId(apptId);

        // 5. Notifications
        notificationRepository.save(req.getDoctorId(), "New Appointment Request",
                "Patient booked an appointment for " + req.getAppointmentDate() + " at " + req.getAppointmentTime() + ". Action required.", "APPOINTMENT");
        notificationRepository.save(patientId, "Booking Submitted",
                "Your appointment request with Dr. " + doc.getFullName() + " is submitted and pending confirmation.", "APPOINTMENT");

        return appointmentRepository.findById(apptId).orElse(appt);
    }

    @Transactional
    public Appointment updateStatus(Long appointmentId, String newStatus, String notes) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment #" + appointmentId + " not found."));

        appointmentRepository.updateStatus(appointmentId, newStatus, notes);

        // Notify patient
        notificationRepository.save(appt.getPatientId(), "Appointment Status Updated",
                "Your appointment on " + appt.getAppointmentDate() + " has been marked as " + newStatus + ".", "APPOINTMENT");

        return appointmentRepository.findById(appointmentId).orElse(appt);
    }

    public List<Appointment> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getDoctorAppointments(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment #" + id + " not found."));
    }

    public boolean deleteAppointment(Long id) {
        return appointmentRepository.deleteById(id);
    }
}
