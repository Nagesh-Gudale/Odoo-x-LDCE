import React, { useState } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { activitiesData } from '../../data/activitiesData';
import type { Activity } from '../../data/activitiesData';
import '../../styles/Modules.css';

export const AdminActivities: React.FC = () => {
  const [activitiesList, setActivitiesList] = useState<Activity[]>(activitiesData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('Paris');
  const [category, setCategory] = useState<Activity['category']>('Culture & History');
  const [price, setPrice] = useState(4500);

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const created: Activity = {
      id: `act-admin-${Date.now()}`,
      title: title.trim(),
      destination,
      category,
      price: Number(price),
      currency: '₹',
      duration: '3 hours',
      rating: 4.9,
      reviews: 12,
      badge: 'Popular',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80',
      description: 'Admin created curated experience.',
      included: ['Guided tour', 'Entry tickets'],
      excluded: ['Hotel pickup'],
      meetingPoint: 'City Center Information Kiosk',
      availableDates: ['2026-09-01', '2026-09-05'],
      availableTimes: ['10:00 AM', '02:00 PM'],
      coordinates: { lat: 48.8566, lng: 2.3522 },
    };

    setActivitiesList([created, ...activitiesList]);
    setTitle('');
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setActivitiesList((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span className="module-eyebrow">
            <MapPin size={16} /> CATALOG MANAGEMENT
          </span>
          <h1 className="module-title">Activities Inventory</h1>
          <p className="module-subtitle">Manage global experiences, pricing in INR, ratings, and categories.</p>
        </div>

        <button onClick={() => setIsAddModalOpen(true)} className="btn-gradient-cta">
          <Plus size={16} /> Add New Activity
        </button>
      </div>

      <div className="admin-table-card shadow-medium">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Destination</th>
              <th>Category</th>
              <th>Price (INR)</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activitiesList.map((act) => (
              <tr key={act.id}>
                <td>
                  <strong style={{ fontSize: '0.95rem' }}>{act.title}</strong>
                </td>
                <td>📍 {act.destination}</td>
                <td><span className="category-pill">{act.category}</span></td>
                <td style={{ fontWeight: 800, color: 'var(--color-sunset-orange)' }}>
                  ₹{act.price.toLocaleString('en-IN')}
                </td>
                <td>⭐ {act.rating} ({act.reviews})</td>
                <td>
                  <button onClick={() => handleDelete(act.id)} className="btn-outline-cta" style={{ padding: '0.35rem 0.6rem', color: '#E5484D' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card shadow-medium">
            <span className="modal-eyebrow">NEW ACTIVITY</span>
            <h3 className="modal-title">Publish Activity Item</h3>

            <form onSubmit={handleAddActivity} className="modal-form" style={{ marginTop: '1.25rem' }}>
              <div className="modal-field-group">
                <label className="modal-label">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="modal-input-control"
                  placeholder="e.g. Seine River Evening Cruise"
                />
              </div>

              <div className="modal-fields-row">
                <div className="modal-field-group">
                  <label className="modal-label">Destination</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="modal-input-control"
                  />
                </div>

                <div className="modal-field-group">
                  <label className="modal-label">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Activity['category'])}
                    className="modal-select-control"
                  >
                    <option value="Culture & History">Culture & History</option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Beach & Water">Beach & Water</option>
                    <option value="Sightseeing">Sightseeing</option>
                  </select>
                </div>
              </div>

              <div className="modal-field-group">
                <label className="modal-label">Price (INR)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="modal-input-control"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-outline-cta" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-gradient-cta" style={{ flex: 1 }}>
                  Publish Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
