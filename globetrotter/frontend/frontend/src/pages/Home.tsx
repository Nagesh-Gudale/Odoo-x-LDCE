import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Map, 
  Calendar, 
  Wallet, 
  Users, 
  Search, 
  ArrowRight, 
  Star, 
  Heart, 
  ChevronRight, 
  Plane,
  MapPin
} from 'lucide-react';
import { Button, StatCard, Badge } from '../components/Common';

// Import local images exactly
import heroImage from "../assets/hero-santorini.jpg";
import tokyoImage from "../assets/tokyo.jpg";
import santoriniImage from "../assets/santorini.jpg";
import baliImage from "../assets/bali.jpg";
import dubaiImage from "../assets/dubai.jpg";

import './Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'multi' | 'explore' | 'activities'>('multi');
  const [likedDestinations, setLikedDestinations] = useState<{ [key: string]: boolean }>({});

  const toggleLike = (city: string) => {
    setLikedDestinations({
      ...likedDestinations,
      [city]: !likedDestinations[city]
    });
  };

  const popularDestinations = [
    {
      id: 'tokyo',
      imageUrl: tokyoImage,
      badge: 'Trending',
      city: 'Tokyo',
      country: 'Japan',
      category: 'Modern • Culture • Food',
      cost: '₹1,20,000',
      rating: 4.8,
    },
    {
      id: 'santorini',
      imageUrl: santoriniImage,
      badge: 'Popular',
      city: 'Santorini',
      country: 'Greece',
      category: 'Beaches • Views • Relaxation',
      cost: '₹1,10,000',
      rating: 4.9,
    },
    {
      id: 'bali',
      imageUrl: baliImage,
      badge: 'Hot',
      city: 'Bali',
      country: 'Indonesia',
      category: 'Nature • Adventure • Culture',
      cost: '₹80,000',
      rating: 4.7,
    },
    {
      id: 'dubai',
      imageUrl: dubaiImage,
      badge: 'New',
      city: 'Dubai',
      country: 'UAE',
      category: 'Luxury • Shopping • Adventure',
      cost: '₹1,00,000',
      rating: 4.6,
    },
  ];

  return (
    <div className="home-page-container">
      {/* Cinematic Sunset Hero Section */}
      <section className="hero-section-cinematic">
        <div className="hero-background-wrapper">
          <img src={heroImage} alt="Santorini Sunset" className="hero-bg-img" />
          <div className="hero-gradient-overlay"></div>
        </div>

        <div className="container hero-content-wrapper">
          <div className="hero-left-content">
            <h1 className="hero-title-main animate-slide-up">
              Plan. Explore.<br />
              <span className="text-gradient">Experience More.</span>
            </h1>
            <p className="hero-desc-subtitle animate-slide-up">
              GlobeTrotter helps you plan multi-city trips, discover amazing places, manage expenses, and share unforgettable journeys.
            </p>
            <div className="hero-buttons-wrapper animate-slide-up">
              <Button variant="sunset" onClick={() => navigate('/trips/create')}>
                Plan Your Trip <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </Button>
              <a href="#how-it-works" className="btn-play-video">
                <span className="btn-play-symbol">▶</span> See How It Works
              </a>
            </div>
          </div>
        </div>

        {/* Dotted Airplane Flight Path Graphic */}
        <div className="flight-path-container">
          <svg className="flight-path-svg" viewBox="0 0 1440 200" fill="none">
            <path 
              id="airplane-flight-line"
              d="M 50 150 Q 300 30 720 120 T 1390 100" 
              stroke="rgba(255, 255, 255, 0.25)" 
              strokeWidth="2" 
              strokeDasharray="6 6"
            />
          </svg>
          <div className="flight-airplane-symbol">✈</div>
        </div>
      </section>

      {/* Separate Search Bar Section */}
      <section className="trip-search-section">
        <div className="trip-search-container container">
          <div className="search-glassmorphism-card shadow-medium">
            <div className="search-tabs">
              <button 
                className={`search-tab ${activeTab === 'multi' ? 'active' : ''}`}
                onClick={() => setActiveTab('multi')}
              >
                <Plane size={16} />
                <span>Multi-City Trip</span>
              </button>
              <button 
                className={`search-tab ${activeTab === 'explore' ? 'active' : ''}`}
                onClick={() => setActiveTab('explore')}
              >
                <MapPin size={16} />
                <span>Explore Places</span>
              </button>
              <button 
                className={`search-tab ${activeTab === 'activities' ? 'active' : ''}`}
                onClick={() => setActiveTab('activities')}
              >
                <Star size={16} />
                <span>Things to Do</span>
              </button>
            </div>

            <div className="search-form">
              <div className="search-input-field">
                <div className="field-label-wrapper">
                  <MapPin size={14} className="field-icon" />
                  <label>From</label>
                </div>
                <input type="text" placeholder="Where do you start?" />
              </div>
              
              <div className="search-input-field">
                <div className="field-label-wrapper">
                  <MapPin size={14} className="field-icon" />
                  <label>To</label>
                </div>
                <input type="text" placeholder="Add destination" />
              </div>

              <div className="search-input-field">
                <div className="field-label-wrapper">
                  <Calendar size={14} className="field-icon" />
                  <label>Dates</label>
                </div>
                <input 
                  type="text" 
                  placeholder="Select dates" 
                  onFocus={(e) => e.target.type = 'date'} 
                  onBlur={(e) => e.target.type = 'text'} 
                />
              </div>

              <div className="search-input-field">
                <div className="field-label-wrapper">
                  <Users size={14} className="field-icon" />
                  <label>Travelers</label>
                </div>
                <input type="text" placeholder="2 Travelers" />
              </div>

              <button className="search-action-btn" onClick={() => navigate('/search/cities')}>
                <Search size={18} />
                <span>Search Trips</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Feature Strip */}
      <section className="feature-strip-section">
        <div className="container">
          <div className="feature-strip-wrapper shadow-subtle">
            <div className="strip-item">
              <div className="strip-icon-circle bg-lavender">
                <Map size={18} />
              </div>
              <div className="strip-content">
                <h4>Multi-City Planning</h4>
                <p>Create, organize, and manage your multi-city itineraries with ease.</p>
              </div>
            </div>

            <div className="strip-item">
              <div className="strip-icon-circle bg-peach">
                <Wallet size={18} />
              </div>
              <div className="strip-content">
                <h4>Budget Friendly</h4>
                <p>Estimate costs, track expenses, and stay within your budget.</p>
              </div>
            </div>

            <div className="strip-item">
              <div className="strip-icon-circle bg-pink">
                <Calendar size={18} />
              </div>
              <div className="strip-content">
                <h4>Smart Itinerary</h4>
                <p>Day-wise plans, calendar view, and timeline to keep your trip on track.</p>
              </div>
            </div>

            <div className="strip-item">
              <div className="strip-icon-circle bg-mint">
                <Users size={18} />
              </div>
              <div className="strip-content">
                <h4>Share & Collaborate</h4>
                <p>Share trips with friends or collaborate to plan together.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="popular-destinations-section">
        <div className="container">
          <div className="destinations-section-header">
            <div className="header-left">
              <Badge text="Trending Inspiration" variant="pink" />
              <h2>Popular Destinations</h2>
              <p>Discover inspiring destinations and build your perfect route.</p>
            </div>
            <div className="header-right">
              <Link to="/search/cities" className="btn-view-all-dest">
                View All Destinations <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="destinations-carousel-wrapper">
            <div className="destinations-grid-carousel">
              {popularDestinations.map((dest) => (
                <div key={dest.id} className="premium-dest-card">
                  <div className="dest-card-image-box">
                    <img src={dest.imageUrl} alt={`${dest.city}, ${dest.country}`} className="dest-card-img" />
                    <div className="dest-card-gradient-overlay"></div>
                    
                    <span className="dest-badge-top-left">
                      <Badge text={dest.badge} variant={dest.badge === 'Trending' ? 'orange' : dest.badge === 'Popular' ? 'purple' : dest.badge === 'Hot' ? 'coral' : 'success'} />
                    </span>
                    
                    <button 
                      className={`dest-heart-btn ${likedDestinations[dest.city] ? 'liked' : ''}`}
                      onClick={() => toggleLike(dest.city)}
                      aria-label="Like destination"
                    >
                      <Heart size={16} className="heart-icon-svg" />
                    </button>

                    <div className="dest-title-overlay">
                      <h3>{dest.city}, {dest.country}</h3>
                      <p className="dest-cat-text">{dest.category}</p>
                    </div>
                  </div>

                  <div className="dest-card-details-box">
                    <div className="dest-metric">
                      <span className="metric-lbl">Estimated Cost</span>
                      <span className="metric-val">{dest.cost}</span>
                    </div>
                    <div className="dest-rating-box">
                      <Star size={14} className="star-icon-fill" />
                      <span>{dest.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Right Arrow Control */}
            <button className="carousel-control-btn right-arrow" onClick={() => navigate('/search/cities')} aria-label="Next destinations">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <div className="section-header-centered">
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
