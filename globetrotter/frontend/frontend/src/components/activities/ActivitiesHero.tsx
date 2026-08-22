import React from 'react';
import { ArrowRight, Compass, Star, Award } from 'lucide-react';
import heroActivityImg from '../../assets/hero-santorini.jpg';

interface ActivitiesHeroProps {
  onExploreClick: () => void;
}

export const ActivitiesHero: React.FC<ActivitiesHeroProps> = ({ onExploreClick }) => {
  return (
    <section className="activities-hero-section">
      <div className="container">
        <div className="hero-grid-layout">
          {/* Left Content */}
          <div className="hero-left-content">
            <span className="hero-eyebrow">
              <Compass size={14} className="eyebrow-icon" />
              EXPERIENCE MORE
            </span>
            <h1 className="hero-title">
              Discover <span className="text-gradient">Things to Do</span>
            </h1>
            <p className="hero-subheading">
              Find unforgettable experiences, local adventures, and activities for every kind of traveler.
            </p>
            <div className="hero-action-buttons">
              <button onClick={onExploreClick} className="btn-gradient-cta">
                <span>Explore Activities</span>
                <ArrowRight size={18} />
              </button>
              <a href="#destinations" className="btn-outline-cta">
                <span>Browse Destinations</span>
              </a>
            </div>
          </div>

          {/* Right Visual Image & Glass Badges */}
          <div className="hero-right-visual">
            <div className="visual-blur-circle circle-1"></div>
            <div className="visual-blur-circle circle-2"></div>
            <div className="hero-image-frame shadow-medium">
              <img src={heroActivityImg} alt="Travel Activity Experience" className="hero-activity-img" />
              <div className="glass-badge badge-top-left">
                <Star size={16} className="star-icon-gold" />
                <div className="badge-text">
                  <span className="badge-val">4.9 ★</span>
                  <span className="badge-lbl">Top Rated</span>
                </div>
              </div>
              <div className="glass-badge badge-bottom-right">
                <Award size={18} className="award-icon-purple" />
                <div className="badge-text">
                  <span className="badge-val">500+</span>
                  <span className="badge-lbl">Experiences</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
