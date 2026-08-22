import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, DollarSign, Share2, MapPin, CheckCircle2, ListChecks } from 'lucide-react';
import { Button, Card } from '../components/Common';
import { useTrip } from '../context/useTrip';
import type { Trip, ItineraryItem, Expense, DestinationStop } from '../data/tripData';
import './TripDetails.css';

export const TripDetails: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { trips, itineraryItems, expenses } = useTrip();

  const matchedTrip = trips.find((t: Trip) => t.id === tripId) || trips[0];
  const tripItems = itineraryItems.filter((i: ItineraryItem) => i.tripId === matchedTrip.id);
  const tripExpenses = expenses.filter((e: Expense) => e.tripId === matchedTrip.id);

  const totalSpent = tripExpenses.reduce((acc: number, curr: Expense) => acc + curr.amount, 0);
  const totalBudget = matchedTrip.totalBudget || 85000;
  const progress = Math.min(100, Math.round((totalSpent / totalBudget) * 100));

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Shareable trip link copied to clipboard!');
  };

  return (
    <div className="trip-details-page">
      <div className="container">
        {/* Navigation Bar */}
        <div className="trip-details-nav">
          <Button variant="secondary" onClick={() => navigate('/trips')} className="back-btn">
            <ArrowLeft size={16} /> Back to Trips
          </Button>
          <div className="nav-actions">
            <Button variant="secondary" onClick={handleShare} className="share-btn">
              <Share2 size={16} /> Share
            </Button>
            <Link to={`/trips/${matchedTrip.id}/itinerary`}>
              <Button variant="primary">
                <ListChecks size={16} /> Open Itinerary Builder
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="trip-hero shadow-medium">
          <img src={matchedTrip.coverImage} alt={matchedTrip.name} className="hero-img" />
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-badge">
              <span className="category-pill" style={{ background: '#FF7A45', color: '#ffffff' }}>
                {matchedTrip.status.toUpperCase()}
              </span>
              <span className="category-pill" style={{ background: '#4BA3E3', color: '#ffffff' }}>
                {matchedTrip.visibility.toUpperCase()}
              </span>
            </div>
            <h1 className="hero-title">{matchedTrip.name}</h1>
            <p className="hero-desc">{matchedTrip.description}</p>
            <div className="hero-meta">
              <div className="meta-item">
                <Calendar size={16} /> {matchedTrip.startDate} - {matchedTrip.endDate}
              </div>
              <div className="meta-item">
                <Users size={16} /> {matchedTrip.travelers} Travelers ({matchedTrip.tripType})
              </div>
              <div className="meta-item">
                <MapPin size={16} /> {matchedTrip.destinations.length} Destinations
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="trip-grid-layout">
          {/* Main Details Column */}
          <div className="main-col">
            {/* Route Stops Section */}
            <Card className="section-card shadow-subtle">
              <h2 className="section-title">Destinations & Route</h2>
              <div className="stops-list">
                {matchedTrip.destinations.map((stop: DestinationStop, index: number) => (
                  <div key={stop.id || index} className="stop-card">
                    <div className="stop-num">{index + 1}</div>
                    <div className="stop-info">
                      <h3>{stop.city}, {stop.country}</h3>
                      <p>{stop.days} Days • Approx ₹{stop.cost.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Activities Preview Section */}
            <Card className="section-card shadow-subtle">
              <div className="section-header-flex">
                <h2 className="section-title">Scheduled Activities</h2>
                <Link to={`/trips/${matchedTrip.id}/itinerary`} style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-sunset-orange)' }}>
                  Manage Timeline →
                </Link>
              </div>
              
              {tripItems.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No activities scheduled yet. Open the Itinerary Builder to add items.</p>
              ) : (
                <div className="activities-list">
                  {tripItems.map((act: ItineraryItem) => (
                    <div key={act.id} className="activity-item">
                      <CheckCircle2 size={18} className="act-icon" />
                      <div className="act-details">
                        <h4>{act.title}</h4>
                        <p>Day {act.dayNumber} at {act.time} • {act.destination}</p>
                      </div>
                      <div className="act-cost">₹{act.cost.toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className="sidebar-col">
            {/* Budget Summary Card */}
            <Card className="section-card shadow-medium budget-card">
              <h2 className="section-title">Budget Overview</h2>
              <div className="budget-row">
                <span className="b-label">Total Budget</span>
                <span className="b-val">₹{totalBudget.toLocaleString('en-IN')}</span>
              </div>
              <div className="budget-row">
                <span className="b-label">Planned Spent</span>
                <span className="b-val spent">₹{totalSpent.toLocaleString('en-IN')}</span>
              </div>

              {/* Progress Bar */}
              <div className="progress-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="progress-labels">
                  <span>{progress}% Allocated</span>
                  <span>₹{(totalBudget - totalSpent).toLocaleString('en-IN')} Remaining</span>
                </div>
              </div>

              <Link to={`/trips/${matchedTrip.id}/budget`} style={{ width: '100%', marginTop: '1.25rem', display: 'block' }}>
                <Button variant="secondary" style={{ width: '100%' }}>
                  <DollarSign size={16} /> Manage Budget & Expenses
                </Button>
              </Link>
            </Card>

            {/* Quick Actions Card */}
            <Card className="section-card shadow-subtle">
              <h2 className="section-title">Quick Navigation</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to={`/trips/${matchedTrip.id}/itinerary`}>
                  <Button variant="secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                    🗓️ Open Itinerary Builder
                  </Button>
                </Link>
                <Link to={`/trips/${matchedTrip.id}/budget`}>
                  <Button variant="secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                    💰 Budget & Expenses
                  </Button>
                </Link>
                <Link to="/calendar">
                  <Button variant="secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                    📅 View on Travel Calendar
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
