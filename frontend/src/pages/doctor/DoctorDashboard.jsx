import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Calendar, CheckCircle2, XCircle, FileText, User,
  Clock, Plus, HeartPulse, LogOut, Stethoscope, AlertCircle
} from 'lucide-react';

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('appointments'); // appointments, consult, profile
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);

  // Consultation & Prescription Modal State
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [instructions, setInstructions] = useState('');
  const [medicineList, setMedicineList] = useState([
    { medicineName: 'Amoxicillin', dosage: '500mg', frequency: '1-0-1 (Twice daily)', duration: '5 Days', instructions: 'After food' }
  ]);
  const [prescriptionSuccess, setPrescriptionSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const appts = await api.get('/doctor/appointments');
      setAppointments(appts || []);

      const prof = await api.get('/doctor/profile');
      setProfile(prof);
    } catch (e) {
      console.error('Error loading doctor data', e);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.post(`/doctor/appointments/${id}/status`, {
        status,
        notes: status === 'CONFIRMED' ? 'Accepted by Doctor' : 'Declined by Doctor'
      });
      loadData();
    } catch (err) {
      alert(err.message || 'Error updating status');
    }
  };

  const handleOpenConsultation = (appt) => {
    setSelectedAppt(appt);
    setDiagnosis(appt.reason || 'General Health Consultation');
    setInstructions('Drink plenty of water and rest.');
    setPrescriptionSuccess('');
    setActiveTab('consult');
  };

  const handleAddMedicine = () => {
    setMedicineList([
      ...medicineList,
      { medicineName: '', dosage: '500mg', frequency: '1-0-1', duration: '5 Days', instructions: 'After meals' }
    ]);
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicineList];
    updated[index][field] = value;
    setMedicineList(updated);
  };

  const handleSavePrescription = async (e) => {
    e.preventDefault();
    if (!selectedAppt) return;

    try {
      await api.post('/clinical/prescription', {
        appointmentId: selectedAppt.id,
        diagnosis,
        generalInstructions: instructions,
        items: medicineList
      });

      // Update appointment status to COMPLETED
      await api.post(`/doctor/appointments/${selectedAppt.id}/status`, {
        status: 'COMPLETED',
        notes: 'Consultation conducted and prescription released.'
      });

      setPrescriptionSuccess('Prescription issued and patient record updated successfully!');
      loadData();
      setTimeout(() => {
        setActiveTab('appointments');
        setSelectedAppt(null);
      }, 1500);
    } catch (err) {
      alert(err.message || 'Failed to save prescription');
    }
  };

  const pendingCount = appointments.filter(a => a.status === 'PENDING').length;
  const confirmedCount = appointments.filter(a => a.status === 'CONFIRMED').length;
  const completedCount = appointments.filter(a => a.status === 'COMPLETED').length;

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '20px', borderBottom: '1px solid #E2ECE7' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#145C4B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Stethoscope size={22} />
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1rem', color: '#145C4B' }}>HEALTH &amp; CARE</div>
            <div style={{ fontSize: '0.72rem', color: '#687B74' }}>Doctor Portal</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`sidebar-item ${activeTab === 'appointments' ? 'active' : ''}`}
          >
            <Calendar size={18} /> Assigned Appointments
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <User size={18} /> Clinical Profile
          </button>
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #E2ECE7', paddingTop: '16px' }}>
          <div style={{ fontSize: '0.82rem', color: '#193B34', fontWeight: '700', marginBottom: '4px' }}>
            {user?.fullName}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#687B74', marginBottom: '14px' }}>
            {profile?.specialization || 'Clinical Specialist'}
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
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#145C4B' }}>{appointments.length}</div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid #F59E0B', padding: '18px' }}>
            <div style={{ fontSize: '0.8rem', color: '#687B74', fontWeight: '600' }}>NEW REQUESTS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#F59E0B' }}>{pendingCount}</div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid #10B981', padding: '18px' }}>
            <div style={{ fontSize: '0.8rem', color: '#687B74', fontWeight: '600' }}>CONFIRMED TODAY</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10B981' }}>{confirmedCount}</div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid #3B82F6', padding: '18px' }}>
            <div style={{ fontSize: '0.8rem', color: '#687B74', fontWeight: '600' }}>COMPLETED</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#3B82F6' }}>{completedCount}</div>
          </div>
        </div>

        {/* TAB 1: APPOINTMENT MANAGEMENT */}
        {activeTab === 'appointments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#145C4B' }}>Clinical Appointments</h2>
                <p style={{ color: '#687B74', fontSize: '0.9rem' }}>Accept, decline, and conduct patient consultations</p>
              </div>
            </div>

            {appointments.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
                <Calendar size={48} color="#145C4B" style={{ margin: '0 auto 16px', opacity: 0.6 }} />
                <h3 style={{ fontSize: '1.2rem', color: '#145C4B' }}>No Appointments Assigned</h3>
                <p style={{ color: '#687B74' }}>When patients book with you, their requests will appear here.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Patient Name</th>
                      <th>Phone</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Clinical Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(a => (
                      <tr key={a.id}>
                        <td><strong>#{a.id}</strong></td>
                        <td style={{ fontWeight: '600', color: '#193B34' }}>{a.patientName}</td>
                        <td style={{ fontSize: '0.85rem' }}>{a.patientPhone || 'N/A'}</td>
                        <td>{a.appointmentDate}</td>
                        <td>{a.appointmentTime}</td>
                        <td style={{ fontSize: '0.85rem', color: '#687B74' }}>{a.reason}</td>
                        <td>
                          {a.status === 'CONFIRMED' && <span className="badge badge-confirmed">Confirmed</span>}
                          {a.status === 'PENDING' && <span className="badge badge-pending">Action Required</span>}
                          {a.status === 'COMPLETED' && <span className="badge badge-completed">Completed</span>}
                          {a.status === 'REJECTED' && <span className="badge badge-rejected">Rejected</span>}
                          {a.status === 'CANCELLED' && <span className="badge badge-cancelled">Cancelled</span>}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {a.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(a.id, 'CONFIRMED')}
                                  className="btn btn-primary btn-sm"
                                  style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(a.id, 'REJECTED')}
                                  className="btn btn-outline btn-sm"
                                  style={{ padding: '4px 10px', fontSize: '0.78rem', color: '#DE350B', borderColor: '#DE350B' }}
                                >
                                  Decline
                                </button>
                              </>
                            )}

                            {a.status === 'CONFIRMED' && (
                              <button
                                onClick={() => handleOpenConsultation(a)}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                              >
                                <FileText size={14} /> Consult &amp; Prescribe
                              </button>
                            )}

                            {a.status === 'COMPLETED' && (
                              <span style={{ fontSize: '0.8rem', color: '#1B8067', fontWeight: '600' }}>✓ Completed</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CONSULTATION & PRESCRIPTION WORKFLOW */}
        {activeTab === 'consult' && selectedAppt && (
          <div style={{ maxWidth: '780px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#145C4B' }}>Consultation &amp; Prescription</h2>
                <p style={{ color: '#687B74', fontSize: '0.9rem' }}>Patient: <strong>{selectedAppt.patientName}</strong> | Appointment #{selectedAppt.id}</p>
              </div>
              <button onClick={() => setActiveTab('appointments')} className="btn btn-outline btn-sm">
                Cancel
              </button>
            </div>

            {prescriptionSuccess && (
              <div style={{ background: '#E6F4EA', color: '#137333', padding: '14px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} />
                <span>{prescriptionSuccess}</span>
              </div>
            )}

            <div className="card">
              <form onSubmit={handleSavePrescription}>
                <div className="form-group">
                  <label className="form-label">Clinical Diagnosis *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Acute Pharyngitis / Seasonal Allergic Rhinitis"
                    value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">General Advice &amp; Lifestyle Instructions</label>
                  <textarea
                    rows="2"
                    className="form-control"
                    placeholder="Dietary changes, rest recommendations, follow-up advice..."
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                  />
                </div>

                {/* Medicine Items List */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Prescription Medications</label>
                    <button type="button" onClick={handleAddMedicine} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px' }}>
                      <Plus size={14} /> Add Medicine
                    </button>
                  </div>

                  {medicineList.map((med, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        placeholder="Medicine name"
                        className="form-control"
                        required
                        value={med.medicineName}
                        onChange={e => handleMedicineChange(idx, 'medicineName', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Dosage (500mg)"
                        className="form-control"
                        required
                        value={med.dosage}
                        onChange={e => handleMedicineChange(idx, 'dosage', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Frequency (1-0-1)"
                        className="form-control"
                        required
                        value={med.frequency}
                        onChange={e => handleMedicineChange(idx, 'frequency', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Duration (5 Days)"
                        className="form-control"
                        required
                        value={med.duration}
                        onChange={e => handleMedicineChange(idx, 'duration', e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                  Release Prescription &amp; Complete Consultation
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: DOCTOR PROFILE */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: '640px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#145C4B', marginBottom: '8px' }}>
              Doctor Professional Profile
            </h2>
            <p style={{ color: '#687B74', fontSize: '0.9rem', marginBottom: '24px' }}>
              Verified medical credentials and clinical operating hours
            </p>

            <div className="card">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', fontSize: '0.9rem' }}>
                <div>
                  <div style={{ color: '#687B74', fontSize: '0.8rem' }}>DOCTOR NAME</div>
                  <div style={{ fontWeight: '700', color: '#193B34' }}>{profile?.fullName || user?.fullName}</div>
                </div>
                <div>
                  <div style={{ color: '#687B74', fontSize: '0.8rem' }}>SPECIALIZATION</div>
                  <div style={{ fontWeight: '700', color: '#1B8067' }}>{profile?.specialization || 'Cardiology'}</div>
                </div>
                <div>
                  <div style={{ color: '#687B74', fontSize: '0.8rem' }}>QUALIFICATION</div>
                  <div style={{ fontWeight: '600', color: '#193B34' }}>{profile?.qualification || 'MD, DM'}</div>
                </div>
                <div>
                  <div style={{ color: '#687B74', fontSize: '0.8rem' }}>EXPERIENCE</div>
                  <div style={{ fontWeight: '600', color: '#193B34' }}>{profile?.experienceYears || 12} Years</div>
                </div>
                <div>
                  <div style={{ color: '#687B74', fontSize: '0.8rem' }}>REGISTRATION NO.</div>
                  <div style={{ fontWeight: '600', color: '#193B34' }}>{profile?.medicalRegistrationNo || 'MCI-88321'}</div>
                </div>
                <div>
                  <div style={{ color: '#687B74', fontSize: '0.8rem' }}>CONSULTATION FEE</div>
                  <div style={{ fontWeight: '700', color: '#193B34' }}>₹{profile?.consultationFee || 800}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ color: '#687B74', fontSize: '0.8rem' }}>VERIFICATION STATUS</div>
                  <span className="badge badge-confirmed">Approved By Administration</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
