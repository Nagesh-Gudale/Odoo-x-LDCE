import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Calendar, DollarSign, Users, Search, ArrowRight } from 'lucide-react';
import { Button, StatCard, DestinationCard, Badge } from '../components/Common';
import heroImg from '../assets/hero.png';
import './Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'multi' | 'explore' | 'activities'>('multi');

  const popularDestinations = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
      badge: 'Beaches',
      city: 'Santorini',
      country: 'Greece',
      category: 'Beaches • Views • Relaxation',
      cost: '₹1,10,000',
      rating: 4.9,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?auto=format&fit=crop&w=600&q=80',
      badge: 'Coastal',
      city: 'Amalfi Coast',
      country: 'Italy',
      category: 'Coastal • Scenic • Luxury',
      cost: '₹1,40,000',
      rating: 4.8,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
      badge: 'Culture',
      city: 'Kyoto',
      country: 'Japan',
      category: 'Culture • Temples • History',
      cost: '₹95,000',
      rating: 4.9,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
      badge: 'Romance',
      city: 'Paris',
      country: 'France',
      category: 'Art • Romance • Food',
      cost: '₹1,20,000',
      rating: 4.7,
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <h1 className="hero-headline">
              Plan. Explore.<br />
              <span className="text-gradient">Experience More.</span>
            </h1>
            <p className="hero-description">
              Plan multi-city trips, discover amazing destinations, organize activities, manage your budget, and share your journey — all in one place.
            </p>
            <div className="hero-ctas">
              <Button variant="sunset" onClick={() => navigate('/trips/create')}>
                Plan Your Trip <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </Button>
              <a href="#how-it-works" className="btn-learn-more">See How It Works</a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="image-wrapper">
              <img src={heroImg} alt="Travel Destinations Graphic" className="hero-img-main" />
              <div className="floating-card route-card">
                <span className="route-dot">📍 Rome</span>
                <span className="route-line">✈</span>
                <span className="route-dot">📍 Paris</span>
                <span className="route-line">✈</span>
                <span className="route-dot">📍 London</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Trip Search Panel Section */}
      <section className="search-section">
        <div className="container">
          <div className="search-panel shadow-medium">
            <div className="search-tabs">
              <button 
                className={`search-tab ${activeTab === 'multi' ? 'active' : ''}`}
                onClick={() => setActiveTab('multi')}
              >
                ✈ Multi-City Trip
              </button>
              <button 
                className={`search-tab ${activeTab === 'explore' ? 'active' : ''}`}
                onClick={() => setActiveTab('explore')}
              >
                📍 Explore Places
              </button>
              <button 
                className={`search-tab ${activeTab === 'activities' ? 'active' : ''}`}
                onClick={() => setActiveTab('activities')}
              >
                ★ Things to Do
              </button>
            </div>

            <div className="search-fields">
              <div className="search-field">
                <label>From</label>
                <div className="field-input-wrapper">
                  <input type="text" placeholder="Where do you start?" />
                </div>
              </div>
              <div className="search-field">
                <label>To</label>
                <div className="field-input-wrapper">
                  <input type="text" placeholder="Add destination" />
                </div>
              </div>
              <div className="search-field">
                <label>Dates</label>
                <div className="field-input-wrapper">
                  <input type="text" placeholder="Select dates" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => e.target.type = 'text'} />
                </div>
              </div>
              <div className="search-field">
                <label>Travelers</label>
                <div className="field-input-wrapper">
                  <input type="text" placeholder="2 Travelers" />
                </div>
              </div>
              <button className="search-submit-btn" onClick={() => navigate('/search/cities')}>
                <Search size={18} />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <Badge text="Core Features" variant="coral" />
            <h2>Designed for Modern Travelers</h2>
            <p>Everything you need to craft the perfect multi-city journey without the planning stress.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card shadow-subtle">
              <div className="feature-icon-wrapper icon-lavender">
                <Map className="feature-icon" />
              </div>
              <h3>Multi-City Planning</h3>
              <p>Create, organize, and manage complex travel routes and stops with ease.</p>
            </div>

            <div className="feature-card shadow-subtle">
              <div className="feature-icon-wrapper icon-peach">
                <DollarSign className="feature-icon" />
              </div>
              <h3>Budget Friendly</h3>
              <p>Estimate costs and monitor daily expenditures. Stay notified if you go over budget.</p>
            </div>

            <div className="feature-card shadow-subtle">
              <div className="feature-icon-wrapper icon-pink">
                <Calendar className="feature-icon" />
              </div>
              <h3>Smart Itinerary</h3>
              <p>Organize days and activities with timeline and schedule cards.</p>
            </div>

            <div className="feature-card shadow-subtle">
              <div className="feature-icon-wrapper icon-mint">
                <Users className="feature-icon" />
              </div>
              <h3>Share & Collaborate</h3>
              <p>Invite friends to edit your plan, or share a read-only page with others.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <Badge text="Inspiration" variant="pink" />
            <h2>Popular Destinations</h2>
            <p>Discover top-rated cities and construct routes utilizing custom estimation averages.</p>
          </div>

          <div className="destinations-grid">
            {popularDestinations.map((dest, idx) => (
              <DestinationCard key={idx} {...dest} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <Badge text="Workflow" variant="purple" />
            <h2>How It Works</h2>
            <p>Six simple steps to transition from inspiration to your ultimate journey.</p>
          </div>

          <div className="steps-container">
            <div className="steps-timeline-line"></div>
            <div className="steps-grid">
              {[
                { num: '01', title: 'Discover', desc: 'Browse cities, reviews, and average costs.' },
                { num: '02', title: 'Plan', desc: 'Select travel dates and define stops.' },
                { num: '03', title: 'Organize', desc: 'Sort destinations and draft timelines.' },
                { num: '04', title: 'Budget', desc: 'Add activities and allocate expenses.' },
                { num: '05', title: 'Share', desc: 'Invite friends or export your dashboard.' },
                { num: '06', title: 'Travel', desc: 'Access your final plans on the go.' },
              ].map((step, idx) => (
                <div key={idx} className="step-item">
                  <div className="step-circle">{step.num}</div>
                  <h4 className="step-title">{step.title}</h4>
                  <p className="step-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Travel Statistics Section */}
      <section className="stats-section">
        <div className="container stats-grid">
          <StatCard value="10K+" label="Destinations" />
          <StatCard value="25K+" label="Trips Planned" />
          <StatCard value="15K+" label="Travelers" />
          <StatCard value="4.8" label="Average Rating" />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="container cta-box shadow-medium">
          <div className="cta-content">
            <h2>Your next adventure is waiting.</h2>
            <p>Plan your journey, discover new places, and make every trip unforgettable.</p>
            <Button variant="secondary" className="cta-btn" onClick={() => navigate('/trips/create')}>
              Start Planning <ArrowRight size={16} style={{ marginLeft: '8px' }} />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
