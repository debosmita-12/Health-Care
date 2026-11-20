package com.healthandcare.demo.models;

public class DemoAppointment {
    private int id;
    private String patientName;
    private String doctorName;
    private String department;
    private String appointmentDate;
    private String status;

    public DemoAppointment() {}

    public DemoAppointment(int id, String patientName, String doctorName, String department, String appointmentDate, String status) {
        this.id = id;
        this.patientName = patientName;
        this.doctorName = doctorName;
        this.department = department;
        this.appointmentDate = appointmentDate;
        this.status = status;
    }

    public DemoAppointment(String patientName, String doctorName, String department, String appointmentDate, String status) {
        this(-1, patientName, doctorName, department, appointmentDate, status);
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    @Override
    public String toString() {
        return "DemoAppointment[id=" + id + ", patient=" + patientName + ", doctor=" + doctorName + ", date=" + appointmentDate + ", status=" + status + "]";
    }
}
