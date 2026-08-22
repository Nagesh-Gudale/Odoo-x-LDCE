import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Star, Clock, ArrowRight } from 'lucide-react';
import type { Activity } from '../../data/activitiesData';

interface ActivityCardProps {
  activity: Activity;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onAddToTripClick?: (activity: Activity, e: React.MouseEvent) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isFavorite,
  onToggleFavorite,
  onAddToTripClick,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/activities/${activity.id}`);
  };

  return (
    <div className="activity-card shadow-subtle" onClick={handleCardClick}>
      {/* Image Box */}
      <div className="card-image-box">
        <img src={activity.image} alt={activity.title} className="card-img" />
        <div className="card-gradient-overlay"></div>

        {/* Badge */}
        <span className={`card-badge badge-${activity.badge.toLowerCase().replace(/\s+/g, '-')}`}>
          {activity.badge}
        </span>

        {/* Favorite Heart Button */}
        <button
          className={`card-heart-btn ${isFavorite ? 'liked' : ''}`}
          onClick={(e) => onToggleFavorite(activity.id, e)}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={16} className={`heart-icon ${isFavorite ? 'filled' : ''}`} />
        </button>
      </div>

      {/* Details Box */}
      <div className="card-content">
        <div className="card-header-row">
          <span className="card-location">
            <MapPin size={14} className="pin-icon" />
            {activity.destination}
          </span>
          <div className="card-rating">
            <Star size={14} className="star-icon" />
            <span className="rating-val">{activity.rating}</span>
            <span className="reviews-count">({activity.reviews})</span>
          </div>
        </div>

        <h3 className="card-title">{activity.title}</h3>

        <div className="card-meta-row">
          <span className="meta-item">
            <Clock size={14} />
            {activity.duration}
          </span>
          <span className="category-pill">{activity.category}</span>
        </div>

        <div className="card-footer-row">
          <div className="price-box">
            <span className="price-val">₹{activity.price.toLocaleString('en-IN')}</span>
            <span className="price-lbl">per person</span>
          </div>

          <div className="card-actions">
            {onAddToTripClick && (
              <button 
                className="btn-add-trip-mini"
                onClick={(e) => onAddToTripClick(activity, e)}
                title="Add to Trip"
              >
                + Trip
              </button>
            )}
            <button className="btn-view-details">
              <span>View</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
