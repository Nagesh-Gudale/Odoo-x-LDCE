import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, Calendar, Users, MapPin, Plus, Trash2, ArrowRight, ArrowLeft, Check, Sparkles, DollarSign 
} from 'lucide-react';
import { useTrip } from '../context/useTrip';
import type { DestinationStop, Trip } from '../data/tripData';
import '../styles/Modules.css';

const SAMPLE_COVER_IMAGES = [
  { label: 'Paris', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Santorini', url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Tokyo', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Bali', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Dubai', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' },
];

const AVAILABLE_INTERESTS = [
  'Adventure', 'Food', 'History', 'Culture', 'Nature', 
  'Beaches', 'Shopping', 'Nightlife', 'Photography', 'Architecture'
];

export const CreateTrip: React.FC = () => {
  const navigate = useNavigate();
  const { createTrip } = useTrip();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1 State
  const [name, setName] = useState('European Summer Adventure');
  const [description, setDescription] = useState('Exploring the highlights of France, Italy, and Greece across two sun-drenched weeks.');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-14');
  const [travelers, setTravelers] = useState(2);
  const [tripType, setTripType] = useState<Trip['tripType']>('Couple');
  const [travelStyle] = useState<Trip['travelStyle']>('Balanced');
  const [coverImage, setCoverImage] = useState(SAMPLE_COVER_IMAGES[0].url);

  // Step 2 State
  const [destinations, setDestinations] = useState<DestinationStop[]>([
    {
      id: 'dest-1',
      city: 'Paris',
      country: 'France',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80',
      days: 4,
      arrivalDate: '2026-09-01',
      departureDate: '2026-09-05',
      cost: 25000,
      rating: 4.9,
    },
    {
      id: 'dest-2',
      city: 'Rome',
      country: 'Italy',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80',
      days: 5,
      arrivalDate: '2026-09-05',
      departureDate: '2026-09-10',
      cost: 21500,
      rating: 4.8,
    },
    {
      id: 'dest-3',
      city: 'Santorini',
      country: 'Greece',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=400&q=80',
      days: 4,
      arrivalDate: '2026-09-10',
      departureDate: '2026-09-14',
      cost: 26000,
      rating: 4.9,
    },
  ]);

  const [newCity, setNewCity] = useState('');
  const [newCountry, setNewCountry] = useState('');

  // Step 3 State
  const [budgetLevel, setBudgetLevel] = useState<'Budget' | 'Moderate' | 'Premium' | 'Luxury'>('Premium');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Food', 'History', 'Culture', 'Photography']);

  // Add destination helper
  const handleAddDestination = () => {
    if (!newCity.trim()) return;
    const added: DestinationStop = {
      id: `dest-${Date.now()}`,
      city: newCity.trim(),
      country: newCountry.trim() || 'Global',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80',
      days: 3,
      arrivalDate: startDate,
      departureDate: endDate,
      cost: 20000,
      rating: 4.8,
    };
    setDestinations((prev) => [...prev, added]);
    setNewCity('');
    setNewCountry('');
  };

  const handleRemoveDestination = (id: string) => {
    setDestinations((prev) => prev.filter((d) => d.id !== id));
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const totalCalculatedCost = destinations.reduce((sum, d) => sum + d.cost, 0);

  const handleCreateTripSubmit = () => {
    const created = createTrip({
      ownerId: '1',
      ownerName: 'You',
      name,
      description,
      startDate,
      endDate,
      travelers,
      tripType,
      travelStyle,
      coverImage,
      destinations,
      totalBudget: totalCalculatedCost + 15000,
      status: 'planned',
      visibility: 'public',
      collaborators: [],
      interests: selectedInterests,
    });
    navigate(`/trips/${created.id}`);
  };

  return (
    <div className="module-page-container">
      <div className="container">
        {/* Header */}
        <div className="module-header-banner">
          <span className="module-eyebrow">
            <Compass size={16} /> Step {currentStep} of 4 • Multi-City Trip Wizard
          </span>
          <h1 className="module-title">Create Your Dream Journey</h1>
          <p className="module-subtitle">
            Plan destinations, organize your travel style, set dates, and build your custom itinerary.
          </p>
        </div>

        {/* Stepper Navigation */}
        <div className="wizard-stepper-bar">
          {[
            { step: 1, title: '1. Trip Basics' },
            { step: 2, title: '2. Destinations' },
            { step: 3, title: '3. Preferences' },
            { step: 4, title: '4. Review & Create' },
          ].map((item) => (
            <div
              key={item.step}
              className={`wizard-step-item ${currentStep === item.step ? 'active' : ''} ${
                currentStep > item.step ? 'completed' : ''
              }`}
              onClick={() => setCurrentStep(item.step)}
            >
              <div className="step-number-circle">
                {currentStep > item.step ? <Check size={16} /> : item.step}
              </div>
              <span className="step-label-title">{item.title}</span>
            </div>
          ))}
        </div>

        {/* Wizard Card Body */}
        <div className="wizard-card-frame">
          {/* STEP 1: BASICS */}
          {currentStep === 1 && (
            <div>
              <h3 className="card-section-title">Step 1: Basic Trip Information</h3>
              <div className="form-field-group">
                <label className="form-label">Trip Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input-control"
                  placeholder="e.g. European Summer Adventure"
                />
              </div>

              <div className="form-field-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea-control"
                  placeholder="What is the goal or theme of this trip?"
                />
              </div>

              <div className="form-grid-2col">
                <div className="form-field-group">
                  <label className="form-label">
                    <Calendar size={16} /> Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-input-control"
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-label">
                    <Calendar size={16} /> End Date *
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-input-control"
                  />
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="form-field-group">
                  <label className="form-label">
                    <Users size={16} /> Travelers Count
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value))}
                    className="form-input-control"
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-label">Trip Type</label>
                  <select
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value as Trip['tripType'])}
                    className="form-select-control"
                  >
                    <option value="Solo">Solo</option>
                    <option value="Couple">Couple</option>
                    <option value="Family">Family</option>
                    <option value="Friends">Friends</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
              </div>

              <div className="form-field-group">
                <label className="form-label">Select Cover Image</label>
                <div className="option-cards-grid">
                  {SAMPLE_COVER_IMAGES.map((img) => (
                    <div
                      key={img.label}
                      className={`selectable-option-card ${coverImage === img.url ? 'selected' : ''}`}
                      onClick={() => setCoverImage(img.url)}
                    >
                      <img
                        src={img.url}
                        alt={img.label}
                        style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <span className="option-title">{img.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DESTINATIONS */}
          {currentStep === 2 && (
            <div>
              <h3 className="card-section-title">Step 2: Add Destinations & Route</h3>
              
              {/* Route line */}
              <div className="route-visual-bar">
                <span className="form-label">Trip Route:</span>
                {destinations.map((d, index) => (
                  <React.Fragment key={d.id}>
                    <span className="route-stop-pill">
                      <MapPin size={14} /> {d.city} ({d.days} days)
                    </span>
                    {index < destinations.length - 1 && <span className="route-arrow">→</span>}
                  </React.Fragment>
                ))}
              </div>

              {/* Add destination box */}
              <div className="form-grid-2col">
                <div className="form-field-group">
                  <label className="form-label">City Name</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="form-input-control"
                    placeholder="e.g. Kyoto, Venice, Zurich"
                  />
                </div>
                <div className="form-field-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="form-input-control"
                    placeholder="e.g. Japan, Italy, Switzerland"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <button onClick={handleAddDestination} className="btn-gradient-cta" style={{ width: '100%', height: '44px' }}>
                  <Plus size={18} /> Add Destination Stop
                </button>
              </div>

              {/* Destinations List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {destinations.map((dest) => (
                  <div
                    key={dest.id}
                    className="selectable-option-card"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={dest.image} alt={dest.city} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800 }}>{dest.city}, {dest.country}</h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Approx. Cost: ₹{dest.cost.toLocaleString('en-IN')} INR</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="form-label">Days:</span>
                        <input
                          type="number"
                          min={1}
                          value={dest.days}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setDestinations(prev => prev.map(d => d.id === dest.id ? { ...d, days: val } : d));
                          }}
                          className="form-input-control"
                          style={{ width: '70px', height: '38px', padding: '0 0.5rem' }}
                        />
                      </div>
                      <button onClick={() => handleRemoveDestination(dest.id)} className="btn-outline-cta" style={{ padding: '0.5rem', color: '#E5484D' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: PREFERENCES */}
          {currentStep === 3 && (
            <div>
              <h3 className="card-section-title">Step 3: Travel Preferences & Style</h3>
              
              <div className="form-field-group">
                <label className="form-label">Budget Range</label>
                <div className="option-cards-grid">
                  {(['Budget', 'Moderate', 'Premium', 'Luxury'] as const).map((level) => (
                    <div
                      key={level}
                      className={`selectable-option-card ${budgetLevel === level ? 'selected' : ''}`}
                      onClick={() => setBudgetLevel(level)}
                    >
                      <DollarSign size={20} style={{ color: 'var(--color-sunset-orange)', marginBottom: '0.4rem' }} />
                      <div className="option-title">{level}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-field-group" style={{ marginTop: '2rem' }}>
                <label className="form-label">Select Your Travel Interests</label>
                <div className="option-cards-grid">
                  {AVAILABLE_INTERESTS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <div
                        key={interest}
                        className={`selectable-option-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleInterest(interest)}
                      >
                        <Sparkles size={16} style={{ marginBottom: '0.2rem', color: isSelected ? '#FF7A45' : 'var(--text-secondary)' }} />
                        <div className="option-title">{interest}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & CREATE */}
          {currentStep === 4 && (
            <div>
              <h3 className="card-section-title">Step 4: Review Trip Summary</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div>
                  <div style={{ borderRadius: '20px', overflow: 'hidden', height: '180px', marginBottom: '1.5rem', position: 'relative' }}>
                    <img src={coverImage} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(16,21,47,0.8), transparent)' }}></div>
                    <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem', color: '#ffffff' }}>
                      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800 }}>{name}</h2>
                      <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>{description}</p>
                    </div>
                  </div>

                  <div className="route-visual-bar">
                    <span className="form-label">Full Route:</span>
                    {destinations.map((d, idx) => (
                      <React.Fragment key={d.id}>
                        <span className="route-stop-pill">{d.city}</span>
                        {idx < destinations.length - 1 && <span className="route-arrow">→</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="form-grid-2col" style={{ marginTop: '1.5rem' }}>
                    <div>
                      <span className="form-label">Dates & Duration:</span>
                      <p style={{ fontWeight: 700 }}>{startDate} to {endDate}</p>
                    </div>
                    <div>
                      <span className="form-label">Travelers:</span>
                      <p style={{ fontWeight: 700 }}>{travelers} Guests ({tripType})</p>
                    </div>
                  </div>
                </div>

                <div className="budget-metric-card" style={{ background: 'var(--bg-primary)' }}>
                  <span className="metric-label">Estimated Budget</span>
                  <div className="metric-val" style={{ color: 'var(--color-sunset-orange)' }}>
                    ₹{(totalCalculatedCost + 15000).toLocaleString('en-IN')}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Includes estimated stays, flights, and activities across {destinations.length} destinations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Footer Controls */}
          <div className="wizard-footer-actions">
            {currentStep > 1 ? (
              <button onClick={() => setCurrentStep((s) => s - 1)} className="btn-outline-cta">
                <ArrowLeft size={16} /> Previous Step
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 4 ? (
              <button onClick={() => setCurrentStep((s) => s + 1)} className="btn-gradient-cta">
                Next Step <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={handleCreateTripSubmit} className="btn-gradient-cta">
                Create & View Itinerary <Check size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
