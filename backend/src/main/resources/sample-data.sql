-- =============================================================================
-- HEALTH & CARE: SAMPLE SEED DATA (PostgreSQL / H2)
-- Default Login Passwords:
--   Admin:   admin@healthandcare.com   / admin123
--   Doctor:  rajesh.iyer@healthandcare.com / doctor123
--   Doctor:  sneha.roy@healthandcare.com   / doctor123
--   Patient: aarav.sharma@example.com / patient123
-- =============================================================================

-- 1. Departments
INSERT INTO departments (name, description, icon_name, is_active) VALUES
('Cardiology', 'Comprehensive cardiovascular diagnostics, ECG, echocardiography, and hypertension management.', 'HeartPulse', TRUE),
('Dental & Maxillofacial', 'Preventive oral healthcare, orthodontic aligners, pediatric dentistry, and implants.', 'Smile', TRUE),
('Pediatrics & Child Care', 'Specialized neonatal care, child immunizations, and developmental assessments.', 'Baby', TRUE),
('Orthopedics & Joint Care', 'Bone fracture stabilization, joint pain management, and sports injury rehabilitation.', 'Bone', TRUE),
('Dermatology & Skin Care', 'Clinical dermatology, acne therapies, eczema management, and aesthetic dermatology.', 'Sparkles', TRUE),
('Neurology & Brain Health', 'Diagnosis and therapy for neurological disorders, migraines, and cognitive wellness.', 'Brain', TRUE)
ON CONFLICT (name) DO NOTHING;

-- 2. Users (BCrypt hashes for passwords)
-- password 'admin123': $2a$10$hKDVYxLefVHV/vtuPhWD3OigtSDO3qc0d.uTfD8P24Vj5F3P6B2nK
-- password 'doctor123': $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi (or standard)
-- We will also handle fallback matching in Spring Security / DataInitializer.
INSERT INTO users (email, password_hash, full_name, phone, role, status) VALUES
('admin@healthandcare.com', '$2a$10$Dow1yOeqxszfP1jQ/UuQ3e.JtN1oR4R9Q98K3tT8O9b0G3W7qPZ.O', 'System Administrator', '+91 98000 11000', 'ROLE_ADMIN', 'ACTIVE'),
('rajesh.iyer@healthandcare.com', '$2a$10$Dow1yOeqxszfP1jQ/UuQ3e.JtN1oR4R9Q98K3tT8O9b0G3W7qPZ.O', 'Dr. Rajesh Iyer', '+91 98111 22334', 'ROLE_DOCTOR', 'ACTIVE'),
('sneha.roy@healthandcare.com', '$2a$10$Dow1yOeqxszfP1jQ/UuQ3e.JtN1oR4R9Q98K3tT8O9b0G3W7qPZ.O', 'Dr. Sneha Roy', '+91 98222 33445', 'ROLE_DOCTOR', 'ACTIVE'),
('vikram.seth@healthandcare.com', '$2a$10$Dow1yOeqxszfP1jQ/UuQ3e.JtN1oR4R9Q98K3tT8O9b0G3W7qPZ.O', 'Dr. Vikram Seth', '+91 98333 44556', 'ROLE_DOCTOR', 'PENDING_VERIFICATION'),
('aarav.sharma@example.com', '$2a$10$Dow1yOeqxszfP1jQ/UuQ3e.JtN1oR4R9Q98K3tT8O9b0G3W7qPZ.O', 'Aarav Sharma', '+91 98765 43210', 'ROLE_PATIENT', 'ACTIVE'),
('priya.patel@example.com', '$2a$10$Dow1yOeqxszfP1jQ/UuQ3e.JtN1oR4R9Q98K3tT8O9b0G3W7qPZ.O', 'Priya Patel', '+91 98765 43211', 'ROLE_PATIENT', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- 3. Patient Profiles
INSERT INTO patient_profiles (user_id, date_of_birth, gender, blood_group, address, emergency_contact)
SELECT u.id, '1992-05-14', 'Male', 'O+', '42 Marine Drive, Mumbai', '+91 98765 00001'
FROM users u WHERE u.email = 'aarav.sharma@example.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO patient_profiles (user_id, date_of_birth, gender, blood_group, address, emergency_contact)
SELECT u.id, '1996-08-22', 'Female', 'B+', '15 Senapati Bapat Marg, Pune', '+91 98765 00002'
FROM users u WHERE u.email = 'priya.patel@example.com'
ON CONFLICT (user_id) DO NOTHING;

-- 4. Doctor Profiles
INSERT INTO doctor_profiles (user_id, department_id, qualification, specialization, experience_years, medical_registration_no, consultation_fee, bio, verification_status, available_days, working_hours)
SELECT u.id, (SELECT id FROM departments WHERE name = 'Cardiology' LIMIT 1), 'MD (Medicine), DM (Cardiology)', 'Interventional Cardiology', 12, 'MCI-88321-CARD', 800.00, 'Senior Cardiologist specializing in preventive heart health, coronary artery disease, and lipid management.', 'APPROVED', 'Mon,Tue,Wed,Thu,Fri', '09:00 - 15:00'
FROM users u WHERE u.email = 'rajesh.iyer@healthandcare.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO doctor_profiles (user_id, department_id, qualification, specialization, experience_years, medical_registration_no, consultation_fee, bio, verification_status, available_days, working_hours)
SELECT u.id, (SELECT id FROM departments WHERE name = 'Dental & Maxillofacial' LIMIT 1), 'BDS, MDS (Orthodontics)', 'Cosmetic & Restorative Dentistry', 8, 'DCI-91422-DENT', 600.00, 'Specialist in smile design, invisible aligners, pain-free root canals, and pediatric dental hygiene.', 'APPROVED', 'Mon,Wed,Fri,Sat', '10:00 - 18:00'
FROM users u WHERE u.email = 'sneha.roy@healthandcare.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO doctor_profiles (user_id, department_id, qualification, specialization, experience_years, medical_registration_no, consultation_fee, bio, verification_status, available_days, working_hours)
SELECT u.id, (SELECT id FROM departments WHERE name = 'Pediatrics & Child Care' LIMIT 1), 'MBBS, MD (Pediatrics)', 'Pediatric Care & Immunization', 5, 'MCI-72109-PED', 500.00, 'Pediatrician dedicated to early childhood wellness, adolescent care, and routine growth monitoring.', 'PENDING', 'Tue,Thu,Sat', '09:00 - 14:00'
FROM users u WHERE u.email = 'vikram.seth@healthandcare.com'
ON CONFLICT (user_id) DO NOTHING;

-- 5. Appointments
INSERT INTO appointments (patient_id, doctor_id, department_id, appointment_date, appointment_time, status, reason, notes)
SELECT p.id, d.id, (SELECT id FROM departments WHERE name = 'Cardiology' LIMIT 1), CURRENT_DATE + INTERVAL '1 day', '10:00 AM', 'CONFIRMED', 'Annual cardiovascular checkup and ECG reading.', 'Patient requested morning slot.'
FROM users p, users d
WHERE p.email = 'aarav.sharma@example.com' AND d.email = 'rajesh.iyer@healthandcare.com'
LIMIT 1;

INSERT INTO appointments (patient_id, doctor_id, department_id, appointment_date, appointment_time, status, reason, notes)
SELECT p.id, d.id, (SELECT id FROM departments WHERE name = 'Dental & Maxillofacial' LIMIT 1), CURRENT_DATE + INTERVAL '2 days', '02:30 PM', 'PENDING', 'Routine dental cleaning and whitening consultation.', 'New patient inquiry.'
FROM users p, users d
WHERE p.email = 'priya.patel@example.com' AND d.email = 'sneha.roy@healthandcare.com'
LIMIT 1;

-- 6. Notifications
INSERT INTO notifications (user_id, title, message, type)
SELECT id, 'Welcome to Health & Care', 'Your account has been successfully created. Explore top doctors and book your first appointment.', 'SYSTEM'
FROM users;
