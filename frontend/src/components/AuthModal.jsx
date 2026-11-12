import React, { useState } from 'react';
import { X, Lock, Mail, User, MapPin, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // login | register
  const [form, setForm] = useState({ name: '', email: '', password: '', area: 'Bangalore North' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = mode === 'login'
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password, community_area: form.area };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || 'Authentication failed. Please verify credentials.');
        setLoading(false);
        return;
      }

      localStorage.setItem('cream_token', data.access_token);
      onAuthSuccess(data.access_token, data.user);
      onClose();
    } catch (err) {
      setError('Network communication error with server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(11, 37, 69, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 100
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        maxWidth: '420px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(11, 37, 69, 0.25)',
        overflow: 'hidden',
        border: '1px solid #E2E8F0'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#0B2545',
          color: '#FFFFFF',
          padding: '24px',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            <X size={18} />
          </button>
          <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700 }}>
            {mode === 'login' ? 'Welcome Back' : 'Create Community Account'}
          </h3>
          <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: '#94A3B8' }}>
            {mode === 'login'
              ? 'Sign in to access your personal checklists & clean energy pledges.'
              : 'Join fellow residents in accelerating decentralized clean energy adoption.'}
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: '24px' }}>
          {error && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Kumar"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                <input
                  type="email"
                  required
                  placeholder="name@community.org"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Community Ward / Area
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ward 45 - Malleshwaram"
                    value={form.area}
                    onChange={e => setForm({ ...form, area: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary hover-lift"
              style={{ width: '100%', padding: '12px', marginTop: '8px' }}
            >
              <span>{loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Complete Registration'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Toggle mode */}
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.88rem', color: '#64748B' }}>
            {mode === 'login' ? (
              <span>
                New resident?{' '}
                <button
                  onClick={() => { setMode('register'); setError(''); }}
                  style={{ border: 'none', background: 'transparent', color: '#059669', fontWeight: 700, padding: 0 }}
                >
                  Create an account
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  onClick={() => { setMode('login'); setError(''); }}
                  style={{ border: 'none', background: 'transparent', color: '#059669', fontWeight: 700, padding: 0 }}
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

