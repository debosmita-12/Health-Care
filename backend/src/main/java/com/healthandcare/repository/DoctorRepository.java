package com.healthandcare.repository;

import com.healthandcare.model.DoctorProfile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public class DoctorRepository {

    private final JdbcTemplate jdbcTemplate;

    public DoctorRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<DoctorProfile> doctorRowMapper = (rs, rowNum) -> {
        DoctorProfile d = new DoctorProfile();
        d.setId(rs.getLong("id"));
        d.setUserId(rs.getLong("user_id"));
        d.setDepartmentId(rs.getObject("department_id") != null ? rs.getLong("department_id") : null);
        d.setQualification(rs.getString("qualification"));
        d.setSpecialization(rs.getString("specialization"));
        d.setExperienceYears(rs.getInt("experience_years"));
        d.setMedicalRegistrationNo(rs.getString("medical_registration_no"));
        BigDecimal fee = rs.getBigDecimal("consultation_fee");
        d.setConsultationFee(fee != null ? fee : BigDecimal.valueOf(500.00));
        d.setBio(rs.getString("bio"));
        d.setVerificationStatus(rs.getString("verification_status"));
        d.setAvailableDays(rs.getString("available_days"));
        d.setWorkingHours(rs.getString("working_hours"));
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) d.setCreatedAt(ts.toLocalDateTime());

        // Joined fields
        d.setFullName(rs.getString("full_name"));
        d.setEmail(rs.getString("email"));
        d.setPhone(rs.getString("phone"));
        d.setDepartmentName(rs.getString("department_name"));
        return d;
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

    public Long save(DoctorProfile doc) {
        String sql = """
            INSERT INTO doctor_profiles
            (user_id, department_id, qualification, specialization, experience_years, medical_registration_no, consultation_fee, bio, verification_status, available_days, working_hours)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, doc.getUserId());
            if (doc.getDepartmentId() != null) ps.setLong(2, doc.getDepartmentId());
            else ps.setNull(2, java.sql.Types.BIGINT);
            ps.setString(3, doc.getQualification());
            ps.setString(4, doc.getSpecialization());
            ps.setInt(5, doc.getExperienceYears() != null ? doc.getExperienceYears() : 1);
            ps.setString(6, doc.getMedicalRegistrationNo());
            ps.setBigDecimal(7, doc.getConsultationFee() != null ? doc.getConsultationFee() : BigDecimal.valueOf(500.00));
            ps.setString(8, doc.getBio());
            ps.setString(9, doc.getVerificationStatus() != null ? doc.getVerificationStatus() : "PENDING");
            ps.setString(10, doc.getAvailableDays() != null ? doc.getAvailableDays() : "Mon,Tue,Wed,Thu,Fri");
            ps.setString(11, doc.getWorkingHours() != null ? doc.getWorkingHours() : "09:00 - 17:00");
            return ps;
        }, keyHolder);

        Long key = extractId(keyHolder);
        if (key != null) {
            doc.setId(key);
            return key;
        }
        return null;
    }

    public Optional<DoctorProfile> findByUserId(Long userId) {
        String sql = """
            SELECT d.*, u.full_name, u.email, u.phone, dept.name AS department_name
            FROM doctor_profiles d
            JOIN users u ON d.user_id = u.id
            LEFT JOIN departments dept ON d.department_id = dept.id
            WHERE d.user_id = ?
        """;
        List<DoctorProfile> list = jdbcTemplate.query(sql, doctorRowMapper, userId);
        return list.stream().findFirst();
    }

    public List<DoctorProfile> findAllApproved() {
        String sql = """
            SELECT d.*, u.full_name, u.email, u.phone, dept.name AS department_name
            FROM doctor_profiles d
            JOIN users u ON d.user_id = u.id
            LEFT JOIN departments dept ON d.department_id = dept.id
            WHERE d.verification_status = 'APPROVED'
            ORDER BY d.id ASC
        """;
        return jdbcTemplate.query(sql, doctorRowMapper);
    }

    public List<DoctorProfile> findAll() {
        String sql = """
            SELECT d.*, u.full_name, u.email, u.phone, dept.name AS department_name
            FROM doctor_profiles d
            JOIN users u ON d.user_id = u.id
            LEFT JOIN departments dept ON d.department_id = dept.id
            ORDER BY d.id DESC
        """;
        return jdbcTemplate.query(sql, doctorRowMapper);
    }

    public List<DoctorProfile> findPending() {
        String sql = """
            SELECT d.*, u.full_name, u.email, u.phone, dept.name AS department_name
            FROM doctor_profiles d
            JOIN users u ON d.user_id = u.id
            LEFT JOIN departments dept ON d.department_id = dept.id
            WHERE d.verification_status = 'PENDING'
            ORDER BY d.id DESC
        """;
        return jdbcTemplate.query(sql, doctorRowMapper);
    }

    public boolean updateVerificationStatus(Long userId, String status) {
        String sql = "UPDATE doctor_profiles SET verification_status = ? WHERE user_id = ?";
        return jdbcTemplate.update(sql, status, userId) > 0;
    }

    public boolean updateProfile(DoctorProfile doc) {
        String sql = """
            UPDATE doctor_profiles
            SET qualification = ?, specialization = ?, experience_years = ?, consultation_fee = ?, bio = ?, available_days = ?, working_hours = ?, department_id = ?
            WHERE user_id = ?
        """;
        return jdbcTemplate.update(sql,
                doc.getQualification(),
                doc.getSpecialization(),
                doc.getExperienceYears(),
                doc.getConsultationFee(),
                doc.getBio(),
                doc.getAvailableDays(),
                doc.getWorkingHours(),
                doc.getDepartmentId(),
                doc.getUserId()) > 0;
    }

    public boolean deleteByUserId(Long userId) {
        String sql = "DELETE FROM doctor_profiles WHERE user_id = ?";
        return jdbcTemplate.update(sql, userId) > 0;
    }

    public long count() {
        String sql = "SELECT COUNT(*) FROM doctor_profiles";
        Long count = jdbcTemplate.queryForObject(sql, Long.class);
        return count != null ? count : 0L;
    }

    public long countByStatus(String status) {
        String sql = "SELECT COUNT(*) FROM doctor_profiles WHERE verification_status = ?";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, status);
        return count != null ? count : 0L;
    }
}
