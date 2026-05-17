import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, Star, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import { format } from 'date-fns';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([eventApi.getAll(), eventApi.getMyRegistrations()])
      .then(([allRes, myRes]) => {
        setEvents(allRes.data);
        setMyEvents(myRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const upcoming = events.filter(e => e.status === 'UPCOMING').slice(0, 3);
  const stats = [
    { label: 'Total Events', value: events.length, icon: <Calendar size={20} />, color: '#6366f1' },
    { label: 'My Registrations', value: myEvents.length, icon: <Star size={20} />, color: '#10b981' },
    { label: 'Upcoming', value: events.filter(e => e.status === 'UPCOMING').length, icon: <TrendingUp size={20} />, color: '#f59e0b' },
    { label: 'Total Participants', value: events.reduce((a, e) => a + (e.registeredCount || 0), 0), icon: <Users size={20} />, color: '#8b5cf6' },
  ];

  if (loading) return <div className="loading-state">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h2>Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
          <p>Here's what's happening on campus today.</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="dash-section">
          <div className="section-header">
            <h3>Upcoming Events</h3>
            <button className="btn-link" onClick={() => navigate('/events')}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          {upcoming.length === 0 ? (
            <div className="empty-state">No upcoming events</div>
          ) : (
            <div className="event-list">
              {upcoming.map(event => (
                <div key={event.id} className="event-item" onClick={() => navigate(`/events/${event.id}`)}>
                  <div className="event-item-left">
                    <div className={`badge badge-${event.category?.toLowerCase()}`}>
                      {event.category}
                    </div>
                    <h4>{event.title}</h4>
                    <div className="event-meta">
                      <Clock size={12} />
                      <span>{event.eventDate ? format(new Date(event.eventDate), 'MMM d, yyyy · h:mm a') : 'TBD'}</span>
                    </div>
                  </div>
                  <div className="event-item-right">
                    <span className="participants">{event.registeredCount}/{event.maxParticipants || '∞'}</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dash-section">
          <div className="section-header">
            <h3>My Registrations</h3>
            <button className="btn-link" onClick={() => navigate('/my-activities')}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          {myEvents.length === 0 ? (
            <div className="empty-state">
              <p>No registrations yet.</p>
              <button className="btn-primary" style={{ marginTop: 12 }} onClick={() => navigate('/events')}>
                Browse Events
              </button>
            </div>
          ) : (
            <div className="event-list">
              {myEvents.slice(0, 3).map(event => (
                <div key={event.id} className="event-item" onClick={() => navigate(`/events/${event.id}`)}>
                  <div className="event-item-left">
                    <div className={`badge badge-${event.status?.toLowerCase()}`}>{event.status}</div>
                    <h4>{event.title}</h4>
                    <div className="event-meta">
                      <Clock size={12} />
                      <span>{event.eventDate ? format(new Date(event.eventDate), 'MMM d, yyyy') : 'TBD'}</span>
                    </div>
                  </div>
                  <ArrowRight size={14} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
