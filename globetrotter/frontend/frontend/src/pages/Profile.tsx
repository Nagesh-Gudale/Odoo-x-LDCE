import React, { useState } from 'react';
import { Heart, Save } from 'lucide-react';
import { Badge, Button, Card, Input } from '../components/Common';
import './Profile.css';

export const Profile: React.FC = () => {
  const [name, setName] = useState('Nagesh Gudale');
  const [email, setEmail] = useState('nagesh@odoo.com');
  const [country, setCountry] = useState('India');

  // Travel preferences selection
  const [preferences, setPreferences] = useState<{ [key: string]: boolean }>({
    'Adventure': true,
    'Culture': true,
    'Food': true,
    'Nature': false,
    'Luxury': false,
    'Budget Travel': true,
    'Beaches': true,
    'Nightlife': false,
  });

  const togglePreference = (pref: string) => {
    setPreferences({
      ...preferences,
      [pref]: !preferences[pref],
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  const savedDestinations = [
    { city: 'Rome', country: 'Italy', category: 'History & Art' },
    { city: 'Bali', country: 'Indonesia', category: 'Beaches & Nature' },
  ];

  return (
    <div className="profile-page container">
      <div className="profile-header">
        <h2>My Profile</h2>
        <p className="subtitle">Manage your personal settings, travel preferences, and saved locations</p>
      </div>

      <div className="profile-layout-grid">
        {/* Left Side: Profile Form and Settings */}
        <div className="profile-left">
          <Card className="profile-form-card">
            <div className="card-title-wrapper">
              <Badge text="Account Info" variant="purple" />
              <h3>Personal Details</h3>
            </div>

            <form onSubmit={handleSave} className="profile-form">
              <div className="avatar-section">
                <div className="avatar-placeholder">
                  {name.charAt(0)}
                </div>
                <div>
                  <h4>{name}</h4>
                  <p className="avatar-subtitle">Travel enthusiast</p>
                </div>
              </div>

              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled
              />

              <Input
                label="Country of Origin"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />

              <div className="form-submit-wrapper">
                <Button variant="sunset" type="submit">
                  <Save size={16} style={{ marginRight: '8px' }} /> Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Side: Preferences and Saved Destinations */}
        <div className="profile-right">
          {/* Preferences */}
          <Card className="preferences-card">
            <div className="card-title-wrapper">
              <Badge text="Visual Identity" variant="orange" />
              <h3>Travel Preferences</h3>
            </div>
            <p className="pref-description">Select categories to receive customized city suggestions:</p>

            <div className="pref-chips-grid">
              {Object.keys(preferences).map((pref) => (
                <button
                  key={pref}
                  type="button"
                  className={`pref-chip ${preferences[pref] ? 'active' : ''}`}
                  onClick={() => togglePreference(pref)}
                >
                  <Heart size={14} className="heart-icon-pref" />
                  <span>{pref}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Saved Destinations */}
          <Card className="saved-destinations-card" style={{ marginTop: '2rem' }}>
            <div className="card-title-wrapper">
              <Badge text="Saved List" variant="pink" />
              <h3>Saved Destinations</h3>
            </div>

            <div className="saved-dest-list">
              {savedDestinations.map((dest, idx) => (
                <div key={idx} className="saved-dest-item">
                  <div>
                    <h4>{dest.city}, {dest.country}</h4>
                    <p>{dest.category}</p>
                  </div>
                  <Badge text="Saved" variant="success" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
