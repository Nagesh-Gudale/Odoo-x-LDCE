import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Plus, Trash2, Share2, DollarSign, Clock, CheckCircle2, X 
} from 'lucide-react';
import { useTrip } from '../context/useTrip';
import type { Trip, ItineraryItem, DestinationStop } from '../data/tripData';
import { activitiesData } from '../data/activitiesData';
import '../styles/Modules.css';

export const BuildItinerary: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { trips, itineraryItems, addItineraryItem, deleteItineraryItem } = useTrip();

  const currentTrip = trips.find((t: Trip) => t.id === id) || trips[0];
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New activity modal state
  const [actTitle, setActTitle] = useState('');
  const [actTime, setActTime] = useState('10:00');
  const [actDuration, setActDuration] = useState(2);
  const [actCost, setActCost] = useState(3500);
  const [actCategory, setActCategory] = useState('Activities');
  const [actNotes, setActNotes] = useState('');

  const currentTripItems = itineraryItems.filter((item: ItineraryItem) => item.tripId === currentTrip.id);
  const dayItems = currentTripItems
    .filter((item: ItineraryItem) => item.dayNumber === selectedDay)
    .sort((a: ItineraryItem, b: ItineraryItem) => a.time.localeCompare(b.time));

  const totalTripDays = Math.max(
    1,
    Math.ceil(
      (new Date(currentTrip.endDate).getTime() - new Date(currentTrip.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1
  );

  const handleAddActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle.trim()) return;

    addItineraryItem({
      tripId: currentTrip.id,
      dayNumber: selectedDay,
      date: currentTrip.startDate,
      time: actTime,
      title: actTitle.trim(),
      destination: currentTrip.destinations[0]?.city || 'Destination',
      duration: Number(actDuration),
      cost: Number(actCost),
      category: actCategory,
      notes: actNotes,
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80',
    });

    setActTitle('');
    setActNotes('');
    setIsAddModalOpen(false);
  };

  const handlePickPresetActivity = (title: string, category: string, price: number) => {
    setActTitle(title);
    setActCategory(category);
    setActCost(price);
  };

  return (
    <div className="module-page-container">
      <div className="container">
        {/* Header Card */}
        <div className="itinerary-header-card" style={{ marginTop: '2.5rem' }}>
          <div className="itinerary-top-row">
            <div>
              <span className="module-eyebrow">
                <Calendar size={16} /> Interactive Itinerary Builder
              </span>
              <h1 className="module-title">{currentTrip.name}</h1>
              <p className="module-subtitle">
                {currentTrip.startDate} to {currentTrip.endDate} • {currentTrip.travelers} Travelers
              </p>
            </div>

            <div className="itinerary-actions-group">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Trip link copied to clipboard!');
                }}
                className="btn-outline-cta"
              >
                <Share2 size={16} /> Share
              </button>
              <Link to={`/trips/${currentTrip.id}/budget`} className="btn-gradient-cta">
                <DollarSign size={16} /> Budget Tracker
              </Link>
            </div>
          </div>

          {/* Route Horizontal Bar */}
          <div className="route-visual-bar">
            <span className="form-label" style={{ marginRight: '0.5rem' }}>Route:</span>
            {currentTrip.destinations.map((d: DestinationStop, index: number) => (
              <React.Fragment key={d.id}>
                <span className="route-stop-pill">
                  <MapPin size={14} /> {d.city} ({d.days}d)
                </span>
                {index < currentTrip.destinations.length - 1 && <span className="route-arrow">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Day Tabs Scroll */}
        <div className="day-tabs-scroll">
          {Array.from({ length: totalTripDays }).map((_, index: number) => {
            const dayNum = index + 1;
            const count = currentTripItems.filter((i: ItineraryItem) => i.dayNumber === dayNum).length;

            return (
              <button
                key={dayNum}
                className={`day-tab-btn ${selectedDay === dayNum ? 'active' : ''}`}
                onClick={() => setSelectedDay(dayNum)}
              >
                <span className="tab-day-title">Day {dayNum}</span>
                <span className="tab-day-sub">{count} Activities</span>
              </button>
            );
          })}
        </div>

        {/* Timeline Header & Add Action */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800 }}>
            Day {selectedDay} Timeline
          </h2>
          <button onClick={() => setIsAddModalOpen(true)} className="btn-gradient-cta">
            <Plus size={18} /> Add Activity
          </button>
        </div>

        {/* Vertical Timeline */}
        <div className="timeline-vertical-container">
          {dayItems.length === 0 ? (
            <div className="empty-activities-card shadow-subtle" style={{ margin: '2rem 0' }}>
              <Calendar size={40} style={{ color: 'var(--color-sunset-orange)', marginBottom: '1rem' }} />
              <h3>No Activities Planned for Day {selectedDay}</h3>
              <p>Add sights, tours, food stops, or notes to build your daily schedule.</p>
              <button onClick={() => setIsAddModalOpen(true)} className="btn-gradient-cta">
                <Plus size={16} /> Add First Activity
              </button>
            </div>
          ) : (
            dayItems.map((item: ItineraryItem) => (
              <div key={item.id} className="timeline-item-row">
                <div className="timeline-node-dot">
                  <CheckCircle2 size={14} />
                </div>

                <div className="timeline-item-card shadow-subtle">
                  <div className="time-slot-badge">{item.time}</div>

                  <div className="item-thumb-box">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80'}
                      alt={item.title}
                      className="item-thumb-img"
                    />
                  </div>

                  <div className="item-main-details">
                    <h4>{item.title}</h4>
                    <div className="item-meta-tags">
                      <span><Clock size={12} /> {item.duration}h</span>
                      <span><MapPin size={12} /> {item.destination}</span>
                      <span><DollarSign size={12} /> ₹{item.cost.toLocaleString('en-IN')}</span>
                      <span className="category-pill">{item.category}</span>
                    </div>
                    {item.notes && (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                        {item.notes}
                      </p>
                    )}
                  </div>

                  <div>
                    <button
                      onClick={() => deleteItineraryItem(item.id)}
                      className="btn-outline-cta"
                      style={{ padding: '0.4rem 0.6rem', color: '#E5484D' }}
                      title="Delete activity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Activity Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card shadow-medium" style={{ maxWidth: '580px' }}>
            <button onClick={() => setIsAddModalOpen(false)} className="modal-close-btn">
              <X size={20} />
            </button>

            <span className="modal-eyebrow">SCHEDULE ACTIVITY</span>
            <h3 className="modal-title">Add Activity to Day {selectedDay}</h3>
            <p className="modal-subtitle">Pick from popular catalog items or enter custom details.</p>

            {/* Catalog presets */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span className="form-label">Pick Popular Suggestion:</span>
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingTop: '0.5rem' }}>
                {activitiesData.slice(0, 4).map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => handlePickPresetActivity(act.title, act.category, act.price)}
                    className="btn-outline-cta"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', whiteSpace: 'nowrap' }}
                  >
                    + {act.title} (₹{act.price})
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddActivitySubmit} className="modal-form">
              <div className="modal-field-group">
                <label className="modal-label">Activity Title *</label>
                <input
                  type="text"
                  required
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  className="modal-input-control"
                  placeholder="e.g. Louvre Museum Guided Tour"
                />
              </div>

              <div className="modal-fields-row">
                <div className="modal-field-group">
                  <label className="modal-label">Time Slot</label>
                  <input
                    type="time"
                    value={actTime}
                    onChange={(e) => setActTime(e.target.value)}
                    className="modal-input-control"
                  />
                </div>

                <div className="modal-field-group">
                  <label className="modal-label">Duration (Hours)</label>
                  <input
                    type="number"
                    min={1}
                    value={actDuration}
                    onChange={(e) => setActDuration(Number(e.target.value))}
                    className="modal-input-control"
                  />
                </div>
              </div>

              <div className="modal-fields-row">
                <div className="modal-field-group">
                  <label className="modal-label">Estimated Cost (INR)</label>
                  <input
                    type="number"
                    value={actCost}
                    onChange={(e) => setActCost(Number(e.target.value))}
                    className="modal-input-control"
                  />
                </div>

                <div className="modal-field-group">
                  <label className="modal-label">Category</label>
                  <select
                    value={actCategory}
                    onChange={(e) => setActCategory(e.target.value)}
                    className="modal-select-control"
                  >
                    <option value="Activities">Activities</option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Culture & History">Culture & History</option>
                    <option value="Beach & Water">Beach & Water</option>
                    <option value="Transport">Transport</option>
                  </select>
                </div>
              </div>

              <div className="modal-field-group">
                <label className="modal-label">Notes</label>
                <input
                  type="text"
                  value={actNotes}
                  onChange={(e) => setActNotes(e.target.value)}
                  className="modal-input-control"
                  placeholder="Meeting point, ticket codes, or travel tips"
                />
              </div>

              <button type="submit" className="btn-modal-submit">
                <Plus size={18} /> Schedule Activity
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
