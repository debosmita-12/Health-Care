package com.healthandcare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * HEALTH & CARE — Main Spring Boot Application
 * Java 21, Spring Boot 3.3.5, Spring Security, Spring JDBC (No JPA/Hibernate)
 */
@SpringBootApplication
@EnableTransactionManagement
public class HealthAndCareApplication {

    public static void main(String[] args) {
        SpringApplication.run(HealthAndCareApplication.class, args);
        System.out.println("""
            ========================================================================
            HEALTH & CARE BACKEND INITIALIZED AND RUNNING ON http://localhost:8080
            Spring JDBC Active | REST API Endpoints Ready
            ========================================================================
        """);
    }
}
