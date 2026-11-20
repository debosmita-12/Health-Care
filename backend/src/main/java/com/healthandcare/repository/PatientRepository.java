package com.healthandcare.repository;

import com.healthandcare.model.PatientProfile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public class PatientRepository {

    private final JdbcTemplate jdbcTemplate;

    public PatientRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<PatientProfile> patientRowMapper = (rs, rowNum) -> {
        PatientProfile p = new PatientProfile();
        p.setId(rs.getLong("id"));
        p.setUserId(rs.getLong("user_id"));
        Date dob = rs.getDate("date_of_birth");
        if (dob != null) p.setDateOfBirth(dob.toLocalDate());
        p.setGender(rs.getString("gender"));
        p.setBloodGroup(rs.getString("blood_group"));
        p.setAddress(rs.getString("address"));
        p.setEmergencyContact(rs.getString("emergency_contact"));
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) p.setCreatedAt(ts.toLocalDateTime());

        // Joined user details
        p.setFullName(rs.getString("full_name"));
        p.setEmail(rs.getString("email"));
        p.setPhone(rs.getString("phone"));
        return p;
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

    public Long save(PatientProfile profile) {
        String sql = "INSERT INTO patient_profiles (user_id, date_of_birth, gender, blood_group, address, emergency_contact) VALUES (?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, profile.getUserId());
            ps.setDate(2, profile.getDateOfBirth() != null ? Date.valueOf(profile.getDateOfBirth()) : null);
            ps.setString(3, profile.getGender());
            ps.setString(4, profile.getBloodGroup());
            ps.setString(5, profile.getAddress());
            ps.setString(6, profile.getEmergencyContact());
            return ps;
        }, keyHolder);

        Long key = extractId(keyHolder);
        if (key != null) {
            profile.setId(key);
            return key;
        }
        return null;
    }

    public Optional<PatientProfile> findByUserId(Long userId) {
        String sql = """
            SELECT p.*, u.full_name, u.email, u.phone
            FROM patient_profiles p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id = ?
        """;
        List<PatientProfile> list = jdbcTemplate.query(sql, patientRowMapper, userId);
        return list.stream().findFirst();
    }

    public List<PatientProfile> findAll() {
        String sql = """
            SELECT p.*, u.full_name, u.email, u.phone
            FROM patient_profiles p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.id DESC
        """;
        return jdbcTemplate.query(sql, patientRowMapper);
    }

    public boolean update(PatientProfile profile) {
        String sql = "UPDATE patient_profiles SET date_of_birth = ?, gender = ?, blood_group = ?, address = ?, emergency_contact = ? WHERE user_id = ?";
        return jdbcTemplate.update(sql,
                profile.getDateOfBirth() != null ? Date.valueOf(profile.getDateOfBirth()) : null,
                profile.getGender(),
                profile.getBloodGroup(),
                profile.getAddress(),
                profile.getEmergencyContact(),
                profile.getUserId()) > 0;
    }

    public boolean deleteByUserId(Long userId) {
        String sql = "DELETE FROM patient_profiles WHERE user_id = ?";
        return jdbcTemplate.update(sql, userId) > 0;
    }

    public long count() {
        String sql = "SELECT COUNT(*) FROM patient_profiles";
        Long count = jdbcTemplate.queryForObject(sql, Long.class);
        return count != null ? count : 0L;
    }
}
