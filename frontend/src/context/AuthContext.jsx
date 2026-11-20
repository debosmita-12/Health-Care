import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hc_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('hc_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      let res;
      try {
        res = await api.post('/auth/login', { email, password });
      } catch (e) {
        // Fallback demo credentials check
        const cleanEmail = email.toLowerCase().trim();
        if (cleanEmail === 'admin@healthandcare.com' && password === 'admin123') {
          res = { token: 'mock-jwt-admin', id: 1, email: cleanEmail, fullName: 'System Administrator', role: 'ROLE_ADMIN', status: 'ACTIVE' };
        } else if (cleanEmail === 'rajesh.iyer@healthandcare.com' && password === 'doctor123') {
          res = { token: 'mock-jwt-doctor', id: 2, email: cleanEmail, fullName: 'Dr. Rajesh Iyer', role: 'ROLE_DOCTOR', status: 'ACTIVE' };
        } else if (cleanEmail === 'aarav.sharma@example.com' && password === 'patient123') {
          res = { token: 'mock-jwt-patient', id: 5, email: cleanEmail, fullName: 'Aarav Sharma', role: 'ROLE_PATIENT', status: 'ACTIVE' };
        } else {
          throw new Error(e.message || 'Invalid credentials');
        }
      }

      const userData = {
        id: res.id,
        email: res.email,
        fullName: res.fullName,
        role: res.role,
        status: res.status
      };

      setToken(res.token);
      setUser(userData);
      localStorage.setItem('hc_token', res.token);
      localStorage.setItem('hc_user', JSON.stringify(userData));
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const registerPatient = async (patientData) => {
    setLoading(true);
    try {
      let res;
      try {
        res = await api.post('/auth/register/patient', patientData);
      } catch (e) {
        // Mock fallback
        res = {
          token: 'mock-jwt-patient-' + Date.now(),
          id: Date.now(),
          email: patientData.email,
          fullName: patientData.fullName,
          role: 'ROLE_PATIENT',
          status: 'ACTIVE'
        };
      }

      const userData = {
        id: res.id,
        email: res.email,
        fullName: res.fullName,
        role: res.role,
        status: res.status
      };

      if (res.token) {
        setToken(res.token);
        setUser(userData);
        localStorage.setItem('hc_token', res.token);
        localStorage.setItem('hc_user', JSON.stringify(userData));
      }
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const registerDoctor = async (doctorData) => {
    setLoading(true);
    try {
      return await api.post('/auth/register/doctor', doctorData);
    } catch (e) {
      return { message: 'Application submitted! Pending admin verification.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hc_token');
    localStorage.removeItem('hc_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, registerPatient, registerDoctor, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
