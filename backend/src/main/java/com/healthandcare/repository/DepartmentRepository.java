package com.healthandcare.repository;

import com.healthandcare.model.Department;
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
public class DepartmentRepository {

    private final JdbcTemplate jdbcTemplate;

    public DepartmentRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Department> departmentRowMapper = (rs, rowNum) -> {
        Department d = new Department();
        d.setId(rs.getLong("id"));
        d.setName(rs.getString("name"));
        d.setDescription(rs.getString("description"));
        d.setIconName(rs.getString("icon_name"));
        d.setIsActive(rs.getBoolean("is_active"));
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) d.setCreatedAt(ts.toLocalDateTime());
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

    public Long save(Department dept) {
        String sql = "INSERT INTO departments (name, description, icon_name, is_active) VALUES (?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, dept.getName());
            ps.setString(2, dept.getDescription());
            ps.setString(3, dept.getIconName() != null ? dept.getIconName() : "Stethoscope");
            ps.setBoolean(4, dept.getIsActive() != null ? dept.getIsActive() : true);
            return ps;
        }, keyHolder);

        Long key = extractId(keyHolder);
        if (key != null) {
            dept.setId(key);
            return key;
        }
        return null;
    }

    public List<Department> findAllActive() {
        String sql = "SELECT * FROM departments WHERE is_active = TRUE ORDER BY name ASC";
        return jdbcTemplate.query(sql, departmentRowMapper);
    }

    public List<Department> findAll() {
        String sql = "SELECT * FROM departments ORDER BY id ASC";
        return jdbcTemplate.query(sql, departmentRowMapper);
    }

    public Optional<Department> findById(Long id) {
        String sql = "SELECT * FROM departments WHERE id = ?";
        List<Department> list = jdbcTemplate.query(sql, departmentRowMapper, id);
        return list.stream().findFirst();
    }

    public boolean update(Department dept) {
        String sql = "UPDATE departments SET name = ?, description = ?, icon_name = ?, is_active = ? WHERE id = ?";
        return jdbcTemplate.update(sql, dept.getName(), dept.getDescription(), dept.getIconName(), dept.getIsActive(), dept.getId()) > 0;
    }

    public boolean delete(Long id) {
        String sql = "DELETE FROM departments WHERE id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }

    public long count() {
        String sql = "SELECT COUNT(*) FROM departments";
        Long count = jdbcTemplate.queryForObject(sql, Long.class);
        return count != null ? count : 0L;
    }
}
