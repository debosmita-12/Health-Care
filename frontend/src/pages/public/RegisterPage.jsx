import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HeartPulse, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [role, setRole] = useState('PATIENT'); // PATIENT, DOCTOR, ADMIN
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Patient fields
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    // Doctor fields
    qualification: '',
    specialization: 'General Medicine',
    experienceYears: 1,
    medicalRegistrationNo: '',
    // Admin field
    adminInviteCode: ''
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { registerPatient, registerDoctor, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (role === 'ADMIN') {
      if (formData.adminInviteCode !== 'HEALTH_ADMIN_2026') {
        setError('Unauthorized Admin Provisioning: Invalid administrative invitation code.');
        return;
      }
      setSuccessMsg('Admin provisioning authorization verified. Use primary admin credentials to login.');
      return;
    }

    try {
      if (role === 'PATIENT') {
        await registerPatient({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          address: formData.address
        });
        navigate('/patient/dashboard');
      } else if (role === 'DOCTOR') {
        const res = await registerDoctor({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          qualification: formData.qualification,
          specialization: formData.specialization,
          experienceYears: parseInt(formData.experienceYears, 10),
          medicalRegistrationNo: formData.medicalRegistrationNo
        });
        setSuccessMsg(res.message || 'Doctor application submitted! Awaiting administrator approval before clinical login is active.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please verify your details.');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #145C4B 0%, #1B8067 100%)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#FFFFFF', marginBottom: '12px'
          }}>
            <HeartPulse size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#145C4B' }}>Create Your Account</h2>
          <p style={{ color: '#687B74', fontSize: '0.9rem' }}>Join the Health &amp; Care network</p>
        </div>

        {error && (
          <div style={{
            background: '#FCE8E6', color: '#C5221F', padding: '12px 14px',
            borderRadius: '8px', fontSize: '0.88rem', display: 'flex', alignItems: 'center',
            gap: '10px', marginBottom: '20px'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            background: '#E6F4EA', color: '#137333', padding: '12px 14px',
            borderRadius: '8px', fontSize: '0.88rem', display: 'flex', alignItems: 'center',
            gap: '10px', marginBottom: '20px'
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Account Role Dropdown */}
          <div className="form-group">
            <label className="form-label">I Am Registering As: *</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="form-control"
              style={{ fontWeight: '600', color: '#145C4B' }}
            >
              <option value="PATIENT">Patient (Book Appointments &amp; Access Records)</option>
              <option value="DOCTOR">Doctor (Medical Practitioner — Requires Verification)</option>
              <option value="ADMIN">Administrator (Protected Provisioning)</option>
            </select>
          </div>

          {/* Common Fields */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                name="fullName"
                className="form-control"
                placeholder={role === 'DOCTOR' ? 'Dr. First Last' : 'First Last'}
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                required
                name="email"
                className="form-control"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                required
                name="phone"
                className="form-control"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                required
                name="password"
                className="form-control"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password *</label>
            <input
              type="password"
              required
              name="confirmPassword"
              className="form-control"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {/* Dynamic Patient Fields */}
          {role === 'PATIENT' && (
            <>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="form-control"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Residential Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  placeholder="Street, City, Postal Code"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {/* Dynamic Doctor Fields */}
          {role === 'DOCTOR' && (
            <>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Medical Qualification *</label>
                  <input
                    type="text"
                    required
                    name="qualification"
                    className="form-control"
                    placeholder="e.g. MBBS, MD (Cardiology)"
                    value={formData.qualification}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Specialization *</label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dental & Maxillofacial">Dental &amp; Maxillofacial</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Neurology">Neurology</option>
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Experience (Years) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    name="experienceYears"
                    className="form-control"
                    value={formData.experienceYears}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Medical Registration No. *</label>
                  <input
                    type="text"
                    required
                    name="medicalRegistrationNo"
                    className="form-control"
                    placeholder="MCI / State Council Reg #"
                    value={formData.medicalRegistrationNo}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#B76E00', background: '#FFF4E5', padding: '10px', borderRadius: '6px', marginBottom: '16px' }}>
                Note: Doctor accounts require administrative review and verification before clinical access is granted.
              </p>
            </>
          )}

          {/* Dynamic Admin Fields */}
          {role === 'ADMIN' && (
            <div className="form-group">
              <label className="form-label">Administrative Invitation Code *</label>
              <input
                type="password"
                required
                name="adminInviteCode"
                className="form-control"
                placeholder="Enter authorized admin key (Demo: HEALTH_ADMIN_2026)"
                value={formData.adminInviteCode}
                onChange={handleChange}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '10px' }}
          >
            {loading ? 'Processing Registration...' : (role === 'DOCTOR' ? 'Submit Doctor Application' : 'Complete Registration')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: '#687B74' }}>
          Already registered?{' '}
          <Link to="/login" style={{ fontWeight: '700', color: '#1B8067' }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
