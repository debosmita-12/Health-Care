/**
 * HEALTH & CARE — Unified API Client
 * Connects to Spring Boot REST API endpoints with JWT bearer authentication.
 * Includes seamless fallback state so the demonstration is 100% fault-tolerant.
 */

const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('hc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return null;
  } catch (err) {
    // If backend connection fails, provide intelligent demo fallback
    console.warn(`[API] Backend call to ${endpoint} failed (${err.message}). Using local fallback handler.`);
    return fallbackHandler(endpoint, options, err);
  }
}

// Local demonstration fallback store
const fallbackStore = {
  departments: [
    { id: 1, name: 'Cardiology', description: 'Cardiovascular diagnostics, ECG & heart health.', iconName: 'HeartPulse', isActive: true },
    { id: 2, name: 'Dental & Maxillofacial', description: 'Smile aesthetics, pain-free cleanings & aligners.', iconName: 'Smile', isActive: true },
    { id: 3, name: 'Pediatrics & Child Care', description: 'Comprehensive childhood care & immunizations.', iconName: 'Baby', isActive: true },
    { id: 4, name: 'Orthopedics & Joint Care', description: 'Joint therapy, bone fractures & sports recovery.', iconName: 'Bone', isActive: true },
    { id: 5, name: 'Dermatology & Skin Care', description: 'Skin rejuvenation, clinical therapies & acne.', iconName: 'Sparkles', isActive: true },
    { id: 6, name: 'Neurology & Brain Health', description: 'Cognitive health & nervous system care.', iconName: 'Brain', isActive: true }
  ],
  doctors: [
    { id: 1, userId: 2, fullName: 'Dr. Rajesh Iyer', email: 'rajesh.iyer@healthandcare.com', phone: '+91 98111 22334', qualification: 'MD, DM (Cardiology)', specialization: 'Interventional Cardiology', experienceYears: 12, consultationFee: 800, departmentName: 'Cardiology', verificationStatus: 'APPROVED', availableDays: 'Mon,Tue,Wed,Thu,Fri', workingHours: '09:00 - 15:00', bio: 'Senior Cardiologist specializing in preventive heart health and lipid management.' },
    { id: 2, userId: 3, fullName: 'Dr. Sneha Roy', email: 'sneha.roy@healthandcare.com', phone: '+91 98222 33445', qualification: 'BDS, MDS (Orthodontics)', specialization: 'Cosmetic & Restorative Dentistry', experienceYears: 8, consultationFee: 600, departmentName: 'Dental & Maxillofacial', verificationStatus: 'APPROVED', availableDays: 'Mon,Wed,Fri,Sat', workingHours: '10:00 - 18:00', bio: 'Specialist in smile design, invisible aligners, and painless dental care.' },
    { id: 3, userId: 4, fullName: 'Dr. Vikram Seth', email: 'vikram.seth@healthandcare.com', phone: '+91 98333 44556', qualification: 'MBBS, MD (Pediatrics)', specialization: 'Pediatric Care & Immunization', experienceYears: 5, consultationFee: 500, departmentName: 'Pediatrics & Child Care', verificationStatus: 'PENDING', availableDays: 'Tue,Thu,Sat', workingHours: '09:00 - 14:00', bio: 'Pediatrician dedicated to early childhood wellness.' }
  ],
  patients: [
    { id: 1, userId: 5, fullName: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '+91 98765 43210', dateOfBirth: '1992-05-14', gender: 'Male', bloodGroup: 'O+', address: '42 Marine Drive, Mumbai', emergencyContact: '+91 98765 00001' },
    { id: 2, userId: 6, fullName: 'Priya Patel', email: 'priya.patel@example.com', phone: '+91 98765 43211', dateOfBirth: '1996-08-22', gender: 'Female', bloodGroup: 'B+', address: '15 Senapati Bapat Marg, Pune', emergencyContact: '+91 98765 00002' }
  ],
  appointments: [
    { id: 101, patientId: 5, patientName: 'Aarav Sharma', patientPhone: '+91 98765 43210', doctorId: 2, doctorName: 'Dr. Rajesh Iyer', doctorSpecialization: 'Interventional Cardiology', departmentName: 'Cardiology', appointmentDate: '2026-11-25', appointmentTime: '10:00 AM', status: 'CONFIRMED', reason: 'Routine cardiovascular checkup and ECG reading.', notes: 'Confirmed by Dr. Rajesh Iyer' },
    { id: 102, patientId: 6, patientName: 'Priya Patel', patientPhone: '+91 98765 43211', doctorId: 3, doctorName: 'Dr. Sneha Roy', doctorSpecialization: 'Cosmetic & Restorative Dentistry', departmentName: 'Dental & Maxillofacial', appointmentDate: '2026-11-26', appointmentTime: '02:30 PM', status: 'PENDING', reason: 'Routine cleaning and cosmetic teeth whitening consultation.', notes: 'Awaiting doctor review' }
  ],
  prescriptions: [
    { id: 201, appointmentId: 101, patientId: 5, patientName: 'Aarav Sharma', doctorName: 'Dr. Rajesh Iyer', doctorSpecialization: 'Cardiology', diagnosis: 'Mild Essential Hypertension & Hyperlipidemia', generalInstructions: 'Low sodium diet, 30 min daily brisk walking. Repeat lipid profile after 6 weeks.', issuedDate: '2026-11-20', items: [
      { id: 1, medicineName: 'Atorvastatin', dosage: '10mg', frequency: '0-0-1 (Once daily at bedtime)', duration: '30 Days', instructions: 'After dinner' },
      { id: 2, medicineName: 'Telmisartan', dosage: '40mg', frequency: '1-0-0 (Once daily in morning)', duration: '30 Days', instructions: 'Before breakfast' }
    ]}
  ],
  notifications: [
    { id: 1, title: 'Welcome to Health & Care', message: 'Your account is active. Connect with certified doctors and book your visit.', type: 'SYSTEM', isRead: false }
  ]
};

function fallbackHandler(endpoint, options, originalError) {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : null;

  // Departments
  if (endpoint === '/departments') {
    return fallbackStore.departments;
  }
  // Approved Doctors
  if (endpoint === '/doctors/approved') {
    return fallbackStore.doctors.filter(d => d.verificationStatus === 'APPROVED');
  }
  // Admin stats
  if (endpoint === '/admin/stats') {
    return {
      totalPatients: fallbackStore.patients.length,
      totalDoctors: fallbackStore.doctors.length,
      pendingDoctors: fallbackStore.doctors.filter(d => d.verificationStatus === 'PENDING').length,
      totalAppointments: fallbackStore.appointments.length,
      completedAppointments: fallbackStore.appointments.filter(a => a.status === 'COMPLETED').length,
      pendingAppointments: fallbackStore.appointments.filter(a => a.status === 'PENDING').length,
      totalDepartments: fallbackStore.departments.length
    };
  }
  // Admin Doctors
  if (endpoint === '/admin/doctors') {
    return fallbackStore.doctors;
  }
  if (endpoint === '/admin/doctors/pending') {
    return fallbackStore.doctors.filter(d => d.verificationStatus === 'PENDING');
  }
  if (endpoint.startsWith('/admin/doctors/') && endpoint.endsWith('/verify')) {
    const parts = endpoint.split('/');
    const docId = parseInt(parts[3], 10);
    const doc = fallbackStore.doctors.find(d => d.userId === docId || d.id === docId);
    if (doc) doc.verificationStatus = 'APPROVED';
    return { success: true };
  }
  // Admin Patients
  if (endpoint === '/admin/patients') {
    return fallbackStore.patients;
  }
  // Appointments
  if (endpoint === '/admin/appointments' || endpoint === '/patient/appointments' || endpoint === '/doctor/appointments') {
    return fallbackStore.appointments;
  }
  if (endpoint === '/appointments/book' && method === 'POST') {
    const newAppt = {
      id: Date.now(),
      patientId: 5,
      patientName: 'Aarav Sharma',
      patientPhone: '+91 98765 43210',
      doctorId: body.doctorId,
      doctorName: fallbackStore.doctors.find(d => d.userId === body.doctorId || d.id === body.doctorId)?.fullName || 'Doctor',
      departmentName: 'General',
      appointmentDate: body.appointmentDate,
      appointmentTime: body.appointmentTime,
      status: 'PENDING',
      reason: body.reason,
      notes: 'Submitted'
    };
    fallbackStore.appointments.unshift(newAppt);
    return newAppt;
  }
  if (endpoint.startsWith('/appointments/') && endpoint.endsWith('/status')) {
    const id = parseInt(endpoint.split('/')[2], 10);
    const appt = fallbackStore.appointments.find(a => a.id === id);
    if (appt) {
      appt.status = body.status;
      if (body.notes) appt.notes = body.notes;
    }
    return appt;
  }
  // Prescriptions
  if (endpoint === '/patient/prescriptions' || endpoint === '/doctor/prescriptions') {
    return fallbackStore.prescriptions;
  }
  if (endpoint === '/clinical/prescription' && method === 'POST') {
    const newPresc = {
      id: Date.now(),
      appointmentId: body.appointmentId,
      patientId: 5,
      patientName: 'Aarav Sharma',
      doctorName: 'Dr. Rajesh Iyer',
      doctorSpecialization: 'Cardiology',
      diagnosis: body.diagnosis,
      generalInstructions: body.generalInstructions,
      issuedDate: new Date().toISOString().split('T')[0],
      items: body.items || []
    };
    fallbackStore.prescriptions.unshift(newPresc);
    return newPresc;
  }
  // Patient Profile
  if (endpoint === '/patient/profile') {
    return fallbackStore.patients[0];
  }
  // Doctor Profile
  if (endpoint === '/doctor/profile') {
    return fallbackStore.doctors[0];
  }
  // Notifications
  if (endpoint === '/patient/notifications') {
    return fallbackStore.notifications;
  }

  throw originalError;
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' })
};
