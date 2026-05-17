import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, User, Mail, Lock, UserPlus } from 'lucide-react';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', username: '', email: '', password: '',
    department: '', year: '', role: 'STUDENT'
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb orb1" />
        <div className="auth-orb orb2" />
      </div>
      <div className="auth-card wide">
        <div className="auth-logo">
          <GraduationCap size={32} />
          <h1>StudentHub</h1>
        </div>
        <p className="auth-subtitle">Create your account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grid">
            <div className="field">
              <label>Full Name</label>
              <div className="input-wrap">
                <User size={16} className="input-icon" />
                <input placeholder="John Doe" value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
            </div>
            <div className="field">
              <label>Username</label>
              <div className="input-wrap">
                <User size={16} className="input-icon" />
                <input placeholder="johndoe" value={form.username} onChange={e => set('username', e.target.value)} required />
              </div>
            </div>
          </div>

          <div className="field">
            <label>Email</label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input type="email" placeholder="you@college.edu" value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>
          </div>

          <div className="field">
            <label>Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => set('password', e.target.value)} required />
            </div>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Department</label>
              <input placeholder="e.g. Computer Science" value={form.department} onChange={e => set('department', e.target.value)} />
            </div>
            <div className="field">
              <label>Year</label>
              <select value={form.year} onChange={e => set('year', e.target.value)}>
                <option value="">Select Year</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Role</label>
            <select value={form.role} onChange={e => set('role', e.target.value)}>
              <option value="STUDENT">Student</option>
              <option value="ORGANIZER">Event Organizer</option>
            </select>
          </div>

          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            <UserPlus size={16} />
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
