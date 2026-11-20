package com.healthandcare.repository;

import com.healthandcare.model.User;
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
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<User> userRowMapper = (rs, rowNum) -> {
        User user = new User();
        user.setId(rs.getLong("id"));
        user.setEmail(rs.getString("email"));
        user.setPasswordHash(rs.getString("password_hash"));
        user.setFullName(rs.getString("full_name"));
        user.setPhone(rs.getString("phone"));
        user.setRole(rs.getString("role"));
        user.setStatus(rs.getString("status"));
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) {
            user.setCreatedAt(ts.toLocalDateTime());
        }
        return user;
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

    public Long save(User user) {
        String sql = "INSERT INTO users (email, password_hash, full_name, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getEmail().toLowerCase().trim());
            ps.setString(2, user.getPasswordHash());
            ps.setString(3, user.getFullName());
            ps.setString(4, user.getPhone());
            ps.setString(5, user.getRole());
            ps.setString(6, user.getStatus() != null ? user.getStatus() : "ACTIVE");
            return ps;
        }, keyHolder);

        Long key = extractId(keyHolder);
        if (key != null) {
            user.setId(key);
            return key;
        }
        return null;
    }

    public Optional<User> findById(Long id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        List<User> list = jdbcTemplate.query(sql, userRowMapper, id);
        return list.stream().findFirst();
    }

    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE LOWER(email) = LOWER(?)";
        List<User> list = jdbcTemplate.query(sql, userRowMapper, email.trim());
        return list.stream().findFirst();
    }

    public List<User> findByRole(String role) {
        String sql = "SELECT * FROM users WHERE role = ? ORDER BY id DESC";
        return jdbcTemplate.query(sql, userRowMapper, role);
    }

    public boolean updateStatus(Long userId, String status) {
        String sql = "UPDATE users SET status = ? WHERE id = ?";
        return jdbcTemplate.update(sql, status, userId) > 0;
    }

    public boolean updateProfile(Long userId, String fullName, String phone) {
        String sql = "UPDATE users SET full_name = ?, phone = ? WHERE id = ?";
        return jdbcTemplate.update(sql, fullName, phone, userId) > 0;
    }

    public boolean updatePassword(Long userId, String newHash) {
        String sql = "UPDATE users SET password_hash = ? WHERE id = ?";
        return jdbcTemplate.update(sql, newHash, userId) > 0;
    }

    public long countByRole(String role) {
        String sql = "SELECT COUNT(*) FROM users WHERE role = ?";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, role);
        return count != null ? count : 0L;
    }
}
