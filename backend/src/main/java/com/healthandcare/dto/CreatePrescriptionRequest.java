package com.healthandcare.dto;

import com.healthandcare.model.PrescriptionItem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class CreatePrescriptionRequest {
    @NotNull(message = "Appointment ID is required")
    private Long appointmentId;

    private Long consultationId;

    @NotBlank(message = "Diagnosis is required")
    private String diagnosis;

    private String generalInstructions;

    private List<PrescriptionItem> items = new ArrayList<>();

    public CreatePrescriptionRequest() {}

    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }

    public Long getConsultationId() { return consultationId; }
    public void setConsultationId(Long consultationId) { this.consultationId = consultationId; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getGeneralInstructions() { return generalInstructions; }
    public void setGeneralInstructions(String generalInstructions) { this.generalInstructions = generalInstructions; }

    public List<PrescriptionItem> getItems() { return items; }
    public void setItems(List<PrescriptionItem> items) { this.items = items; }
}
