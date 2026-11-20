package com.healthandcare.repository;

import com.healthandcare.model.Notification;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public class NotificationRepository {

    private final JdbcTemplate jdbcTemplate;

    public NotificationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Notification> notificationRowMapper = (rs, rowNum) -> {
        Notification n = new Notification();
        n.setId(rs.getLong("id"));
        n.setUserId(rs.getLong("user_id"));
        n.setTitle(rs.getString("title"));
        n.setMessage(rs.getString("message"));
        n.setType(rs.getString("type"));
        n.setIsRead(rs.getBoolean("is_read"));
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) n.setCreatedAt(ts.toLocalDateTime());
        return n;
    };

    public void save(Long userId, String title, String message, String type) {
        String sql = "INSERT INTO notifications (user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, FALSE)";
        jdbcTemplate.update(sql, userId, title, message, type);
    }

    public List<Notification> findByUserId(Long userId) {
        String sql = "SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT 20";
        return jdbcTemplate.query(sql, notificationRowMapper, userId);
    }

    public void markAllAsRead(Long userId) {
        String sql = "UPDATE notifications SET is_read = TRUE WHERE user_id = ?";
        jdbcTemplate.update(sql, userId);
    }
}
