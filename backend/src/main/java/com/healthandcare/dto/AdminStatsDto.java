package com.healthandcare.dto;

public class AdminStatsDto {
    private long totalPatients;
    private long totalDoctors;
    private long pendingDoctors;
    private long totalAppointments;
    private long completedAppointments;
    private long pendingAppointments;
    private long totalDepartments;

    public AdminStatsDto() {}

    public AdminStatsDto(long totalPatients, long totalDoctors, long pendingDoctors, long totalAppointments, long completedAppointments, long pendingAppointments, long totalDepartments) {
        this.totalPatients = totalPatients;
        this.totalDoctors = totalDoctors;
        this.pendingDoctors = pendingDoctors;
        this.totalAppointments = totalAppointments;
        this.completedAppointments = completedAppointments;
        this.pendingAppointments = pendingAppointments;
        this.totalDepartments = totalDepartments;
    }

    public long getTotalPatients() { return totalPatients; }
    public void setTotalPatients(long totalPatients) { this.totalPatients = totalPatients; }

    public long getTotalDoctors() { return totalDoctors; }
    public void setTotalDoctors(long totalDoctors) { this.totalDoctors = totalDoctors; }

    public long getPendingDoctors() { return pendingDoctors; }
    public void setPendingDoctors(long pendingDoctors) { this.pendingDoctors = pendingDoctors; }

    public long getTotalAppointments() { return totalAppointments; }
    public void setTotalAppointments(long totalAppointments) { this.totalAppointments = totalAppointments; }

    public long getCompletedAppointments() { return completedAppointments; }
    public void setCompletedAppointments(long completedAppointments) { this.completedAppointments = completedAppointments; }

    public long getPendingAppointments() { return pendingAppointments; }
    public void setPendingAppointments(long pendingAppointments) { this.pendingAppointments = pendingAppointments; }

    public long getTotalDepartments() { return totalDepartments; }
    public void setTotalDepartments(long totalDepartments) { this.totalDepartments = totalDepartments; }
}
