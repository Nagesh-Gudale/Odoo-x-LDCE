import React, { useState } from 'react';
import { Compass, Trash2, X, AlertTriangle } from 'lucide-react';
import { useTrip } from '../../context/useTrip';
import type { Trip, DestinationStop } from '../../data/tripData';
import '../../styles/Modules.css';

export const AdminTrips: React.FC = () => {
  const { trips, deleteTrip } = useTrip();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <span className="module-eyebrow">
          <Compass size={16} /> PLATFORM TRIPS
        </span>
        <h1 className="module-title">Trip Management</h1>
        <p className="module-subtitle">Inspect, review, and moderate all user-created itineraries across GlobeTrotter.</p>
      </div>

      <div className="admin-table-card shadow-medium">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Trip Name</th>
              <th>Owner</th>
              <th>Destinations</th>
              <th>Dates</th>
              <th>Budget</th>
              <th>Visibility</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip: Trip) => (
              <tr key={trip.id}>
                <td>
                  <strong style={{ fontSize: '0.95rem' }}>{trip.name}</strong>
                </td>
                <td>{trip.ownerName}</td>
                <td>
                  {trip.destinations.map((d: DestinationStop) => d.city).join(' → ')}
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {trip.startDate} to {trip.endDate}
                </td>
                <td style={{ fontWeight: 800, color: 'var(--color-sunset-orange)' }}>
                  ₹{(trip.totalBudget || 85000).toLocaleString('en-IN')}
                </td>
                <td>
                  <span className="category-pill">{trip.visibility.toUpperCase()}</span>
                </td>
                <td>
                  <button
                    onClick={() => setDeleteTargetId(trip.id)}
                    className="btn-outline-cta"
                    style={{ padding: '0.35rem 0.6rem', color: '#E5484D' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="modal-backdrop">
          <div className="modal-card shadow-medium" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <button onClick={() => setDeleteTargetId(null)} className="modal-close-btn">
              <X size={20} />
            </button>

            <AlertTriangle size={42} style={{ color: '#E5484D', marginBottom: '1rem' }} />
            <h3 className="modal-title">Delete Trip?</h3>
            <p className="modal-subtitle">This will permanently delete the itinerary and all related budget items.</p>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button onClick={() => setDeleteTargetId(null)} className="btn-outline-cta" style={{ flex: 1 }}>
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteTrip(deleteTargetId);
                  setDeleteTargetId(null);
                }}
                className="btn-gradient-cta"
                style={{ flex: 1, background: '#E5484D' }}
              >
                Delete Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
