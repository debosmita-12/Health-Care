package com.healthandcare.repository;

import com.healthandcare.model.Consultation;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public class ConsultationRepository {

    private final JdbcTemplate jdbcTemplate;

    public ConsultationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Consultation> consultationRowMapper = (rs, rowNum) -> {
        Consultation c = new Consultation();
        c.setId(rs.getLong("id"));
        c.setAppointmentId(rs.getLong("appointment_id"));
        c.setPatientId(rs.getLong("patient_id"));
        c.setDoctorId(rs.getLong("doctor_id"));
        c.setDiagnosis(rs.getString("diagnosis"));
        c.setSymptoms(rs.getString("symptoms"));
        c.setClinicalNotes(rs.getString("clinical_notes"));
        c.setTreatmentPlan(rs.getString("treatment_plan"));
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) c.setCreatedAt(ts.toLocalDateTime());

        c.setPatientName(rs.getString("patient_name"));
        c.setDoctorName(rs.getString("doctor_name"));
        return c;
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

    public Long save(Consultation c) {
        String sql = "INSERT INTO consultations (appointment_id, patient_id, doctor_id, diagnosis, symptoms, clinical_notes, treatment_plan) VALUES (?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, c.getAppointmentId());
            ps.setLong(2, c.getPatientId());
            ps.setLong(3, c.getDoctorId());
            ps.setString(4, c.getDiagnosis());
            ps.setString(5, c.getSymptoms());
            ps.setString(6, c.getClinicalNotes());
            ps.setString(7, c.getTreatmentPlan());
            return ps;
        }, keyHolder);

        Long key = extractId(keyHolder);
        if (key != null) {
            c.setId(key);
            return key;
        }
        return null;
    }

    public Optional<Consultation> findByAppointmentId(Long appointmentId) {
        String sql = """
            SELECT c.*, p.full_name AS patient_name, d.full_name AS doctor_name
            FROM consultations c
            JOIN users p ON c.patient_id = p.id
            JOIN users d ON c.doctor_id = d.id
            WHERE c.appointment_id = ?
        """;
        List<Consultation> list = jdbcTemplate.query(sql, consultationRowMapper, appointmentId);
        return list.stream().findFirst();
    }

    public List<Consultation> findByPatientId(Long patientId) {
        String sql = """
            SELECT c.*, p.full_name AS patient_name, d.full_name AS doctor_name
            FROM consultations c
            JOIN users p ON c.patient_id = p.id
            JOIN users d ON c.doctor_id = d.id
            WHERE c.patient_id = ?
            ORDER BY c.id DESC
        """;
        return jdbcTemplate.query(sql, consultationRowMapper, patientId);
    }
}
