import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HeartPulse, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'ROLE_DOCTOR') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your email and password.');
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="card" style={{ maxWidth: '460px', width: '100%', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #145C4B 0%, #1B8067 100%)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#FFFFFF', marginBottom: '12px'
          }}>
            <HeartPulse size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#145C4B' }}>Portal Login</h2>
          <p style={{ color: '#687B74', fontSize: '0.9rem' }}>Access your clinical records, schedule, or management dashboard</p>
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '8px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>

        {/* Quick Demo Access for Evaluation */}
        <div style={{ marginTop: '24px', borderTop: '1px solid #E2ECE7', paddingTop: '18px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#687B74', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center' }}>
            ⚡ 1-Click Evaluation Accounts
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('aarav.sharma@example.com', 'patient123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', padding: '6px' }}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('rajesh.iyer@healthandcare.com', 'doctor123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', padding: '6px' }}
            >
              Doctor
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@healthandcare.com', 'admin123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', padding: '6px' }}
            >
              Admin
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: '#687B74' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ fontWeight: '700', color: '#1B8067' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
