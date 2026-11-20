import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';

import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import PatientDashboard from '../pages/patient/PatientDashboard';
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';

export default function AppRoutes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Role-Protected Portals */}
          <Route
            path="/patient/*"
            element={
              <ProtectedRoute allowedRoles={['ROLE_PATIENT', 'ROLE_ADMIN']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/*"
            element={
              <ProtectedRoute allowedRoles={['ROLE_DOCTOR', 'ROLE_ADMIN']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
