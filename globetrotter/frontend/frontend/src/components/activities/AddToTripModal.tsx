import React, { useState } from 'react';
import { X, Calendar, Clock, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import type { Activity } from '../../data/activitiesData';

interface AddToTripModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AddToTripModal: React.FC<AddToTripModalProps> = ({
  activity,
  isOpen,
  onClose,
}) => {
  const [selectedTrip, setSelectedTrip] = useState('japan-korea-2026');
  const [selectedDate, setSelectedDate] = useState(activity?.availableDates[0] || '2026-09-10');
  const [selectedTime, setSelectedTime] = useState(activity?.availableTimes[0] || '10:00');
  const [travelers, setTravelers] = useState(2);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !activity) return null;

  const mockTrips = [
    { id: 'japan-korea-2026', title: 'Japan & Korea Explorer 2026' },
    { id: 'santorini-greece', title: 'Santorini Sunset Getaway' },
    { id: 'dubai-luxury', title: 'Dubai Luxury Escape' },
    { id: 'create-new', title: '+ Create New Trip' },
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card shadow-medium" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="modal-success-state">
            <div className="success-icon-wrapper">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="modal-title">Activity Added!</h3>
            <p className="modal-subtitle">
              <strong>{activity.title}</strong> has been added to your trip itinerary.
            </p>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <span className="modal-eyebrow">ADD TO ITINERARY</span>
              <h3 className="modal-title">{activity.title}</h3>
              <p className="modal-subtitle">📍 {activity.destination} • ₹{activity.price.toLocaleString('en-IN')}/person</p>
            </div>

            <form onSubmit={handleAdd} className="modal-form">
              {/* Select Trip */}
              <div className="modal-field-group">
                <label className="modal-label">Select Trip</label>
                <select
                  value={selectedTrip}
                  onChange={(e) => setSelectedTrip(e.target.value)}
                  className="modal-select-control"
                >
                  {mockTrips.map((trip) => (
                    <option key={trip.id} value={trip.id}>
                      {trip.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Row */}
              <div className="modal-fields-row">
                <div className="modal-field-group">
                  <label className="modal-label">
                    <Calendar size={14} /> Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="modal-input-control"
                    required
                  />
                </div>

                <div className="modal-field-group">
                  <label className="modal-label">
                    <Clock size={14} /> Time Slot
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="modal-select-control"
                  >
                    {activity.availableTimes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Traveler Stepper */}
              <div className="modal-field-group">
                <label className="modal-label">
                  <Users size={14} /> Travelers
                </label>
                <div className="traveler-stepper">
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                  >
                    -
                  </button>
                  <span className="stepper-count">{travelers} Travelers</span>
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => setTravelers(travelers + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="modal-summary-box">
                <span className="summary-label">Total Estimated Cost:</span>
                <span className="summary-value">₹{(activity.price * travelers).toLocaleString('en-IN')}</span>
              </div>

              {/* Submit */}
              <button type="submit" className="btn-modal-submit">
                <span>Add Activity</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
