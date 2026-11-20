# HEALTH & CARE
## Complete Healthcare Management System & Academic Rubric Implementation

**HEALTH & CARE** is a full-stack, enterprise-grade healthcare management platform engineered from scratch. The system coordinates three distinct user roles (**Patient**, **Doctor**, and **Administrator**) with role-based authentication, real-time appointment scheduling, clinical consultations, electronic prescriptions, and administrative governance.

In addition to the modern web application, the project features a **mandatory Java Academic Rubric Demonstration Module** providing functional desktop implementations of **AWT**, **Swing**, **JavaFX**, **SQLite JDBC**, and **MySQL/Oracle JDBC**.

---

## 1. PROJECT ARCHITECTURE

```
Health-And-Care/
│
├── frontend/                     # React 18 + Vite + Lucide React SPA
│   ├── src/
│   │   ├── components/           # Reusable Navbar, Footer, ProtectedRoute
│   │   ├── context/              # AuthContext (JWT & Role state)
│   │   ├── pages/
│   │   │   ├── public/           # LandingPage (12 sections), Login, Register
│   │   │   ├── patient/          # Patient Dashboard, Bookings, Prescriptions
│   │   │   ├── doctor/           # Doctor Portal, Consultations, Rx Writer
│   │   │   └── admin/            # Admin Portal, Verification, Departments
│   │   ├── services/             # Unified REST API Client with fallback resilience
│   │   └── styles/               # Cleargrin Healthcare Design System
│   └── package.json
│
├── backend/                      # Java 21 + Spring Boot 3.3.5 API
│   ├── src/main/java/com/healthandcare/
│   │   ├── config/               # Security & Startup Seed Initializer
│   │   ├── controller/           # REST API Endpoints (/api/auth, /api/patient, etc.)
│   │   ├── dto/                  # Data Transfer Objects & Validation
│   │   ├── model/                # Domain Entities
│   │   ├── repository/           # Spring JDBC (JdbcTemplate, PreparedStatement, RowMapper)
│   │   ├── security/             # JWT Provider, AuthFilter & BCrypt Config
│   │   └── service/              # Transactional Healthcare Business Logic
│   └── pom.xml
│
├── java-demonstrations/          # Mandatory Academic Rubric Desktop Module
│   ├── src/main/java/com/healthandcare/demo/
│   │   ├── awt/                  # AWT Patient Registration Window
│   │   ├── swing/                # Swing Appointment Management Table & Form
│   │   ├── javafx/               # JavaFX Healthcare KPI Dashboard & TableView
│   │   ├── database/             # SQLite & MySQL PreparedStatement CRUD Services
│   │   └── Main.java             # Unified Interactive & Headless Launcher
│   └── pom.xml
│
├── database/                     # PostgreSQL / H2 Database Artifacts
│   ├── schema.sql                # Relational DDL with Foreign Keys & Indexes
│   └── sample-data.sql           # Initial verified doctors, patients, appointments
│
├── docs/                         # Project Documentation
│   ├── RUBRIC_MAPPING.md         # Mandatory Academic Rubric Checklist
│   ├── INSTALLATION.md           # Step-by-step Setup Guide
│   ├── API_DOCUMENTATION.md      # REST API Specification
│   └── DATABASE_DESIGN.md        # Relational ER & Schema Details
│
├── run-frontend.bat              # 1-Click Frontend Launcher
├── run-backend.bat               # 1-Click Spring Boot Backend Launcher
├── run-java-demos.bat            # 1-Click Desktop Rubric Launcher
└── run-all-rubric-tests.bat      # 1-Click Full Verification Suite
```

---

## 2. QUICK DEMONSTRATION GUIDE (60-MINUTE EVALUATION)

### Step 1: Run the Academic Rubric Suite (Terminal Verification)
```powershell
cd Health-And-Care\java-demonstrations
mvn exec:java "-Dexec.args=all-tests"
```
*Result:* Executes and passes all 8 mandatory academic rubric requirements, verifying AWT, Swing, JavaFX, and PreparedStatement CRUD on SQLite and MySQL.

### Step 2: Start the Spring Boot Backend
```powershell
cd Health-And-Care\backend
mvn spring-boot:run
```
*Port:* `http://localhost:8080` (Spring JDBC active, auto-initializes relational schema and seed accounts).

### Step 3: Start the React Frontend
```powershell
cd Health-And-Care\frontend
npm run dev
```
*Port:* `http://localhost:5173`

---

## 3. DEFAULT LOGIN CREDENTIALS

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Administrator** | `admin@healthandcare.com` | `admin123` | Doctor verification, patient records, department CRUD, platform stats |
| **Doctor (Approved)** | `rajesh.iyer@healthandcare.com` | `doctor123` | Accept/reject visits, conduct consultations, issue digital prescriptions |
| **Doctor (Approved)** | `sneha.roy@healthandcare.com` | `doctor123` | Dental consultations, prescription issuance |
| **Doctor (Pending)** | `vikram.seth@healthandcare.com` | `doctor123` | Demonstrates pending verification lockout until approved |
| **Patient** | `aarav.sharma@example.com` | `patient123` | Book appointments, browse doctors, view prescription history |
| **Patient** | `priya.patel@example.com` | `patient123` | Booking and medical record management |

---

## 4. COMPULSORY ACADEMIC RUBRIC SUMMARY

For detailed file-by-file rubric mappings, please refer to [RUBRIC_MAPPING.md](RUBRIC_MAPPING.md).

1. **Java Programming:** Java 21 strict typing, repository pattern, DTO validation.
2. **Java Event Handling:** `ActionListener`, `ItemListener`, `WindowListener`, JavaFX event handlers.
3. **AWT:** Native `java.awt.Frame` patient registration with input validation and SQLite persistence.
4. **Swing:** `javax.swing.JFrame` with interactive `JTable`, input forms, and full SQLite CRUD.
5. **JavaFX:** Modern `javafx.application.Application` with KPI cards, TableView, and appointment dispatcher.
6. **SQLite:** Local disk persistence with PreparedStatement CREATE, INSERT, SELECT, UPDATE, DELETE.
7. **MySQL / Oracle:** PreparedStatement CRUD demonstration with configurable environment connection.
8. **Database Operations:** Full CRUD across 9 relational tables utilizing Spring JDBC (JdbcTemplate).

---

## 5. PROJECT CONTRIBUTORS

- **Debosmita Mukhopadhyay** — Full-Stack & Rubric Lead
- **Muthu Amuthan** — Database & Backend Engineer
- **Amanjeeta Rath** — Java Desktop & AWT/Swing Engineer
- **Khushi Kumari** — UI/UX & Testing Engineer
