package com.healthandcare.model;

import java.time.LocalDateTime;

public class Department {
    private Long id;
    private String name;
    private String description;
    private String iconName;
    private Boolean isActive;
    private LocalDateTime createdAt;

    public Department() {}

    public Department(Long id, String name, String description, String iconName, Boolean isActive, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.iconName = iconName;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
