# HEALTH & CARE — REST API DOCUMENTATION

Base URL: `http://localhost:8080/api`

All protected endpoints require HTTP header:
`Authorization: Bearer <jwt_token>`

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/login`
- **Body:** `{ "email": "aarav.sharma@example.com", "password": "patient123" }`
- **Response:** `{ "token": "...", "id": 5, "email": "...", "role": "ROLE_PATIENT", "status": "ACTIVE" }`

### `POST /api/auth/register/patient`
- **Body:** Full name, email, phone, password, dateOfBirth, gender, address.
- **Response:** Automatically authenticates and returns user token.

### `POST /api/auth/register/doctor`
- **Body:** Full name, email, phone, password, qualification, specialization, experienceYears, medicalRegistrationNo.
- **Response:** Creates pending verification profile.

### `GET /api/auth/me`
- **Headers:** Bearer token
- **Response:** Current user details.

---

## 2. Patient Portal Endpoints (`/api/patient`)

- `GET /api/patient/profile`: Retrieve patient demographics.
- `PUT /api/patient/profile`: Update contact details & address.
- `GET /api/patient/appointments`: List appointments booked by current patient.
- `GET /api/patient/prescriptions`: Retrieve medical prescriptions issued to patient.
- `GET /api/patient/consultations`: Retrieve clinical diagnosis notes.
- `GET /api/patient/notifications`: Get notification feed.

---

## 3. Doctor Portal Endpoints (`/api/doctor`)

- `GET /api/doctor/profile`: Retrieve doctor clinical profile.
- `PUT /api/doctor/profile`: Update working hours, fees, bio.
- `GET /api/doctor/appointments`: List appointments assigned to attending doctor.
- `POST /api/doctor/appointments/{id}/status`: Accept (`CONFIRMED`) or decline (`REJECTED`) appointment.

---

## 4. Appointment Endpoints (`/api/appointments`)

- `POST /api/appointments/book`:
  - Validates past-date restrictions (`cannot book in the past`).
  - Checks for overlapping doctor bookings (`isDoctorSlotTaken`).
  - Saves in status `PENDING`.
- `PATCH /api/appointments/{id}/status`: Update appointment status (`CANCELLED`, `COMPLETED`).

---

## 5. Clinical Endpoints (`/api/clinical`)

- `POST /api/clinical/consultation`: Record diagnosis, symptoms, clinical notes.
- `POST /api/clinical/prescription`: Issue prescription with medicine items (name, dosage, frequency, duration, instructions).

---

## 6. Administration Endpoints (`/api/admin`)

- `GET /api/admin/stats`: Total patients, doctors, pending verification count, appointments summary.
- `GET /api/admin/doctors`: All doctor profiles.
- `GET /api/admin/doctors/pending`: Doctor applications awaiting review.
- `POST /api/admin/doctors/{id}/verify?approved=true/false`: Approve or reject doctor application.
- `GET /api/admin/patients`: All registered patient profiles.
- `GET /api/admin/appointments`: Master appointment log.
- `GET /api/admin/departments`: Department list.
- `POST /api/admin/departments`: Add clinical department.
- `DELETE /api/admin/departments/{id}`: Delete department.
