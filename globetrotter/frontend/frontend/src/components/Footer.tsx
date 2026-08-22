import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Heart } from 'lucide-react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand-section">
          <Link to="/home" className="footer-brand">
            <Globe className="brand-icon" />
            <span>GlobeTrotter</span>
          </Link>
          <p className="footer-tagline">Plan. Explore. Experience More.</p>
          <p className="footer-subtag">Your companion for personalized multi-city travel itineraries.</p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-column">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/search/cities">Destinations</Link></li>
              <li><Link to="/search/activities">Activities</Link></li>
              <li><Link to="/community">Travel Guides</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Product</h4>
            <ul>
              <li><Link to="/trips">Trip Planning</Link></li>
              <li><Link to="/trips/build">Budget Calculator</Link></li>
              <li><Link to="/community">Collaboration</Link></li>
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
