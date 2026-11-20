import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Users, Stethoscope, Calendar, Layers, Shield,
  CheckCircle2, XCircle, LogOut, HeartPulse, Plus,
  Trash2, FileText, Edit2, X
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('patients'); // patients (default), registered-doctors, doctor-verification, appointments, records, departments
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    pendingDoctors: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    totalDepartments: 0
  });

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Patient Add/Edit Form State
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [patientEditId, setPatientEditId] = useState(null);
  const [patientForm, setPatientForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '',
    emergencyContact: ''
  });

  // Doctor Add/Edit Form State
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [doctorEditId, setDoctorEditId] = useState(null);
  const [doctorForm, setDoctorForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    departmentId: '',
    specialization: '',
    qualification: '',
    experienceYears: 5,
    consultationFee: 600,
    availableDays: 'Mon,Tue,Wed,Thu,Fri',
    workingHours: '09:00 - 17:00'
  });

  // Department Form State
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptDesc, setDeptDesc] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const s = await api.get('/admin/stats');
      if (s) setStats(s);

      const docs = await api.get('/admin/doctors');
      setDoctors(docs || []);

      const pts = await api.get('/admin/patients');
      setPatients(pts || []);

      const appts = await api.get('/admin/appointments');
      setAppointments(appts || []);

      const recs = await api.get('/admin/records/prescriptions');
      setPrescriptions(recs || []);

      const depts = await api.get('/admin/departments');
      setDepartments(depts || []);
    } catch (e) {
      console.error('Error loading admin data', e);
    }
  };

  // --- PATIENT HANDLERS ---
  const openAddPatient = () => {
    setPatientEditId(null);
    setPatientForm({
      fullName: '',
      email: '',
      password: '',
      phone: '',
      dateOfBirth: '',
      gender: 'Male',
      bloodGroup: 'O+',
      address: '',
      emergencyContact: ''
    });
    setShowPatientForm(true);
  };

  const openEditPatient = (p) => {
    setPatientEditId(p.userId || p.id);
    setPatientForm({
      fullName: p.fullName || '',
      email: p.email || '',
      password: '',
      phone: p.phone || '',
      dateOfBirth: p.dateOfBirth || '',
      gender: p.gender || 'Male',
      bloodGroup: p.bloodGroup || 'O+',
      address: p.address || '',
      emergencyContact: p.emergencyContact || ''
    });
    setShowPatientForm(true);
  };

  const handleSavePatient = async (e) => {
    e.preventDefault();
    try {
      if (patientEditId) {
        await api.put(`/admin/patients/${patientEditId}`, patientForm);
        alert('Patient details updated successfully!');
      } else {
        await api.post('/admin/patients', patientForm);
        alert('New patient added successfully!');
      }
      setShowPatientForm(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Error saving patient details');
    }
  };

  const handleDeletePatient = async (userId, name) => {
    if (window.confirm(`Are you sure you want to permanently delete patient "${name}" and all their associated records? This action cannot be undone.`)) {
      try {
        await api.delete(`/admin/patients/${userId}`);
        loadData();
      } catch (err) {
        alert(err.message || 'Error deleting patient');
      }
    }
  };

  // --- DOCTOR HANDLERS ---
  const openAddDoctor = () => {
    setDoctorEditId(null);
    setDoctorForm({
      fullName: '',
      email: '',
      password: '',
      phone: '',
      departmentId: departments.length > 0 ? departments[0].id : '',
      specialization: '',
      qualification: '',
      experienceYears: 5,
      consultationFee: 600,
      availableDays: 'Mon,Tue,Wed,Thu,Fri',
      workingHours: '09:00 - 17:00'
    });
    setShowDoctorForm(true);
  };

  const openEditDoctor = (d) => {
    setDoctorEditId(d.userId || d.id);
    setDoctorForm({
      fullName: d.fullName || '',
      email: d.email || '',
      password: '',
      phone: d.phone || '',
      departmentId: d.departmentId || '',
      specialization: d.specialization || '',
      qualification: d.qualification || '',
      experienceYears: d.experienceYears || 5,
      consultationFee: d.consultationFee || 600,
      availableDays: d.availableDays || 'Mon,Tue,Wed,Thu,Fri',
      workingHours: d.workingHours || '09:00 - 17:00'
    });
    setShowDoctorForm(true);
  };

  const handleSaveDoctor = async (e) => {
    e.preventDefault();
    try {
      if (doctorEditId) {
        await api.put(`/admin/doctors/${doctorEditId}`, doctorForm);
        alert('Doctor details updated successfully!');
      } else {
        await api.post('/admin/doctors', doctorForm);
        alert('New doctor registered and added successfully!');
      }
      setShowDoctorForm(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Error saving doctor details');
    }
  };

  const handleDeleteDoctor = async (userId, name) => {
    if (window.confirm(`Are you sure you want to permanently delete Dr. "${name}" and their clinical profile? This action cannot be undone.`)) {
      try {
        await api.delete(`/admin/doctors/${userId}`);
        loadData();
      } catch (err) {
        alert(err.message || 'Error deleting doctor');
      }
    }
  };

  const handleVerifyDoctor = async (userId, approved) => {
    const action = approved ? 'approve' : 'reject';
    if (window.confirm(`Are you sure you want to ${action} this doctor's application?`)) {
      try {
        await api.post(`/admin/doctors/${userId}/verify?approved=${approved}`);
        loadData();
      } catch (err) {
        alert(err.message || 'Error processing doctor verification');
      }
    }
  };

  // --- APPOINTMENT & PRESCRIPTION HANDLERS ---
  const handleDeleteAppointment = async (id) => {
    if (window.confirm(`Are you sure you want to delete appointment record #${id}?`)) {
      try {
        await api.delete(`/admin/appointments/${id}`);
        loadData();
      } catch (err) {
        alert(err.message || 'Error deleting appointment record');
      }
    }
  };

  const handleDeletePrescription = async (id) => {
    if (window.confirm(`Are you sure you want to delete medical prescription record #${id}?`)) {
      try {
        await api.delete(`/admin/records/prescriptions/${id}`);
        loadData();
      } catch (err) {
        alert(err.message || 'Error deleting prescription record');
      }
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!deptName) return;
    try {
      await api.post('/admin/departments', {
        name: deptName,
        description: deptDesc,
        iconName: 'HeartPulse',
        isActive: true
      });
      setDeptName('');
      setDeptDesc('');
      setShowDeptForm(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Error adding department');
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '20px', borderBottom: '1px solid #E2ECE7' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#145C4B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Shield size={22} />
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1rem', color: '#145C4B' }}>HEALTH &amp; CARE</div>
            <div style={{ fontSize: '0.72rem', color: '#687B74' }}>Administration Portal</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            onClick={() => setActiveTab('patients')}
            className={`sidebar-item ${activeTab === 'patients' ? 'active' : ''}`}
          >
            <Users size={18} /> Registered Patients ({patients.length})
          </button>
          <button
            onClick={() => setActiveTab('registered-doctors')}
            className={`sidebar-item ${activeTab === 'registered-doctors' ? 'active' : ''}`}
          >
            <Stethoscope size={18} /> Registered Doctors ({doctors.length})
          </button>
          <button
            onClick={() => setActiveTab('doctor-verification')}
            className={`sidebar-item ${activeTab === 'doctor-verification' ? 'active' : ''}`}
          >
            <CheckCircle2 size={18} /> Doctor Verification ({stats.pendingDoctors})
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`sidebar-item ${activeTab === 'appointments' ? 'active' : ''}`}
          >
            <Calendar size={18} /> Platform Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`sidebar-item ${activeTab === 'records' ? 'active' : ''}`}
          >
            <FileText size={18} /> Medical Records ({prescriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`sidebar-item ${activeTab === 'departments' ? 'active' : ''}`}
          >
            <Layers size={18} /> Medical Departments ({departments.length})
          </button>
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #E2ECE7', paddingTop: '16px' }}>
          <div style={{ fontSize: '0.82rem', color: '#193B34', fontWeight: '700', marginBottom: '4px' }}>
            {user?.fullName}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#687B74', marginBottom: '14px' }}>
            Platform Administrator
          </div>
          <button onClick={logout} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* KPI Summary Cards */}
        <div className="grid-4" style={{ marginBottom: '28px' }}>
          <div className="card" style={{ borderLeft: '4px solid #145C4B', padding: '18px' }}>
            <div style={{ fontSize: '0.8rem', color: '#687B74', fontWeight: '600' }}>TOTAL PATIENTS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#145C4B' }}>{stats.totalPatients}</div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid #1B8067', padding: '18px' }}>
            <div style={{ fontSize: '0.8rem', color: '#687B74', fontWeight: '600' }}>TOTAL DOCTORS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1B8067' }}>{stats.totalDoctors}</div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid #F59E0B', padding: '18px' }}>
            <div style={{ fontSize: '0.8rem', color: '#687B74', fontWeight: '600' }}>PENDING DOCTORS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#F59E0B' }}>{stats.pendingDoctors}</div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid #3B82F6', padding: '18px' }}>
            <div style={{ fontSize: '0.8rem', color: '#687B74', fontWeight: '600' }}>APPOINTMENTS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#3B82F6' }}>{stats.totalAppointments}</div>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: REGISTERED PATIENTS (THE FIRST PAGE)
            Features: View all patients, Add Patient, Modify Patient Details, Delete Patient
        ========================================================================== */}
        {activeTab === 'patients' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#145C4B' }}>Registered Patients &amp; Records Management</h2>
                <p style={{ color: '#687B74', fontSize: '0.9rem' }}>Manage patient demographics, add new patients, edit details, or remove accounts</p>
              </div>
              <button onClick={openAddPatient} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} /> Add Patient
              </button>
            </div>

            {/* Expandable Add / Modify Patient Form */}
            {showPatientForm && (
              <div className="card" style={{ marginBottom: '24px', background: '#F8FBF9', border: '1px solid #CDE1D9', padding: '24px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#145C4B' }}>
                    {patientEditId ? 'Modify Patient Details' : 'Add New Patient'}
                  </h3>
                  <button onClick={() => setShowPatientForm(false)} className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }}>
                    <X size={16} />
                  </button>
                </div>
                <form onSubmit={handleSavePatient}>
                  <div className="grid-2" style={{ gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={patientForm.fullName}
                        onChange={e => setPatientForm({ ...patientForm, fullName: e.target.value })}
                        placeholder="e.g. Aarav Sharma"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        required
                        disabled={!!patientEditId}
                        className="form-control"
                        value={patientForm.email}
                        onChange={e => setPatientForm({ ...patientForm, email: e.target.value })}
                        placeholder="e.g. aarav.sharma@example.com"
                      />
                    </div>
                    {!patientEditId && (
                      <div className="form-group">
                        <label className="form-label">Account Password *</label>
                        <input
                          type="password"
                          required
                          className="form-control"
                          value={patientForm.password}
                          onChange={e => setPatientForm({ ...patientForm, password: e.target.value })}
                          placeholder="Min 6 characters"
                        />
                      </div>
                    )}
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        className="form-control"
                        value={patientForm.phone}
                        onChange={e => setPatientForm({ ...patientForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control"
                        value={patientForm.dateOfBirth}
                        onChange={e => setPatientForm({ ...patientForm, dateOfBirth: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select
                        className="form-control"
                        value={patientForm.gender}
                        onChange={e => setPatientForm({ ...patientForm, gender: e.target.value })}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Blood Group</label>
                      <select
                        className="form-control"
                        value={patientForm.bloodGroup}
                        onChange={e => setPatientForm({ ...patientForm, bloodGroup: e.target.value })}
                      >
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Emergency Contact Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={patientForm.emergencyContact}
                        onChange={e => setPatientForm({ ...patientForm, emergencyContact: e.target.value })}
                        placeholder="+91 98765 00001"
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginTop: '12px' }}>
                    <label className="form-label">Residential Address</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      value={patientForm.address}
                      onChange={e => setPatientForm({ ...patientForm, address: e.target.value })}
                      placeholder="Enter street and city address..."
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                    <button type="submit" className="btn btn-primary btn-sm">
                      {patientEditId ? 'Update Patient Details' : 'Save Patient'}
                    </button>
                    <button type="button" onClick={() => setShowPatientForm(false)} className="btn btn-outline btn-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Patients Table */}
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Blood Group</th>
                    <th>Address</th>
                    <th>Emergency Contact</th>
                    <th>Management Action</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p.id || p.userId}>
                      <td style={{ fontWeight: '600', color: '#193B34' }}>{p.fullName}</td>
                      <td>{p.email}</td>
                      <td>{p.phone}</td>
                      <td>{p.gender || 'N/A'}</td>
                      <td><span className="badge badge-mint">{p.bloodGroup || 'O+'}</span></td>
                      <td style={{ fontSize: '0.85rem', color: '#687B74' }}>{p.address || 'N/A'}</td>
                      <td style={{ fontSize: '0.85rem', color: '#687B74' }}>{p.emergencyContact || 'N/A'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => openEditPatient(p)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                            title="Modify patient details"
                          >
                            <Edit2 size={13} /> Modify Details
                          </button>
                          <button
                            onClick={() => handleDeletePatient(p.userId || p.id, p.fullName)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 10px', fontSize: '0.78rem', color: '#DE350B', borderColor: '#FCA5A5', display: 'flex', alignItems: 'center', gap: '4px' }}
                            title="Permanently remove patient and associated records"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {patients.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', color: '#687B74', padding: '24px' }}>
                        No registered patients found. Click "+ Add Patient" to register one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: REGISTERED DOCTORS (NEW SIDEBAR ITEM)
            Features: View all registered doctors, Add Doctor, Modify Doctor Details, Delete Doctor
        ========================================================================== */}
        {activeTab === 'registered-doctors' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#145C4B' }}>Registered Doctors</h2>
                <p style={{ color: '#687B74', fontSize: '0.9rem' }}>All active clinical practitioners, specialists, and departmental consultants</p>
              </div>
              <button onClick={openAddDoctor} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} /> Add Doctor
              </button>
            </div>

            {/* Expandable Add / Modify Doctor Form */}
            {showDoctorForm && (
              <div className="card" style={{ marginBottom: '24px', background: '#F8FBF9', border: '1px solid #CDE1D9', padding: '24px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#145C4B' }}>
                    {doctorEditId ? 'Modify Doctor Details' : 'Register New Doctor'}
                  </h3>
                  <button onClick={() => setShowDoctorForm(false)} className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }}>
                    <X size={16} />
                  </button>
                </div>
                <form onSubmit={handleSaveDoctor}>
                  <div className="grid-2" style={{ gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Doctor Full Name *</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={doctorForm.fullName}
                        onChange={e => setDoctorForm({ ...doctorForm, fullName: e.target.value })}
                        placeholder="e.g. Dr. Rajesh Iyer"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        required
                        disabled={!!doctorEditId}
                        className="form-control"
                        value={doctorForm.email}
                        onChange={e => setDoctorForm({ ...doctorForm, email: e.target.value })}
                        placeholder="e.g. rajesh.iyer@healthandcare.com"
                      />
                    </div>
                    {!doctorEditId && (
                      <div className="form-group">
                        <label className="form-label">Account Password *</label>
                        <input
                          type="password"
                          required
                          className="form-control"
                          value={doctorForm.password}
                          onChange={e => setDoctorForm({ ...doctorForm, password: e.target.value })}
                          placeholder="Min 6 characters"
                        />
                      </div>
                    )}
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        className="form-control"
                        value={doctorForm.phone}
                        onChange={e => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                        placeholder="+91 98111 22334"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Department *</label>
                      <select
                        className="form-control"
                        value={doctorForm.departmentId}
                        onChange={e => setDoctorForm({ ...doctorForm, departmentId: e.target.value })}
                      >
                        <option value="">Select Clinical Department</option>
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Specialization *</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={doctorForm.specialization}
                        onChange={e => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                        placeholder="e.g. Interventional Cardiology"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Qualification *</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={doctorForm.qualification}
                        onChange={e => setDoctorForm({ ...doctorForm, qualification: e.target.value })}
                        placeholder="e.g. MD, DM (Cardiology)"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Experience (Years)</label>
                      <input
                        type="number"
                        min="0"
                        max="60"
                        className="form-control"
                        value={doctorForm.experienceYears}
                        onChange={e => setDoctorForm({ ...doctorForm, experienceYears: parseInt(e.target.value, 10) || 0 })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Consultation Fee (₹)</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        value={doctorForm.consultationFee}
                        onChange={e => setDoctorForm({ ...doctorForm, consultationFee: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Available Days</label>
                      <input
                        type="text"
                        className="form-control"
                        value={doctorForm.availableDays}
                        onChange={e => setDoctorForm({ ...doctorForm, availableDays: e.target.value })}
                        placeholder="Mon,Tue,Wed,Thu,Fri"
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                    <button type="submit" className="btn btn-primary btn-sm">
                      {doctorEditId ? 'Update Doctor Details' : 'Register Doctor'}
                    </button>
                    <button type="button" onClick={() => setShowDoctorForm(false)} className="btn btn-outline btn-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Doctors Table */}
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Doctor Name</th>
                    <th>Email &amp; Phone</th>
                    <th>Department</th>
                    <th>Specialization</th>
                    <th>Qualification</th>
                    <th>Experience</th>
                    <th>Fee</th>
                    <th>Status</th>
                    <th>Management Action</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map(d => (
                    <tr key={d.id || d.userId}>
                      <td style={{ fontWeight: '600', color: '#193B34' }}>{d.fullName}</td>
                      <td>
                        <div>{d.email}</div>
                        <div style={{ fontSize: '0.8rem', color: '#687B74' }}>{d.phone}</div>
                      </td>
                      <td><span className="badge badge-mint">{d.departmentName || 'General'}</span></td>
                      <td style={{ fontWeight: '500' }}>{d.specialization}</td>
                      <td style={{ fontSize: '0.85rem' }}>{d.qualification}</td>
                      <td>{d.experienceYears} yrs</td>
                      <td style={{ fontWeight: '600', color: '#145C4B' }}>₹{d.consultationFee}</td>
                      <td>
                        {d.verificationStatus === 'APPROVED' && <span className="badge badge-confirmed">Approved</span>}
                        {d.verificationStatus === 'PENDING' && <span className="badge badge-pending">Pending Review</span>}
                        {d.verificationStatus === 'REJECTED' && <span className="badge badge-rejected">Rejected</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => openEditDoctor(d)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                            title="Modify doctor details"
                          >
                            <Edit2 size={13} /> Modify Details
                          </button>
                          <button
                            onClick={() => handleDeleteDoctor(d.userId || d.id, d.fullName)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 10px', fontSize: '0.78rem', color: '#DE350B', borderColor: '#FCA5A5', display: 'flex', alignItems: 'center', gap: '4px' }}
                            title="Permanently remove doctor account"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {doctors.length === 0 && (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', color: '#687B74', padding: '24px' }}>
                        No registered doctors found. Click "+ Add Doctor" to register one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: DOCTOR VERIFICATION (APPROVALS)
        ========================================================================== */}
        {activeTab === 'doctor-verification' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#145C4B' }}>Doctor Verification &amp; Credential Approval</h2>
                <p style={{ color: '#687B74', fontSize: '0.9rem' }}>Evaluate clinical credentials, registration numbers, and approve login privileges</p>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Doctor Name</th>
                    <th>Specialization</th>
                    <th>Qualification</th>
                    <th>Experience</th>
                    <th>Reg No.</th>
                    <th>Status</th>
                    <th>Verification Action</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map(d => (
                    <tr key={d.id || d.userId}>
                      <td style={{ fontWeight: '600', color: '#193B34' }}>{d.fullName}</td>
                      <td>{d.specialization}</td>
                      <td style={{ fontSize: '0.85rem' }}>{d.qualification}</td>
                      <td>{d.experienceYears} yrs</td>
                      <td style={{ fontSize: '0.82rem', fontFamily: 'monospace' }}>{d.medicalRegistrationNo || 'N/A'}</td>
                      <td>
                        {d.verificationStatus === 'APPROVED' && <span className="badge badge-confirmed">Approved</span>}
                        {d.verificationStatus === 'PENDING' && <span className="badge badge-pending">Pending Review</span>}
                        {d.verificationStatus === 'REJECTED' && <span className="badge badge-rejected">Rejected</span>}
                      </td>
                      <td>
                        {d.verificationStatus === 'PENDING' ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => handleVerifyDoctor(d.userId || d.id, true)}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleVerifyDoctor(d.userId || d.id, false)}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '4px 10px', fontSize: '0.78rem', color: '#DE350B', borderColor: '#DE350B' }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#687B74' }}>Verified</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {doctors.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: '#687B74', padding: '24px' }}>
                        No doctors awaiting verification.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: APPOINTMENTS MONITORING & MANAGEMENT
        ========================================================================== */}
        {activeTab === 'appointments' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#145C4B' }}>Platform Appointments &amp; Booking Records</h2>
              <p style={{ color: '#687B74', fontSize: '0.9rem' }}>Real-time synchronization across all departments with record audit controls</p>
            </div>

            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Reason</th>
                    <th>Management Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.id}>
                      <td><strong>#{a.id}</strong></td>
                      <td style={{ fontWeight: '600' }}>{a.patientName}</td>
                      <td>{a.doctorName}</td>
                      <td>{a.departmentName || 'General'}</td>
                      <td>{a.appointmentDate}</td>
                      <td>{a.appointmentTime}</td>
                      <td>
                        {a.status === 'CONFIRMED' && <span className="badge badge-confirmed">Confirmed</span>}
                        {a.status === 'PENDING' && <span className="badge badge-pending">Pending</span>}
                        {a.status === 'COMPLETED' && <span className="badge badge-completed">Completed</span>}
                        {a.status === 'CANCELLED' && <span className="badge badge-cancelled">Cancelled</span>}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#687B74' }}>{a.reason}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteAppointment(a.id)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.78rem', color: '#DE350B', borderColor: '#FCA5A5', display: 'flex', alignItems: 'center', gap: '4px' }}
                          title="Delete appointment record"
                        >
                          <Trash2 size={13} /> Delete Record
                        </button>
                      </td>
                    </tr>
                  ))}
                  {appointments.length === 0 && (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', color: '#687B74', padding: '24px' }}>
                        No platform appointments recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: MEDICAL RECORDS & PRESCRIPTIONS
        ========================================================================== */}
        {activeTab === 'records' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#145C4B' }}>Clinical Records &amp; Prescriptions</h2>
              <p style={{ color: '#687B74', fontSize: '0.9rem' }}>Comprehensive management and deletion of clinical records, prescriptions, and consult notes</p>
            </div>

            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Rx ID</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Specialization</th>
                    <th>Diagnosis</th>
                    <th>Prescription Items</th>
                    <th>Date</th>
                    <th>Management Action</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map(pr => (
                    <tr key={pr.id}>
                      <td><strong style={{ color: '#145C4B' }}>#RX-{pr.id}</strong></td>
                      <td style={{ fontWeight: '600' }}>{pr.patientName}</td>
                      <td>{pr.doctorName}</td>
                      <td style={{ fontSize: '0.85rem' }}>{pr.doctorSpecialization}</td>
                      <td style={{ fontWeight: '500', color: '#193B34' }}>{pr.diagnosis}</td>
                      <td style={{ fontSize: '0.82rem' }}>
                        {pr.items && pr.items.length > 0 ? (
                          pr.items.map(i => `${i.medicineName} (${i.dosage})`).join(', ')
                        ) : (
                          <span style={{ color: '#687B74' }}>{pr.generalInstructions || 'Clinical note'}</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#687B74' }}>{pr.issuedDate}</td>
                      <td>
                        <button
                          onClick={() => handleDeletePrescription(pr.id)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.78rem', color: '#DE350B', borderColor: '#FCA5A5', display: 'flex', alignItems: 'center', gap: '4px' }}
                          title="Permanently remove clinical record"
                        >
                          <Trash2 size={13} /> Delete Record
                        </button>
                      </td>
                    </tr>
                  ))}
                  {prescriptions.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', color: '#687B74', padding: '24px' }}>
                        No clinical records or prescriptions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: MEDICAL DEPARTMENTS
        ========================================================================== */}
        {activeTab === 'departments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#145C4B' }}>Medical Departments</h2>
                <p style={{ color: '#687B74', fontSize: '0.9rem' }}>Organize clinical specializations and specialties</p>
              </div>
              <button onClick={() => setShowDeptForm(!showDeptForm)} className="btn btn-primary btn-sm">
                <Plus size={16} /> Add Department
              </button>
            </div>

            {showDeptForm && (
              <div className="card" style={{ marginBottom: '24px', maxWidth: '600px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#145C4B', marginBottom: '14px' }}>New Clinical Department</h3>
                <form onSubmit={handleAddDepartment}>
                  <div className="form-group">
                    <label className="form-label">Department Name *</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. Ophthalmology & Eye Care"
                      value={deptName}
                      onChange={e => setDeptName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      placeholder="Brief description of department scope..."
                      value={deptDesc}
                      onChange={e => setDeptDesc(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary btn-sm">Save Department</button>
                    <button type="button" onClick={() => setShowDeptForm(false)} className="btn btn-outline btn-sm">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid-3">
              {departments.map(d => (
                <div key={d.id} className="card card-hover">
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#193B34', marginBottom: '8px' }}>{d.name}</h3>
                  <p style={{ color: '#687B74', fontSize: '0.88rem', lineHeight: '1.6' }}>{d.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
