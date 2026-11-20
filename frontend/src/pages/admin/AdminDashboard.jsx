import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Users, Stethoscope, Calendar, Layers, Shield,
  CheckCircle2, XCircle, LogOut, HeartPulse, Plus
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('doctors'); // doctors, patients, appointments, departments
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
  const [departments, setDepartments] = useState([]);

  // New Department Form
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

      const depts = await api.get('/admin/departments');
      setDepartments(depts || []);
    } catch (e) {
      console.error('Error loading admin data', e);
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
            onClick={() => setActiveTab('doctors')}
            className={`sidebar-item ${activeTab === 'doctors' ? 'active' : ''}`}
          >
            <Stethoscope size={18} /> Doctor Verification ({stats.pendingDoctors})
          </button>
          <button
            onClick={() => setActiveTab('patients')}
            className={`sidebar-item ${activeTab === 'patients' ? 'active' : ''}`}
          >
            <Users size={18} /> Registered Patients
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`sidebar-item ${activeTab === 'appointments' ? 'active' : ''}`}
          >
            <Calendar size={18} /> Platform Appointments
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`sidebar-item ${activeTab === 'departments' ? 'active' : ''}`}
          >
            <Layers size={18} /> Medical Departments
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

        {/* TAB 1: DOCTOR MANAGEMENT & VERIFICATION */}
        {activeTab === 'doctors' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#145C4B' }}>Doctor Verification &amp; Management</h2>
                <p style={{ color: '#687B74', fontSize: '0.9rem' }}>Evaluate medical credentials and approve clinical login privileges</p>
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
                      <td style={{ fontSize: '0.82rem', fontFamily: 'monospace' }}>{d.medicalRegistrationNo}</td>
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
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PATIENT MANAGEMENT */}
        {activeTab === 'patients' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#145C4B' }}>Registered Patients</h2>
              <p style={{ color: '#687B74', fontSize: '0.9rem' }}>Demographics and emergency contact records</p>
            </div>

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
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: '600', color: '#193B34' }}>{p.fullName}</td>
                      <td>{p.email}</td>
                      <td>{p.phone}</td>
                      <td>{p.gender || 'N/A'}</td>
                      <td><span className="badge badge-mint">{p.bloodGroup || 'O+'}</span></td>
                      <td style={{ fontSize: '0.85rem', color: '#687B74' }}>{p.address || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: APPOINTMENTS MONITORING */}
        {activeTab === 'appointments' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#145C4B' }}>Platform Appointments</h2>
              <p style={{ color: '#687B74', fontSize: '0.9rem' }}>Real-time synchronization across all departments</p>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: DEPARTMENTS */}
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
