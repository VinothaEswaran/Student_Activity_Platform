import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Calendar, MapPin, Users, Clock, ArrowLeft, UserCheck, UserX, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import './EventDetail.css';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isOrganizer } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    eventApi.getById(id).then(res => setEvent(res.data)).finally(() => setLoading(false));
  }, [id]);

  const handleRegister = async () => {
    setActionLoading(true);
    try {
      await eventApi.register(id);
      toast.success('Successfully registered!');
      const res = await eventApi.getById(id);
      setEvent(res.data);
    } catch (err) {
      toast.error(err.response?.data || 'Registration failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnregister = async () => {
    setActionLoading(true);
    try {
      await eventApi.unregister(id);
      toast.info('Unregistered from event');
      const res = await eventApi.getById(id);
      setEvent(res.data);
    } catch (err) {
      toast.error('Failed to unregister');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await eventApi.delete(id);
      toast.success('Event deleted');
      navigate('/events');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="loading-state">Loading event...</div>;
  if (!event) return <div className="loading-state">Event not found</div>;

  const isFull = event.maxParticipants > 0 && event.registeredCount >= event.maxParticipants;

  return (
    <div className="event-detail">
      <button className="back-btn" onClick={() => navigate('/events')}>
        <ArrowLeft size={16} /> Back to Events
      </button>

      <div className="detail-card">
        <div className="detail-header">
          <div className="detail-badges">
            <span className={`badge badge-${event.category?.toLowerCase()}`}>{event.category}</span>
            <span className={`badge badge-${event.status?.toLowerCase()}`}>{event.status}</span>
            {event.isRegistered && <span className="badge" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>✓ Registered</span>}
          </div>
          {isOrganizer() && (
            <div className="organizer-actions">
              <button className="btn-danger" onClick={handleDelete}><Trash2 size={14} /> Delete</button>
            </div>
          )}
        </div>

        <h1 className="detail-title">{event.title}</h1>
        {event.organizer && <p className="detail-organizer">Organized by <strong>{event.organizer}</strong></p>}

        <div className="detail-info-grid">
          <div className="info-block">
            <Calendar size={16} />
            <div>
              <p className="info-label">Date & Time</p>
              <p className="info-value">{event.eventDate ? format(new Date(event.eventDate), 'EEEE, MMMM d yyyy · h:mm a') : 'TBD'}</p>
            </div>
          </div>
          {event.venue && (
            <div className="info-block">
              <MapPin size={16} />
              <div>
                <p className="info-label">Venue</p>
                <p className="info-value">{event.venue}</p>
              </div>
            </div>
          )}
          <div className="info-block">
            <Users size={16} />
            <div>
              <p className="info-label">Participants</p>
              <p className="info-value">{event.registeredCount} / {event.maxParticipants || 'Unlimited'}</p>
            </div>
          </div>
          {event.registrationDeadline && (
            <div className="info-block">
              <Clock size={16} />
              <div>
                <p className="info-label">Registration Deadline</p>
                <p className="info-value">{format(new Date(event.registrationDeadline), 'MMM d, yyyy · h:mm a')}</p>
              </div>
            </div>
          )}
        </div>

        {event.description && (
          <div className="detail-desc">
            <h3>About this Event</h3>
            <p>{event.description}</p>
          </div>
        )}

        {event.maxParticipants > 0 && (
          <div className="capacity-bar-wrap">
            <div className="capacity-bar-header">
              <span>Capacity</span>
              <span>{event.registeredCount}/{event.maxParticipants}</span>
            </div>
            <div className="capacity-bar">
              <div
                className="capacity-fill"
                style={{ width: `${Math.min((event.registeredCount / event.maxParticipants) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {event.status === 'UPCOMING' && (
          <div className="detail-action">
            {event.isRegistered ? (
              <button className="btn-danger reg-btn" onClick={handleUnregister} disabled={actionLoading}>
                <UserX size={16} /> {actionLoading ? 'Processing...' : 'Unregister'}
              </button>
            ) : (
              <button
                className="btn-primary reg-btn"
                onClick={handleRegister}
                disabled={actionLoading || isFull}
              >
                <UserCheck size={16} />
                {actionLoading ? 'Processing...' : isFull ? 'Event Full' : 'Register Now'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
