import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';

export const ActivitiesCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="activities-cta-section">
      <div className="container">
        <div className="activities-cta-box shadow-medium">
          <div className="cta-content-wrapper">
            <span className="cta-eyebrow">
              <Compass size={16} /> UNFORGETTABLE JOURNEYS
            </span>
            <h2 className="cta-heading">Make Your Trip More Memorable</h2>
            <p className="cta-subheading">
              Add experiences that turn a simple journey into an unforgettable adventure.
            </p>
            <div className="cta-button-group">
              <button 
                onClick={() => navigate('/trips/create')} 
                className="btn-gradient-cta"
              >
                <span>Start Planning</span>
                <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => navigate('/trips')} 
                className="btn-outline-cta"
              >
                <span>Explore Trips</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
