# HEALTH & CARE — INSTALLATION & RUN GUIDE

## Prerequisites
- **JDK:** Java 21 (OpenJDK / Eclipse Adoptium)
- **Node.js:** Node 18+ and npm
- **Maven:** Apache Maven 3.9+ (or use the provided Maven binary wrapper)
- **Operating System:** Windows, macOS, or Linux

---

## 1. Java Practical Demonstrations Module

Navigate to `java-demonstrations`:
```bash
cd java-demonstrations
mvn clean compile
```

### To Run Desktop Demonstrations:
1. **Interactive Menu / All Tests:**
   ```bash
   mvn exec:java "-Dexec.args=all-tests"
   ```
2. **Launch AWT Patient Registration Window:**
   ```bash
   mvn exec:java "-Dexec.args=1"
   ```
3. **Launch Swing Appointment Management Window:**
   ```bash
   mvn exec:java "-Dexec.args=2"
   ```
4. **Launch JavaFX Healthcare Dashboard:**
   ```bash
   mvn exec:java "-Dexec.args=3"
   ```
5. **Run SQLite PreparedStatement Verification:**
   ```bash
   mvn exec:java "-Dexec.args=4"
   ```
6. **Run MySQL PreparedStatement Verification:**
   ```bash
   mvn exec:java "-Dexec.args=5"
   ```

---

## 2. Spring Boot Backend

Navigate to `backend`:
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```

By default, the backend runs on port **8080** using the zero-friction **H2 PostgreSQL-compatibility mode** (`active-profile: h2`). It automatically initializes all tables and seed users on startup.

### Running with Live PostgreSQL Database:
If a local PostgreSQL server is active:
```powershell
$env:SPRING_PROFILES_ACTIVE="postgres"
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/healthandcare"
$env:SPRING_DATASOURCE_USERNAME="postgres"
$env:SPRING_DATASOURCE_PASSWORD="your_password"
mvn spring-boot:run
```

---

## 3. React Frontend

Navigate to `frontend`:
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in any modern web browser.
