import React from 'react';
import { Compass, Settings, AlertCircle, Heart } from 'lucide-react';
import './Placeholders.css';

export const ExploreCitiesPlaceholder: React.FC = () => {
  return (
    <div className="placeholder-container">
      <Compass className="placeholder-icon animate-pulse" size={48} />
      <h2>Explore Cities</h2>
      <p className="subtitle">Discover beautiful destinations around the world</p>
      <div className="placeholder-card">
        <AlertCircle size={20} className="info-icon" />
        <p>This page is currently under construction and will be fully integrated soon. You'll be able to filter by country, region, and cost indices.</p>
      </div>
    </div>
  );
};

export const ExploreActivitiesPlaceholder: React.FC = () => {
  return (
    <div className="placeholder-container">
      <Compass className="placeholder-icon animate-pulse" size={48} />
      <h2>Explore Activities</h2>
      <p className="subtitle">Find things to do, local tours, and culinary experiences</p>
      <div className="placeholder-card">
        <AlertCircle size={20} className="info-icon" />
        <p>This page is currently under construction and will be fully integrated soon. You'll be able to filter activities by category, cost, and duration.</p>
      </div>
    </div>
  );
};

export const TripBuilderPlaceholder: React.FC = () => {
  return (
    <div className="placeholder-container">
      <Settings className="placeholder-icon animate-spin-slow" size={48} />
      <h2>Itinerary Builder & Budget Calculator</h2>
      <p className="subtitle">Optimize travel times, drag and drop destinations, and track costs</p>
      <div className="placeholder-card">
        <AlertCircle size={20} className="info-icon" />
        <p>The interactive Multi-City Trip Planner and daily budget sheets are being finalized. They will connect directly with your travel dashboard shortly!</p>
      </div>
    </div>
  );
};

export const AboutPlaceholder: React.FC = () => {
  return (
    <div className="placeholder-container">
      <Heart className="placeholder-icon heartbeat" size={48} />
      <h2>About GlobeTrotter</h2>
      <p className="subtitle">Odoo Hackathon 2026 Project</p>
      <div className="placeholder-card text-left">
        <p style={{ marginBottom: '1rem' }}>
          GlobeTrotter is a personalized travel planning application designed to make planning multi-city trips simple, interactive, and collaborative.
        </p>
        <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>Hackathon Team:</h4>
        <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.7' }}>
          <li>Nagesh Gudale</li>
          <li>Ishwari Nandargi</li>
          <li>Archita Thakur</li>
          <li>Pratik Rathod</li>
        </ul>
      </div>
    </div>
  );
};
