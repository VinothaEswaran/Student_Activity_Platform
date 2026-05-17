import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventApi } from '../services/api';
import { toast } from 'react-toastify';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import './CreateEvent.css';

const CATEGORIES = ['TECHNICAL', 'CULTURAL', 'SPORTS', 'WORKSHOP', 'SEMINAR', 'HACKATHON', 'OTHER'];

export default function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', venue: '', eventDate: '',
    registrationDeadline: '', category: 'TECHNICAL',
    maxParticipants: '', organizer: '', imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants) : 0,
        eventDate: form.eventDate ? new Date(form.eventDate).toISOString() : null,
        registrationDeadline: form.registrationDeadline ? new Date(form.registrationDeadline).toISOString() : null,
      };
      const res = await eventApi.create(payload);
      toast.success('Event created successfully!');
      navigate(`/events/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-page">
      <button className="back-btn" onClick={() => navigate('/events')}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="create-card">
        <h2>Create New Event</h2>
        <p className="subtitle">Fill in the details to publish a campus event</p>

        <form onSubmit={handleSubmit} className="create-form">
          <div className="field">
            <label>Event Title *</label>
            <input placeholder="e.g. National Level Hackathon 2025" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>

          <div className="field">
            <label>Description</label>
            <textarea rows={4} placeholder="Describe the event..." value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Venue</label>
              <input placeholder="e.g. Main Auditorium" value={form.venue} onChange={e => set('venue', e.target.value)} />
            </div>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Event Date & Time *</label>
              <input type="datetime-local" value={form.eventDate} onChange={e => set('eventDate', e.target.value)} required />
            </div>
            <div className="field">
              <label>Registration Deadline</label>
              <input type="datetime-local" value={form.registrationDeadline} onChange={e => set('registrationDeadline', e.target.value)} />
            </div>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Max Participants (0 = unlimited)</label>
              <input type="number" min="0" placeholder="0" value={form.maxParticipants} onChange={e => set('maxParticipants', e.target.value)} />
            </div>
            <div className="field">
              <label>Organizer Name</label>
              <input placeholder="e.g. CSE Department" value={form.organizer} onChange={e => set('organizer', e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label>Banner Image URL (optional)</label>
            <input placeholder="https://..." value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/events')}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <PlusCircle size={16} />
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
