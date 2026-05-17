import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventApi } from '../services/api';
import { Star, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import './Events.css';

export default function MyActivities() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventApi.getMyRegistrations().then(res => setEvents(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <div className="events-page">
      <div className="page-header">
        <div>
          <h2>My Activities</h2>
          <p>Events you've registered for ({events.length})</p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="empty-state" style={{ marginTop: 60, textAlign: 'center' }}>
          <Star size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <p>You haven't registered for any events yet.</p>
          <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/events')}>
            Browse Events
          </button>
        </div>
      ) : (
        <div className="events-grid">
          {events.map(event => (
            <div key={event.id} className="event-card" onClick={() => navigate(`/events/${event.id}`)}>
              <div className="event-card-header">
                <div className="event-card-badges">
                  <span className={`badge badge-${event.category?.toLowerCase()}`}>{event.category}</span>
                  <span className={`badge badge-${event.status?.toLowerCase()}`}>{event.status}</span>
                </div>
                <span className="registered-tag">✓ Registered</span>
              </div>
              <h3 className="event-card-title">{event.title}</h3>
              <p className="event-card-desc">{event.description?.slice(0, 80)}...</p>
              <div className="event-card-footer">
                <div className="event-info-row">
                  <Calendar size={13} />
                  <span>{event.eventDate ? format(new Date(event.eventDate), 'MMM d, yyyy') : 'TBD'}</span>
                </div>
                {event.venue && (
                  <div className="event-info-row">
                    <MapPin size={13} />
                    <span>{event.venue}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
