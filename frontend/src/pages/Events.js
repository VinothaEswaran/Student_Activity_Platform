import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventApi } from '../services/api';
import { Search, Filter, MapPin, Users, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import './Events.css';

const CATEGORIES = ['ALL', 'TECHNICAL', 'CULTURAL', 'SPORTS', 'WORKSHOP', 'SEMINAR', 'HACKATHON', 'OTHER'];

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventApi.getAll().then(res => {
      setEvents(res.data);
      setFiltered(res.data);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let list = [...events];
    if (category !== 'ALL') list = list.filter(e => e.category === category);
    if (search.trim()) list = list.filter(e =>
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.description?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(list);
  }, [search, category, events]);

  if (loading) return <div className="loading-state">Loading events...</div>;

  return (
    <div className="events-page">
      <div className="page-header">
        <div>
          <h2>Campus Events</h2>
          <p>{events.length} events available</p>
        </div>
      </div>

      <div className="events-toolbar">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input
            placeholder="Search events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="category-filters">
          <Filter size={14} />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state" style={{ marginTop: 40 }}>No events found.</div>
      ) : (
        <div className="events-grid">
          {filtered.map(event => (
            <div key={event.id} className="event-card" onClick={() => navigate(`/events/${event.id}`)}>
              <div className="event-card-header">
                <div className="event-card-badges">
                  <span className={`badge badge-${event.category?.toLowerCase()}`}>{event.category}</span>
                  <span className={`badge badge-${event.status?.toLowerCase()}`}>{event.status}</span>
                </div>
                {event.isRegistered && <span className="registered-tag">✓ Registered</span>}
              </div>
              <h3 className="event-card-title">{event.title}</h3>
              <p className="event-card-desc">{event.description?.slice(0, 100)}{event.description?.length > 100 ? '...' : ''}</p>
              <div className="event-card-footer">
                <div className="event-info-row">
                  <Clock size={13} />
                  <span>{event.eventDate ? format(new Date(event.eventDate), 'MMM d, yyyy') : 'TBD'}</span>
                </div>
                {event.venue && (
                  <div className="event-info-row">
                    <MapPin size={13} />
                    <span>{event.venue}</span>
                  </div>
                )}
                <div className="event-info-row">
                  <Users size={13} />
                  <span>{event.registeredCount} / {event.maxParticipants || '∞'} registered</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
