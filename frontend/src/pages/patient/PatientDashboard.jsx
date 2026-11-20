import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Calendar, User, FileText, Bell, PlusCircle, Clock,
  CheckCircle2, XCircle, LogOut, HeartPulse, Search, Filter, Shield
} from 'lucide-react';

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('appointments'); // appointments, book, doctors, records, profile
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);

  // Booking Form State
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('10:00 AM');
  const [reason, setReason] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  // Doctor Filter State
  const [searchDoc, setSearchDoc] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const appts = await api.get('/patient/appointments');
      setAppointments(appts || []);

      const docs = await api.get('/doctors/approved');
      setDoctors(docs || []);
      if (docs && docs.length > 0 && !selectedDoctorId) {
        setSelectedDoctorId(docs[0].userId || docs[0].id);
      }

      const depts = await api.get('/departments');
      setDepartments(depts || []);

      const prescs = await api.get('/patient/prescriptions');
      setPrescriptions(prescs || []);

      const notifs = await api.get('/patient/notifications');
      setNotifications(notifs || []);

      const prof = await api.get('/patient/profile');
      setProfile(prof);
    } catch (e) {
      console.error('Error loading patient data', e);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setBookingSuccess('');
    setBookingError('');

    if (!appointmentDate) {
      setBookingError('Please choose an appointment date.');
      return;
    }

    try {
      const payload = {
        doctorId: parseInt(selectedDoctorId, 10),
        appointmentDate,
        appointmentTime,
        reason
      };
      await api.post('/appointments/book', payload);
      setBookingSuccess('Appointment successfully requested! Doctor will review and confirm.');
      setReason('');
      loadData();
      setActiveTab('appointments');
    } catch (err) {
      setBookingError(err.message || 'Failed to book appointment.');
    }
  };

  const handleCancelAppointment = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await api.patch(`/appointments/${id}/status`, { status: 'CANCELLED', notes: 'Cancelled by patient' });
        loadData();
      } catch (err) {
        alert(err.message || 'Could not cancel appointment');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED': return <span className="badge badge-confirmed">Confirmed</span>;
      case 'PENDING': return <span className="badge badge-pending">Pending Review</span>;
      case 'COMPLETED': return <span className="badge badge-completed">Completed</span>;
      case 'CANCELLED': return <span className="badge badge-cancelled">Cancelled</span>;
      case 'REJECTED': return <span className="badge badge-rejected">Rejected</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.fullName.toLowerCase().includes(searchDoc.toLowerCase()) ||
                          doc.specialization.toLowerCase().includes(searchDoc.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || doc.departmentName === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '20px', borderBottom: '1px solid #E2ECE7' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#1B8067', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <HeartPulse size={22} />
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1rem', color: '#145C4B' }}>HEALTH &amp; CARE</div>
            <div style={{ fontSize: '0.72rem', color: '#687B74' }}>Patient Portal</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`sidebar-item ${activeTab === 'appointments' ? 'active' : ''}`}
          >
            <Calendar size={18} /> My Appointments
          </button>
          <button
            onClick={() => setActiveTab('book')}
            className={`sidebar-item ${activeTab === 'book' ? 'active' : ''}`}
          >
            <PlusCircle size={18} /> Book Appointment
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`sidebar-item ${activeTab === 'doctors' ? 'active' : ''}`}
          >
            <Search size={18} /> Find Specialists
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`sidebar-item ${activeTab === 'records' ? 'active' : ''}`}
          >
            <FileText size={18} /> Prescriptions &amp; Records
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <User size={18} /> Personal Profile
          </button>
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #E2ECE7', paddingTop: '16px' }}>
          <div style={{ fontSize: '0.82rem', color: '#193B34', fontWeight: '700', marginBottom: '4px' }}>
            {user?.fullName}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#687B74', marginBottom: '14px' }}>
            {user?.email}
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
          <div className="card" style={{ borderLeft: '4px solid #1B8067', padding: '18px' }}>
            <div style={{ fontSize: '0.8rem', color: '#687B74', fontWeight: '600' }}>TOTAL VISITS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#145C4B' }}>{appointments.length}</div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid #F59E0B', padding: '18px' }}>
            <div style={{ fontSize: '0.8rem', color: '#687B74', fontWeight: '600' }}>PENDING</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#F59E0B' }}>
              {appointments.filter(a => a.status === 'PENDING').length}
            </div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid #10B981', padding: '18px' }}>
            <div style={{ fontSize: '0.8rem', color: '#687B74', fontWeight: '600' }}>CONFIRMED</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10B981' }}>
              {appointments.filter(a => a.status === 'CONFIRMED').length}
            </div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid #3B82F6', padding: '18px' }}>
            <div style={{ fontSize: '0.8rem', color: '#687B74', fontWeight: '600' }}>PRESCRIPTIONS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#3B82F6' }}>{prescriptions.length}</div>
          </div>
        </div>

        {/* TAB 1: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#145C4B' }}>My Appointments</h2>
                <p style={{ color: '#687B74', fontSize: '0.9rem' }}>Real-time schedule synchronized with doctor consultation queues</p>
              </div>
              <button onClick={() => setActiveTab('book')} className="btn btn-primary btn-sm">
                <PlusCircle size={16} /> Book New Appointment
              </button>
            </div>

            {appointments.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
                <Calendar size={48} color="#1B8067" style={{ margin: '0 auto 16px', opacity: 0.6 }} />
                <h3 style={{ fontSize: '1.2rem', color: '#145C4B', marginBottom: '6px' }}>No Appointments Scheduled</h3>
                <p style={{ color: '#687B74', marginBottom: '20px' }}>You do not have any past or upcoming appointments.</p>
                <button onClick={() => setActiveTab('book')} className="btn btn-primary">Book Your First Visit</button>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Specialist</th>
                      <th>Department</th>
                      <th>Date</th>
                      <th>Time Slot</th>
                      <th>Status</th>
                      <th>Reason</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(a => (
                      <tr key={a.id}>
                        <td><strong>#{a.id}</strong></td>
                        <td>
                          <div style={{ fontWeight: '600', color: '#193B34' }}>{a.doctorName}</div>
                          <div style={{ fontSize: '0.78rem', color: '#1B8067' }}>{a.doctorSpecialization}</div>
                        </td>
                        <td>{a.departmentName || 'General'}</td>
                        <td>{a.appointmentDate}</td>
                        <td>{a.appointmentTime}</td>
                        <td>{getStatusBadge(a.status)}</td>
                        <td style={{ maxWidth: '200px', fontSize: '0.85rem', color: '#687B74' }}>{a.reason || 'Routine Checkup'}</td>
                        <td>
                          {['PENDING', 'CONFIRMED'].includes(a.status) && (
                            <button
                              onClick={() => handleCancelAppointment(a.id)}
                              className="btn btn-outline btn-sm"
                              style={{ color: '#DE350B', borderColor: '#DE350B', padding: '4px 8px', fontSize: '0.75rem' }}
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BOOK APPOINTMENT */}
        {activeTab === 'book' && (
          <div style={{ maxWidth: '720px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#145C4B', marginBottom: '8px' }}>
              Book an Appointment
            </h2>
            <p style={{ color: '#687B74', fontSize: '0.9rem', marginBottom: '24px' }}>
              Select a certified doctor, preferred date, and available consultation time.
            </p>

            {bookingSuccess && (
              <div style={{ background: '#E6F4EA', color: '#137333', padding: '14px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} />
                <span>{bookingSuccess}</span>
              </div>
            )}

            {bookingError && (
              <div style={{ background: '#FCE8E6', color: '#C5221F', padding: '14px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <XCircle size={18} />
                <span>{bookingError}</span>
              </div>
            )}

            <div className="card">
              <form onSubmit={handleBookAppointment}>
                <div className="form-group">
                  <label className="form-label">Select Specialist *</label>
                  <select
                    className="form-control"
                    value={selectedDoctorId}
                    onChange={e => setSelectedDoctorId(e.target.value)}
                    required
                  >
                    {doctors.map(d => (
                      <option key={d.userId || d.id} value={d.userId || d.id}>
                        {d.fullName} — {d.specialization} ({d.departmentName}) | Fee: ₹{d.consultationFee}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Appointment Date *</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]} // Prevents past date selection!
                      className="form-control"
                      value={appointmentDate}
                      onChange={e => setAppointmentDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preferred Time Slot *</label>
                    <select
                      className="form-control"
                      value={appointmentTime}
                      onChange={e => setAppointmentTime(e.target.value)}
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:30 PM">03:30 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Reason for Visit / Symptoms</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Briefly describe what you would like to consult about..."
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Confirm &amp; Request Booking
                  </button>
                  <button type="button" onClick={() => setActiveTab('appointments')} className="btn btn-outline">
                    Back to Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: DOCTOR DISCOVERY */}
        {activeTab === 'doctors' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#145C4B' }}>Find Specialists</h2>
                <p style={{ color: '#687B74', fontSize: '0.9rem' }}>Browse approved medical doctors and their qualifications</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Search doctor or specialty..."
                  className="form-control"
                  style={{ width: '220px' }}
                  value={searchDoc}
                  onChange={e => setSearchDoc(e.target.value)}
                />
                <select
                  className="form-control"
                  style={{ width: '180px' }}
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                >
                  <option value="ALL">All Departments</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-3">
              {filteredDoctors.map((doc, idx) => (
                <div key={idx} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                      <div style={{
                        width: '50px', height: '50px', borderRadius: '50%',
                        background: '#1B8067', color: '#fff', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontWeight: '700'
                      }}>
                        {doc.fullName.replace('Dr. ', '').charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#193B34' }}>{doc.fullName}</div>
                        <div style={{ fontSize: '0.82rem', color: '#1B8067', fontWeight: '600' }}>{doc.specialization}</div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#687B74', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                      <div><strong>Department:</strong> {doc.departmentName || 'General'}</div>
                      <div><strong>Qualification:</strong> {doc.qualification}</div>
                      <div><strong>Experience:</strong> {doc.experienceYears} Years</div>
                      <div><strong>Consultation Fee:</strong> ₹{doc.consultationFee}</div>
                      <div><strong>Days:</strong> {doc.availableDays}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDoctorId(doc.userId || doc.id);
                      setActiveTab('book');
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                  >
                    Select &amp; Book
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PRESCRIPTIONS & RECORDS */}
        {activeTab === 'records' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#145C4B', marginBottom: '8px' }}>
              Medical Records &amp; Prescriptions
            </h2>
            <p style={{ color: '#687B74', fontSize: '0.9rem', marginBottom: '24px' }}>
              Official medical diagnoses and prescriptions issued by attending doctors
            </p>

            {prescriptions.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
                <FileText size={48} color="#1B8067" style={{ margin: '0 auto 16px', opacity: 0.6 }} />
                <h3 style={{ fontSize: '1.2rem', color: '#145C4B', marginBottom: '6px' }}>No Prescriptions Available</h3>
                <p style={{ color: '#687B74' }}>Prescriptions created by doctors during consultations will be stored here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {prescriptions.map(p => (
                  <div key={p.id} className="card" style={{ borderLeft: '4px solid #145C4B' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', borderBottom: '1px solid #E2ECE7', paddingBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#145C4B' }}>Prescription #{p.id}</div>
                        <div style={{ fontSize: '0.85rem', color: '#687B74' }}>
                          Attending Doctor: <strong>{p.doctorName}</strong> ({p.doctorSpecialization})
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#687B74' }}>
                        <div>Issued Date: <strong>{p.issuedDate}</strong></div>
                        <span className="badge badge-confirmed">Clinical Record</span>
                      </div>
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#193B34' }}>Diagnosis:</div>
                      <div style={{ fontSize: '0.95rem', color: '#145C4B', fontWeight: '600' }}>{p.diagnosis}</div>
                    </div>

                    {p.generalInstructions && (
                      <div style={{ marginBottom: '14px', fontSize: '0.88rem', color: '#687B74' }}>
                        <strong>Instructions:</strong> {p.generalInstructions}
                      </div>
                    )}

                    {p.items && p.items.length > 0 && (
                      <div style={{ background: '#F8FBF9', padding: '14px', borderRadius: '8px', border: '1px solid #E2ECE7' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#193B34', marginBottom: '8px' }}>Prescribed Medicines:</div>
                        <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #E2ECE7' }}>
                              <th style={{ padding: '6px' }}>Medicine</th>
                              <th style={{ padding: '6px' }}>Dosage</th>
                              <th style={{ padding: '6px' }}>Frequency</th>
                              <th style={{ padding: '6px' }}>Duration</th>
                              <th style={{ padding: '6px' }}>Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {p.items.map((it, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid #F0F4F2' }}>
                                <td style={{ padding: '6px', fontWeight: '600' }}>{it.medicineName}</td>
                                <td style={{ padding: '6px' }}>{it.dosage}</td>
                                <td style={{ padding: '6px' }}>{it.frequency}</td>
                                <td style={{ padding: '6px' }}>{it.duration}</td>
                                <td style={{ padding: '6px', color: '#687B74' }}>{it.instructions}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PROFILE */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: '640px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#145C4B', marginBottom: '8px' }}>
              Patient Information Profile
            </h2>
            <p style={{ color: '#687B74', fontSize: '0.9rem', marginBottom: '24px' }}>
              Your demographics and emergency contact information
            </p>

            <div className="card">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', fontSize: '0.9rem' }}>
                <div>
                  <div style={{ color: '#687B74', fontSize: '0.8rem' }}>FULL NAME</div>
                  <div style={{ fontWeight: '700', color: '#193B34' }}>{profile?.fullName || user?.fullName}</div>
                </div>
                <div>
                  <div style={{ color: '#687B74', fontSize: '0.8rem' }}>EMAIL ADDRESS</div>
                  <div style={{ fontWeight: '700', color: '#193B34' }}>{profile?.email || user?.email}</div>
                </div>
                <div>
                  <div style={{ color: '#687B74', fontSize: '0.8rem' }}>PHONE NUMBER</div>
                  <div style={{ fontWeight: '700', color: '#193B34' }}>{profile?.phone || user?.phone || '+91 98765 43210'}</div>
                </div>
                <div>
                  <div style={{ color: '#687B74', fontSize: '0.8rem' }}>GENDER</div>
                  <div style={{ fontWeight: '700', color: '#193B34' }}>{profile?.gender || 'Male'}</div>
                </div>
                <div>
                  <div style={{ color: '#687B74', fontSize: '0.8rem' }}>BLOOD GROUP</div>
                  <div style={{ fontWeight: '700', color: '#193B34' }}>{profile?.bloodGroup || 'O+'}</div>
                </div>
                <div>
                  <div style={{ color: '#687B74', fontSize: '0.8rem' }}>DATE OF BIRTH</div>
                  <div style={{ fontWeight: '700', color: '#193B34' }}>{profile?.dateOfBirth || '1992-05-14'}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ color: '#687B74', fontSize: '0.8rem' }}>RESIDENTIAL ADDRESS</div>
                  <div style={{ fontWeight: '600', color: '#193B34' }}>{profile?.address || '42 Marine Drive, Mumbai'}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
