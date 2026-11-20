package com.healthandcare.repository;

import com.healthandcare.model.Prescription;
import com.healthandcare.model.PrescriptionItem;
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
public class PrescriptionRepository {

    private final JdbcTemplate jdbcTemplate;

    public PrescriptionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Prescription> prescriptionRowMapper = (rs, rowNum) -> {
        Prescription p = new Prescription();
        p.setId(rs.getLong("id"));
        p.setConsultationId(rs.getObject("consultation_id") != null ? rs.getLong("consultation_id") : null);
        p.setAppointmentId(rs.getLong("appointment_id"));
        p.setPatientId(rs.getLong("patient_id"));
        p.setDoctorId(rs.getLong("doctor_id"));
        p.setDiagnosis(rs.getString("diagnosis"));
        p.setGeneralInstructions(rs.getString("general_instructions"));
        Date d = rs.getDate("issued_date");
        if (d != null) p.setIssuedDate(d.toLocalDate());
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) p.setCreatedAt(ts.toLocalDateTime());

        p.setPatientName(rs.getString("patient_name"));
        p.setDoctorName(rs.getString("doctor_name"));
        p.setDoctorSpecialization(rs.getString("doctor_specialization"));
        return p;
    };

    private final RowMapper<PrescriptionItem> itemRowMapper = (rs, rowNum) -> {
        PrescriptionItem item = new PrescriptionItem();
        item.setId(rs.getLong("id"));
        item.setPrescriptionId(rs.getLong("prescription_id"));
        item.setMedicineName(rs.getString("medicine_name"));
        item.setDosage(rs.getString("dosage"));
        item.setFrequency(rs.getString("frequency"));
        item.setDuration(rs.getString("duration"));
        item.setInstructions(rs.getString("instructions"));
        return item;
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

    public Long savePrescription(Prescription p) {
        String sql = """
            INSERT INTO prescriptions (consultation_id, appointment_id, patient_id, doctor_id, diagnosis, general_instructions, issued_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """;
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            if (p.getConsultationId() != null) ps.setLong(1, p.getConsultationId());
            else ps.setNull(1, java.sql.Types.BIGINT);
            ps.setLong(2, p.getAppointmentId());
            ps.setLong(3, p.getPatientId());
            ps.setLong(4, p.getDoctorId());
            ps.setString(5, p.getDiagnosis());
            ps.setString(6, p.getGeneralInstructions());
            ps.setDate(7, p.getIssuedDate() != null ? Date.valueOf(p.getIssuedDate()) : Date.valueOf(LocalDate.now()));
            return ps;
        }, keyHolder);

        Long key = extractId(keyHolder);
        if (key != null) {
            long prescId = key;
            p.setId(prescId);
            // Save items
            if (p.getItems() != null && !p.getItems().isEmpty()) {
                for (PrescriptionItem item : p.getItems()) {
                    saveItem(prescId, item);
                }
            }
            return prescId;
        }
        return null;
    }

    public void saveItem(Long prescriptionId, PrescriptionItem item) {
        String sql = "INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, instructions) VALUES (?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, prescriptionId, item.getMedicineName(), item.getDosage(), item.getFrequency(), item.getDuration(), item.getInstructions());
    }

    private String baseSelectQuery() {
        return """
            SELECT pr.*,
                   p.full_name AS patient_name,
                   d.full_name AS doctor_name,
                   docp.specialization AS doctor_specialization
            FROM prescriptions pr
            JOIN users p ON pr.patient_id = p.id
            JOIN users d ON pr.doctor_id = d.id
            LEFT JOIN doctor_profiles docp ON d.id = docp.user_id
        """;
    }

    public Optional<Prescription> findById(Long id) {
        String sql = baseSelectQuery() + " WHERE pr.id = ?";
        List<Prescription> list = jdbcTemplate.query(sql, prescriptionRowMapper, id);
        if (list.isEmpty()) return Optional.empty();
        Prescription p = list.get(0);
        p.setItems(findItemsByPrescriptionId(p.getId()));
        return Optional.of(p);
    }

    public List<Prescription> findByPatientId(Long patientId) {
        String sql = baseSelectQuery() + " WHERE pr.patient_id = ? ORDER BY pr.id DESC";
        List<Prescription> list = jdbcTemplate.query(sql, prescriptionRowMapper, patientId);
        for (Prescription p : list) {
            p.setItems(findItemsByPrescriptionId(p.getId()));
        }
        return list;
    }

    public List<Prescription> findByDoctorId(Long doctorId) {
        String sql = baseSelectQuery() + " WHERE pr.doctor_id = ? ORDER BY pr.id DESC";
        List<Prescription> list = jdbcTemplate.query(sql, prescriptionRowMapper, doctorId);
        for (Prescription p : list) {
            p.setItems(findItemsByPrescriptionId(p.getId()));
        }
        return list;
    }

    public List<PrescriptionItem> findItemsByPrescriptionId(Long prescriptionId) {
        String sql = "SELECT * FROM prescription_items WHERE prescription_id = ? ORDER BY id ASC";
        return jdbcTemplate.query(sql, itemRowMapper, prescriptionId);
    }
}
