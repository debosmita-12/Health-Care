import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, User, LogOut, Menu, X, Shield, Stethoscope } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ROLE_ADMIN') return '/admin/dashboard';
    if (user.role === 'ROLE_DOCTOR') return '/doctor/dashboard';
    return '/patient/dashboard';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #145C4B 0%, #1B8067 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <HeartPulse size={24} />
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.25rem', color: '#145C4B', letterSpacing: '-0.5px' }}>
              HEALTH <span style={{ color: '#1B8067' }}>&amp; CARE</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#687B74', fontWeight: '600', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              Management System
            </div>
          </div>
        </Link>

        {/* Public Desktop Nav Links */}
        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <a href="#services" className="nav-link">Services</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#doctors" className="nav-link">Doctors</a>
          <a href="#contact" className="nav-link">Contact</a>
          <a href="#developers" className="nav-link">Developers</a>
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to={getDashboardPath()} className="btn btn-primary btn-sm">
                <User size={16} /> My Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Logout">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} color="#145C4B" /> : <Menu size={24} color="#145C4B" />}
          </button>
        </div>
      </div>
    </header>
  );
}
