import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Filter, ArrowRight, Compass } from 'lucide-react';
import { EXPLORE_DESTINATIONS_DATA } from '../data/exploreData';
import '../styles/Modules.css';

export const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedStyle, setSelectedStyle] = useState<string>('All');
  const [maxBudget, setMaxBudget] = useState<number>(50000);

  const filteredDestinations = EXPLORE_DESTINATIONS_DATA.filter((dest) => {
    const matchesSearch =
      dest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRegion = selectedRegion === 'All' || dest.region === selectedRegion;
    const matchesStyle = selectedStyle === 'All' || dest.travelStyle === selectedStyle;
    const matchesBudget = dest.costEstimate <= maxBudget;

    return matchesSearch && matchesRegion && matchesStyle && matchesBudget;
  });

  return (
    <div className="module-page-container">
      <div className="container">
        {/* Banner */}
        <div className="module-header-banner">
          <span className="module-eyebrow">
            <Compass size={16} /> DESTINATION DISCOVERY
          </span>
          <h1 className="module-title">Explore World Destinations</h1>
          <p className="module-subtitle">
            Filter multi-city destinations by region, travel style, ratings, and estimated budget indices.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="itinerary-header-card shadow-subtle" style={{ padding: '1.5rem 2rem', marginBottom: '2.5rem' }}>
          <div className="form-grid-2col" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'flex-end' }}>
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Search size={14} /> Search City, Country, or Tag
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input-control"
                placeholder="e.g. Paris, Japan, Sunset, Beaches..."
              />
            </div>

            <div>
              <label className="form-label">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="form-select-control"
              >
                <option value="All">All Regions</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="Middle East">Middle East</option>
                <option value="Americas">Americas</option>
              </select>
            </div>

            <div>
              <label className="form-label">Travel Style</label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="form-select-control"
              >
                <option value="All">All Styles</option>
                <option value="Relaxed">Relaxed</option>
                <option value="Balanced">Balanced</option>
                <option value="Adventure">Adventure</option>
                <option value="Cultural">Cultural</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>

            <div>
              <label className="form-label">Max Est. Budget: ₹{maxBudget.toLocaleString('en-IN')}</label>
              <input
                type="range"
                min={15000}
                max={50000}
                step={2500}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                style={{ width: '100%', height: '38px', accentColor: 'var(--color-sunset-orange)' }}
              />
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {filteredDestinations.length === 0 ? (
          <div className="empty-activities-card shadow-subtle" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
            <Filter size={42} style={{ color: 'var(--color-sunset-orange)', marginBottom: '1rem' }} />
            <h3>No Destinations Match Your Filter</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try broadening your budget slider or clearing your search term.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('All');
                setSelectedStyle('All');
                setMaxBudget(50000);
              }}
              className="btn-gradient-cta"
              style={{ marginTop: '1rem' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
            {filteredDestinations.map((dest) => (
              <div key={dest.id} className="post-card shadow-subtle" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: '220px' }}>
                  <img src={dest.image} alt={dest.city} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', padding: '0.3rem 0.75rem', borderRadius: '9999px', color: '#fff', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Star size={14} fill="#FFD166" color="#FFD166" /> {dest.rating} ({dest.reviewsCount})
                  </div>
                  <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', color: '#ffffff' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800 }}>{dest.city}</h3>
                    <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>📍 {dest.country} • {dest.region}</span>
                  </div>
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
                    {dest.description}
                  </p>

                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    {dest.tags.map((t) => (
                      <span key={t} className="category-pill" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block' }}>Avg. Stop Cost</span>
                      <strong style={{ fontSize: '1.15rem', color: 'var(--color-sunset-orange)', fontFamily: 'var(--font-heading)' }}>
                        ₹{dest.costEstimate.toLocaleString('en-IN')}
                      </strong>
                    </div>

                    <Link to="/trips/create" className="btn-gradient-cta" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                      Add to Trip <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
