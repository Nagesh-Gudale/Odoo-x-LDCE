import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, X, ArrowRight } from 'lucide-react';
import type { Activity } from '../../data/activitiesData';

interface ActivityMapProps {
  activities: Activity[];
}

export const ActivityMap: React.FC<ActivityMapProps> = ({ activities }) => {
  const navigate = useNavigate();
  const [activePin, setActivePin] = useState<Activity | null>(activities[0] || null);

  const mapPins = [
    { name: 'Tokyo', lat: '32%', lng: '84%', activityId: 'activity-002' },
    { name: 'Santorini', lat: '42%', lng: '56%', activityId: 'activity-001' },
    { name: 'Bali', lat: '65%', lng: '80%', activityId: 'activity-003' },
    { name: 'Dubai', lat: '46%', lng: '64%', activityId: 'activity-004' },
    { name: 'Paris', lat: '36%', lng: '48%', activityId: 'activity-005' },
    { name: 'Maldives', lat: '58%', lng: '70%', activityId: 'activity-007' },
  ];

  const handlePinClick = (activityId: string) => {
    const found = activities.find((a) => a.id === activityId);
    if (found) {
      setActivePin(found);
    }
  };

  return (
    <section className="activity-map-section">
      <div className="container">
        <div className="section-header-centered">
          <h2>Explore Activities Around the World</h2>
          <p>Click pins on the map to preview top-rated experiences worldwide.</p>
        </div>

        <div className="map-container-card shadow-medium">
          {/* Simulated Travel World Map Canvas */}
          <div className="world-map-canvas">
            <svg viewBox="0 0 1000 500" className="map-bg-svg" preserveAspectRatio="none">
              <path
                d="M150 150 Q200 100 250 160 T350 200 Q450 150 550 180 T750 140 Q850 200 900 280"
                fill="none"
                stroke="var(--border)"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>

            {/* Map Pins */}
            {mapPins.map((pin) => {
              const isActive = activePin?.id === pin.activityId;

              return (
                <button
                  key={pin.name}
                  className={`map-marker-pin ${isActive ? 'active' : ''}`}
                  style={{ top: pin.lat, left: pin.lng }}
                  onClick={() => handlePinClick(pin.activityId)}
                  title={pin.name}
                >
                  <MapPin size={20} className="pin-svg" />
                  <span className="pin-label">{pin.name}</span>
                </button>
              );
            })}

            {/* Active Pin Card Popup Overlay */}
            {activePin && (
              <div className="map-popup-card shadow-medium">
                <button 
                  className="popup-close-btn" 
                  onClick={() => setActivePin(null)}
                  aria-label="Close preview"
                >
                  <X size={16} />
                </button>
                <div className="popup-thumb-box">
                  <img src={activePin.image} alt={activePin.title} className="popup-img" />
                </div>
                <div className="popup-details">
                  <span className="popup-location">
                    <MapPin size={12} /> {activePin.destination}
                  </span>
                  <h4 className="popup-title">{activePin.title}</h4>
                  <div className="popup-meta">
                    <span className="popup-rating">
                      <Star size={12} className="star-gold" /> {activePin.rating}
                    </span>
                    <span className="popup-price">₹{activePin.price.toLocaleString('en-IN')}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/activities/${activePin.id}`)}
                    className="btn-popup-view"
                  >
                    <span>View Activity</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
