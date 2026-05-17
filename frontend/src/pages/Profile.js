import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { userApi, notificationApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Bell, BellOff, Save } from 'lucide-react';
import { format } from 'date-fns';
import './Profile.css';

export default function Profile() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState({ name: '', department: '', year: '' });
  const [notifications, setNotifications] = useState([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    userApi.getMe().then(res => setProfile({
      name: res.data.name || '',
      department: res.data.department || '',
      year: res.data.year || ''
    }));
    notificationApi.getAll().then(res => setNotifications(res.data));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await userApi.updateProfile(profile);
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const markAllRead = async () => {
    await notificationApi.markAllRead();
    setNotifications(n => n.map(x => ({ ...x, read: true })));
    toast.info('All notifications marked as read');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="profile-page">
      <div className="page-header">
        <h2>Profile & Notifications</h2>
      </div>

      <div className="profile-grid">
        {/* Profile Card */}
        <div className="profile-card card">
          <div className="profile-avatar-big">
            {authUser?.name?.[0]?.toUpperCase()}
          </div>
          <h3>{authUser?.name}</h3>
          <span className={`badge badge-technical`} style={{ margin: '4px auto' }}>{authUser?.role}</span>
          <p className="profile-email">{authUser?.email}</p>

          <div className="profile-fields">
            <div className="field">
              <label>Full Name</label>
              <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} disabled={!editing} />
            </div>
            <div className="field">
              <label>Department</label>
              <input value={profile.department} onChange={e => setProfile(p => ({ ...p, department: e.target.value }))} disabled={!editing} placeholder="e.g. Computer Science" />
            </div>
            <div className="field">
              <label>Year</label>
              {editing ? (
                <select value={profile.year} onChange={e => setProfile(p => ({ ...p, year: e.target.value }))}>
                  <option value="">Select Year</option>
                  <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                </select>
              ) : (
                <input value={profile.year} disabled />
              )}
            </div>
          </div>

          {editing ? (
            <div className="profile-actions">
              <button className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                <Save size={14} />{saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          ) : (
            <button className="btn-secondary edit-btn" onClick={() => setEditing(true)}>
              <User size={14} /> Edit Profile
            </button>
          )}
        </div>

        {/* Notifications Card */}
        <div className="notif-card card">
          <div className="notif-header">
            <div>
              <h3>Notifications</h3>
              {unreadCount > 0 && <span className="unread-count">{unreadCount} unread</span>}
            </div>
            {unreadCount > 0 && (
              <button className="btn-link" onClick={markAllRead}>
                <BellOff size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="empty-state">
                <Bell size={32} style={{ opacity: 0.3, margin: '0 auto 8px', display: 'block' }} />
                No notifications yet
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className={`notif-item ${n.read ? '' : 'unread'}`}>
                  <div className="notif-dot" />
                  <div className="notif-content">
                    <p className="notif-title">{n.title}</p>
                    <p className="notif-msg">{n.message}</p>
                    <p className="notif-time">{format(new Date(n.createdAt), 'MMM d · h:mm a')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
