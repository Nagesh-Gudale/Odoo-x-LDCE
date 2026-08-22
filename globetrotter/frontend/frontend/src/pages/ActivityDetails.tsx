import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Star, Clock, CheckCircle2, XCircle, 
  Heart, Plus, Calendar, Compass, Share2 
} from 'lucide-react';
import { activitiesData } from '../data/activitiesData';
import { ActivityCard } from '../components/activities/ActivityCard';
import { AddToTripModal } from '../components/activities/AddToTripModal';
import './Activities.css';

export const ActivityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const activity = activitiesData.find((a) => a.id === id) || null;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('favoriteActivities');
      return saved ? JSON.parse(saved) : ['activity-001'];
    } catch {
      return ['activity-001'];
    }
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    localStorage.setItem('favoriteActivities', JSON.stringify(favorites));
  }, [favorites]);

  if (!activity) {
    return (
      <div className="activity-not-found container">
        <h2>Activity Not Found</h2>
        <p>We couldn't find the activity you're looking for.</p>
        <Link to="/activities" className="btn-gradient-cta">
          <ArrowLeft size={16} /> Back to Activities
        </Link>
      </div>
    );
  }

  const isFavorite = favorites.includes(activity.id);

  const toggleFavorite = (actId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(actId) ? prev.filter((item) => item !== actId) : [...prev, actId]
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const relatedActivities = activitiesData
    .filter((a) => a.id !== activity.id && a.category === activity.category)
    .slice(0, 3);

  return (
    <div className="activity-details-page">
      {/* Top Breadcrumb Header */}
      <div className="details-top-bar container">
        <button onClick={() => navigate('/activities')} className="btn-back-link">
          <ArrowLeft size={16} />
          <span>Back to Activities</span>
        </button>
        <div className="top-bar-right">
          <button onClick={handleShare} className="btn-share-icon" title="Share link">
            <Share2 size={16} />
            <span>{isCopied ? 'Link Copied!' : 'Share'}</span>
          </button>
          <button 
            onClick={() => toggleFavorite(activity.id)} 
            className={`btn-fav-icon ${isFavorite ? 'liked' : ''}`}
            title={isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
          >
            <Heart size={16} className={isFavorite ? 'filled' : ''} />
            <span>{isFavorite ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Hero Banner Box */}
      <div className="details-hero-banner container">
        <div className="details-banner-frame shadow-medium">
          <img src={activity.image} alt={activity.title} className="details-hero-img" />
          <div className="details-banner-overlay"></div>
          <div className="details-banner-content">
            <span className="details-badge">{activity.badge}</span>
            <h1 className="details-hero-title">{activity.title}</h1>
            <div className="details-hero-meta">
              <span className="meta-tag">
                <MapPin size={16} /> {activity.destination}
              </span>
              <span className="meta-tag">
                <Star size={16} className="star-gold" /> {activity.rating} ({activity.reviews} reviews)
              </span>
              <span className="meta-tag">
                <Clock size={16} /> {activity.duration}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Main Section Layout */}
      <div className="details-body-section container">
        <div className="details-grid-layout">
          {/* Left Column: Overview & Details */}
          <div className="details-main-content">
            <div className="details-card shadow-subtle">
              <h2 className="card-section-title">Overview</h2>
              <p className="overview-text">{activity.description}</p>
            </div>

            {/* Included / Excluded Grid */}
            <div className="details-card shadow-subtle">
              <h2 className="card-section-title">What's Included & Excluded</h2>
              <div className="inclusions-grid">
                <div className="inc-column">
                  <h4 className="inc-subtitle">What's Included</h4>
                  <ul className="inc-list">
                    {activity.included.map((item, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={16} className="check-icon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="inc-column">
                  <h4 className="exc-subtitle">What's Not Included</h4>
                  <ul className="inc-list">
                    {activity.excluded.map((item, idx) => (
                      <li key={idx}>
                        <XCircle size={16} className="x-icon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Meeting Point Box */}
            <div className="details-card shadow-subtle">
              <h2 className="card-section-title">Meeting Point & Instructions</h2>
              <div className="meeting-point-box">
                <MapPin size={24} className="map-pin-large" />
                <div className="meeting-info">
                  <h4 className="meeting-location">{activity.meetingPoint}</h4>
                  <p className="meeting-desc">
                    Please arrive 15 minutes before your selected start time. Present your mobile booking voucher to your tour leader upon arrival.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Booking Sidebar */}
          <div className="details-sidebar">
            <div className="booking-sidebar-card shadow-medium">
              <div className="sidebar-price-header">
                <span className="price-label">Price per traveler</span>
                <div className="price-amount-box">
                  <span className="price-amount">₹{activity.price.toLocaleString('en-IN')}</span>
                  <span className="price-unit">INR</span>
                </div>
              </div>

              <div className="sidebar-divider"></div>

              <div className="sidebar-meta-list">
                <div className="meta-list-item">
                  <Clock size={16} />
                  <div>
                    <span className="item-label">Duration</span>
                    <span className="item-value">{activity.duration}</span>
                  </div>
                </div>

                <div className="meta-list-item">
                  <Calendar size={16} />
                  <div>
                    <span className="item-label">Next Available Date</span>
                    <span className="item-value">{activity.availableDates[0]}</span>
                  </div>
                </div>

                <div className="meta-list-item">
                  <Compass size={16} />
                  <div>
                    <span className="item-label">Category</span>
                    <span className="item-value">{activity.category}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsModalOpen(true)} 
                className="btn-add-to-trip-large"
              >
                <Plus size={20} />
                <span>Add to Trip</span>
              </button>

              <p className="free-cancel-note">✓ Free cancellation up to 24 hours in advance</p>
            </div>
          </div>
        </div>

        {/* Related Activities */}
        {relatedActivities.length > 0 && (
          <div className="related-activities-section">
            <h3 className="related-title">Similar Experiences You Might Like</h3>
            <div className="activities-grid">
              {relatedActivities.map((act) => (
                <ActivityCard
                  key={act.id}
                  activity={act}
                  isFavorite={favorites.includes(act.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add to Trip Modal */}
      <AddToTripModal
        activity={activity}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
