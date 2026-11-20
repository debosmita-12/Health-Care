package com.healthandcare.service;

import com.healthandcare.dto.CreateConsultationRequest;
import com.healthandcare.dto.CreatePrescriptionRequest;
import com.healthandcare.exception.ResourceNotFoundException;
import com.healthandcare.model.Appointment;
import com.healthandcare.model.Consultation;
import com.healthandcare.model.Prescription;
import com.healthandcare.repository.AppointmentRepository;
import com.healthandcare.repository.ConsultationRepository;
import com.healthandcare.repository.NotificationRepository;
import com.healthandcare.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ClinicalService {

    private final ConsultationRepository consultationRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;
    private final NotificationRepository notificationRepository;

    public ClinicalService(ConsultationRepository consultationRepository,
                           PrescriptionRepository prescriptionRepository,
                           AppointmentRepository appointmentRepository,
                           NotificationRepository notificationRepository) {
        this.consultationRepository = consultationRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.appointmentRepository = appointmentRepository;
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public Consultation createConsultation(Long doctorId, CreateConsultationRequest req) {
        Appointment appt = appointmentRepository.findById(req.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment #" + req.getAppointmentId() + " not found."));

        Consultation c = new Consultation();
        c.setAppointmentId(appt.getId());
        c.setPatientId(appt.getPatientId());
        c.setDoctorId(doctorId);
        c.setDiagnosis(req.getDiagnosis());
        c.setSymptoms(req.getSymptoms());
        c.setClinicalNotes(req.getClinicalNotes());
        c.setTreatmentPlan(req.getTreatmentPlan());

        Long id = consultationRepository.save(c);
        c.setId(id);

        // Mark appointment as COMPLETED
        appointmentRepository.updateStatus(appt.getId(), "COMPLETED", "Consultation conducted and notes recorded.");

        notificationRepository.save(appt.getPatientId(), "New Consultation Notes Available",
                "Dr. " + appt.getDoctorName() + " has completed your consultation and added medical diagnosis notes.", "CLINICAL");

        return c;
    }

    @Transactional
    public Prescription createPrescription(Long doctorId, CreatePrescriptionRequest req) {
        Appointment appt = appointmentRepository.findById(req.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment #" + req.getAppointmentId() + " not found."));

        Prescription p = new Prescription();
        p.setAppointmentId(appt.getId());
        p.setConsultationId(req.getConsultationId());
        p.setPatientId(appt.getPatientId());
        p.setDoctorId(doctorId);
        p.setDiagnosis(req.getDiagnosis());
        p.setGeneralInstructions(req.getGeneralInstructions());
        p.setIssuedDate(LocalDate.now());
        p.setItems(req.getItems());

        Long id = prescriptionRepository.savePrescription(p);
        p.setId(id);

        notificationRepository.save(appt.getPatientId(), "New Prescription Issued",
                "Dr. " + appt.getDoctorName() + " has issued a new prescription for your appointment.", "PRESCRIPTION");

        return prescriptionRepository.findById(id).orElse(p);
    }

    public List<Prescription> getPrescriptionsForPatient(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    public List<Prescription> getPrescriptionsForDoctor(Long doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }

    public List<Consultation> getConsultationsForPatient(Long patientId) {
        return consultationRepository.findByPatientId(patientId);
    }
}
