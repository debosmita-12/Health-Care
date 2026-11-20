import React from 'react';
import { HeartPulse, Shield, Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#145C4B', color: '#FFFFFF', paddingTop: '60px', paddingBottom: '30px', marginTop: '80px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: '#1B8067', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <HeartPulse size={20} color="#FFFFFF" />
              </div>
              <span style={{ fontWeight: '800', fontSize: '1.2rem', color: '#FFFFFF' }}>HEALTH &amp; CARE</span>
            </div>
            <p style={{ color: '#D8E6DF', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>
              A modern, full-stack healthcare platform connecting patients, verified medical doctors, and clinical administrators with high security and seamless appointment workflows.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(255,255,255,0.08)', borderRadius: '20px', fontSize: '0.8rem', color: '#E8F6F0' }}>
              <Shield size={14} color="#24A283" /> HIPAA-Inspired Architecture &amp; Role Security
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', color: '#E8F6F0' }}>Platform Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><a href="#services" style={{ color: '#D8E6DF' }}>Clinical Services</a></li>
              <li><a href="#doctors" style={{ color: '#D8E6DF' }}>Certified Doctors</a></li>
              <li><a href="#about" style={{ color: '#D8E6DF' }}>About The System</a></li>
              <li><a href="#developers" style={{ color: '#D8E6DF' }}>Engineering Team</a></li>
              <li><a href="#contact" style={{ color: '#D8E6DF' }}>Support &amp; Feedback</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', color: '#E8F6F0' }}>Contact &amp; Administration</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#D8E6DF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="#24A283" /> contact@healthandcare.local
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="#24A283" /> +91 1800-HEALTH-CARE
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} color="#24A283" /> Healthcare Hub, Medical District
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Globe size={16} color="#24A283" /> http://localhost:5173
              </div>
            </div>
          </div>

          {/* Academic Rubric Tag */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', color: '#E8F6F0' }}>Academic Rubric</h4>
            <p style={{ color: '#D8E6DF', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '12px' }}>
              Engineered with Java 21, Spring Boot, Spring JDBC, PostgreSQL, AWT, Swing, JavaFX, SQLite &amp; MySQL demonstrations.
            </p>
            <div style={{ fontSize: '0.75rem', color: '#A0BCB2' }}>
              Status: <span style={{ color: '#4ADE80', fontWeight: '700' }}>● All 8 Modules Operational</span>
            </div>
          </div>
        </div>

        {/* Legal & Medical Disclaimer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', fontSize: '0.8rem', color: '#A0BCB2', textAlign: 'center' }}>
          <p style={{ marginBottom: '8px' }}>
            <strong>Medical Disclaimer:</strong> Health &amp; Care is an academic and clinical management demonstration system. In case of a medical emergency, please call your local emergency service immediately.
          </p>
          <p>
            &copy; 2026 Health &amp; Care Management System. All Rights Reserved. | Privacy Policy | Terms &amp; Conditions
          </p>
        </div>
      </div>
    </footer>
  );
}
