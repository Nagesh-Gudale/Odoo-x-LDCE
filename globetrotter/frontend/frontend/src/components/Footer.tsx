import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { GlobeTrotterLogo } from './GlobeTrotterLogo';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand-section">
          <Link to="/home" className="footer-brand">
            <GlobeTrotterLogo size="sm" showText={true} showTagline={false} />
          </Link>
          <p className="footer-tagline">Plan. Explore. Experience More.</p>
          <p className="footer-subtag">Your companion for personalized multi-city travel itineraries.</p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-column">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/explore">Destinations</Link></li>
              <li><Link to="/activities">Activities</Link></li>
              <li><Link to="/community">Community Feed</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Product</h4>
            <ul>
              <li><Link to="/trips">Trip Planning</Link></li>
              <li><Link to="/budget">Budget Calculator</Link></li>
              <li><Link to="/calendar">Travel Calendar</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>© 2026 GlobeTrotter. All rights reserved.</p>
          <p className="hackathon-credit">
            Built for the <strong>Odoo Hackathon 2026</strong> with <Heart size={14} className="heart-icon" />
          </p>
        </div>
      </div>
    </footer>
  );
};
