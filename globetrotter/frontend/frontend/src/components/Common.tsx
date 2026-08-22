import React from 'react';
import { Star, Calendar, Users, DollarSign } from 'lucide-react';
import './Common.css';

// ==========================================
// Button Component
// ==========================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'sunset';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  return (
    <button className={`custom-btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
};

// ==========================================
// Card Component
// ==========================================
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, style }) => {
  return (
    <div className={`custom-card ${className}`} onClick={onClick} style={style}>
      {children}
    </div>
  );
};

// ==========================================
// Badge Component
// ==========================================
interface BadgeProps {
  text: string;
  variant?: 'orange' | 'coral' | 'pink' | 'purple' | 'ocean' | 'success';
}

export const Badge: React.FC<BadgeProps> = ({ text, variant = 'orange' }) => {
  return <span className={`custom-badge badge-${variant}`}>{text}</span>;
};

// ==========================================
// Input Component
// ==========================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input className={`custom-input ${className}`} {...props} />
    </div>
  );
};

// ==========================================
// StatCard Component
// ==========================================
interface StatCardProps {
  value: string;
  label: string;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label }) => {
  return (
    <div className="stat-card">
      <h3 className="stat-value">{value}</h3>
      <p className="stat-label">{label}</p>
    </div>
  );
};

// ==========================================
// DestinationCard Component
// ==========================================
export interface DestinationCardProps {
  imageUrl: string;
  badge: string;
  city: string;
  country: string;
  category: string;
  cost: string;
  rating: number;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  imageUrl,
  badge,
  city,
  country,
  category,
  cost,
  rating,
}) => {
  return (
    <div className="destination-card">
      <div className="dest-image-container">
        <img src={imageUrl} alt={`${city}, ${country}`} className="dest-image" />
        <span className="dest-badge-overlay">
          <Badge text={badge} variant="orange" />
        </span>
      </div>
      <div className="dest-info">
        <div className="dest-header">
          <h3 className="dest-title">{city}, {country}</h3>
          <span className="dest-rating">
            <Star className="star-icon" size={14} />
            {rating.toFixed(1)}
          </span>
        </div>
        <p className="dest-category">{category}</p>
        <div className="dest-footer">
          <div className="dest-cost">
            <span className="cost-label">Estimated Cost</span>
            <span className="cost-value">{cost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// TripCard Component
// ==========================================
export interface TripCardProps {
  coverUrl: string;
  name: string;
  cities: string[];
  dates: string;
  travelers: number;
  budget: string;
  progress?: number;
  onView?: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({
  coverUrl,
  name,
  cities,
  dates,
  travelers,
  budget,
  progress = 0,
  onView,
}) => {
  return (
    <div className="trip-card">
      <div className="trip-image-container">
        <img src={coverUrl} alt={name} className="trip-image" />
        <div className="trip-cities-badge">
          {cities.join(' ➔ ')}
        </div>
      </div>
      <div className="trip-info">
        <h3 className="trip-name">{name}</h3>
        <div className="trip-meta">
          <div className="meta-item">
            <Calendar size={14} />
            <span>{dates}</span>
          </div>
          <div className="meta-item">
            <Users size={14} />
            <span>{travelers} Travelers</span>
          </div>
          <div className="meta-item">
            <DollarSign size={14} />
            <span>{budget}</span>
          </div>
        </div>
        {progress > 0 && (
          <div className="trip-progress">
            <div className="progress-labels">
              <span>Budget Used</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className={`progress-bar ${progress > 100 ? 'over-budget' : ''}`} 
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
        <button onClick={onView} className="btn-view-trip">
          View Trip Details →
        </button>
      </div>
    </div>
  );
};
