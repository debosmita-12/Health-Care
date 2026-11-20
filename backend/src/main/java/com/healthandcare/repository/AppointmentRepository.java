package com.healthandcare.repository;

import com.healthandcare.model.Appointment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class AppointmentRepository {

    private final JdbcTemplate jdbcTemplate;

    public AppointmentRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Appointment> appointmentRowMapper = (rs, rowNum) -> {
        Appointment a = new Appointment();
        a.setId(rs.getLong("id"));
        a.setPatientId(rs.getLong("patient_id"));
        a.setDoctorId(rs.getLong("doctor_id"));
        a.setDepartmentId(rs.getObject("department_id") != null ? rs.getLong("department_id") : null);
        Date d = rs.getDate("appointment_date");
        if (d != null) a.setAppointmentDate(d.toLocalDate());
        a.setAppointmentTime(rs.getString("appointment_time"));
        a.setStatus(rs.getString("status"));
        a.setReason(rs.getString("reason"));
        a.setNotes(rs.getString("notes"));
        Timestamp ca = rs.getTimestamp("created_at");
        if (ca != null) a.setCreatedAt(ca.toLocalDateTime());
        Timestamp ua = rs.getTimestamp("updated_at");
        if (ua != null) a.setUpdatedAt(ua.toLocalDateTime());

        // Joined fields
        a.setPatientName(rs.getString("patient_name"));
        a.setPatientEmail(rs.getString("patient_email"));
        a.setPatientPhone(rs.getString("patient_phone"));
        a.setDoctorName(rs.getString("doctor_name"));
        a.setDoctorSpecialization(rs.getString("doctor_specialization"));
        a.setDepartmentName(rs.getString("department_name"));
        return a;
    };

    private Long extractId(KeyHolder keyHolder) {
        if (keyHolder.getKeyList() != null && !keyHolder.getKeyList().isEmpty()) {
            var map = keyHolder.getKeyList().get(0);
            for (var entry : map.entrySet()) {
                if ("id".equalsIgnoreCase(entry.getKey()) && entry.getValue() instanceof Number n) {
                    return n.longValue();
                }
            }
            for (var val : map.values()) {
                if (val instanceof Number n) {
                    return n.longValue();
                }
            }
        }
        return null;
    }

    public Long save(Appointment a) {
        String sql = """
            INSERT INTO appointments (patient_id, doctor_id, department_id, appointment_date, appointment_time, status, reason, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """;
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, a.getPatientId());
            ps.setLong(2, a.getDoctorId());
            if (a.getDepartmentId() != null) ps.setLong(3, a.getDepartmentId());
            else ps.setNull(3, java.sql.Types.BIGINT);
            ps.setDate(4, Date.valueOf(a.getAppointmentDate()));
            ps.setString(5, a.getAppointmentTime());
            ps.setString(6, a.getStatus() != null ? a.getStatus() : "PENDING");
            ps.setString(7, a.getReason());
            ps.setString(8, a.getNotes());
            return ps;
        }, keyHolder);

        Long key = extractId(keyHolder);
        if (key != null) {
            a.setId(key);
            return key;
        }
        return null;
    }

    private String baseSelectQuery() {
        return """
            SELECT a.*,
                   p.full_name AS patient_name, p.email AS patient_email, p.phone AS patient_phone,
                   d.full_name AS doctor_name, docp.specialization AS doctor_specialization,
                   dept.name AS department_name
            FROM appointments a
            JOIN users p ON a.patient_id = p.id
            JOIN users d ON a.doctor_id = d.id
            LEFT JOIN doctor_profiles docp ON d.id = docp.user_id
            LEFT JOIN departments dept ON a.department_id = dept.id
        """;
    }

    public Optional<Appointment> findById(Long id) {
        String sql = baseSelectQuery() + " WHERE a.id = ?";
        List<Appointment> list = jdbcTemplate.query(sql, appointmentRowMapper, id);
        return list.stream().findFirst();
    }

    public List<Appointment> findByPatientId(Long patientId) {
        String sql = baseSelectQuery() + " WHERE a.patient_id = ? ORDER BY a.appointment_date DESC, a.id DESC";
        return jdbcTemplate.query(sql, appointmentRowMapper, patientId);
    }

    public List<Appointment> findByDoctorId(Long doctorId) {
        String sql = baseSelectQuery() + " WHERE a.doctor_id = ? ORDER BY a.appointment_date ASC, a.id ASC";
        return jdbcTemplate.query(sql, appointmentRowMapper, doctorId);
    }

    public List<Appointment> findAll() {
        String sql = baseSelectQuery() + " ORDER BY a.appointment_date DESC, a.id DESC";
        return jdbcTemplate.query(sql, appointmentRowMapper);
    }

    public boolean updateStatus(Long id, String status, String notes) {
        String sql = "UPDATE appointments SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        return jdbcTemplate.update(sql, status, notes, id) > 0;
    }

    public boolean isDoctorSlotTaken(Long doctorId, LocalDate date, String time) {
        String sql = "SELECT COUNT(*) FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status IN ('PENDING', 'CONFIRMED')";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, doctorId, Date.valueOf(date), time);
        return count != null && count > 0;
    }

    public long count() {
        String sql = "SELECT COUNT(*) FROM appointments";
        Long count = jdbcTemplate.queryForObject(sql, Long.class);
        return count != null ? count : 0L;
    }

    public long countByStatus(String status) {
        String sql = "SELECT COUNT(*) FROM appointments WHERE status = ?";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, status);
        return count != null ? count : 0L;
    }
}
