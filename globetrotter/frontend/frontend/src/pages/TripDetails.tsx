import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, DollarSign, Share2, Edit3, MapPin, CheckCircle2 } from 'lucide-react';
import { Badge, Button, Card } from '../components/Common';
import './TripDetails.css';

interface Stop {
  city: string;
  country: string;
  duration: string;
  dates: string;
}

interface Activity {
  name: string;
  city: string;
  cost: string;
}

interface Trip {
  name: string;
  coverUrl: string;
  dates: string;
  travelers: number;
  budget: string;
  spent: string;
  progress: number;
  description: string;
  stops: Stop[];
  activities: Activity[];
}

export const TripDetails: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();

  // Mock database lookup for trips
  const tripsData: { [key: string]: Trip } = {
    'european-explorer': {
      name: 'European Explorer',
      coverUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
      dates: 'Aug 25 - Sep 10, 2026',
      travelers: 2,
      budget: '₹3,50,000',
      spent: '₹1,57,500',
      progress: 45,
      description: 'Explore the highlights of Europe, visiting historical landmarks in Rome, museums in Paris, and enjoying scenic walks in London.',
      stops: [
        { city: 'Rome', country: 'Italy', duration: '5 Days', dates: 'Aug 25 - Aug 29' },
        { city: 'Paris', country: 'France', duration: '6 Days', dates: 'Aug 30 - Sep 04' },
        { city: 'London', country: 'United Kingdom', duration: '6 Days', dates: 'Sep 05 - Sep 10' },
      ],
      activities: [
        { name: 'Colosseum & Forum Guided Tour', city: 'Rome', cost: '₹6,500' },
        { name: 'Louvre Museum Admission', city: 'Paris', cost: '₹2,500' },
        { name: 'Eiffel Tower Summit Access', city: 'Paris', cost: '₹4,000' },
        { name: 'Warner Bros. Studio Tour (Harry Potter)', city: 'London', cost: '₹8,500' },
      ],
    },
    'asian-heritage': {
      name: 'Asian Heritage Tour',
      coverUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      dates: 'Oct 12 - Oct 28, 2026',
      travelers: 3,
      budget: '₹4,20,000',
      spent: '₹63,000',
      progress: 15,
      description: 'Experience traditional culture alongside modern technology, checking out ancient shrines and neon-lit streets.',
      stops: [
        { city: 'Tokyo', country: 'Japan', duration: '6 Days', dates: 'Oct 12 - Oct 17' },
        { city: 'Kyoto', country: 'Japan', duration: '6 Days', dates: 'Oct 18 - Oct 23' },
        { city: 'Osaka', country: 'Japan', duration: '5 Days', dates: 'Oct 24 - Oct 28' },
      ],
      activities: [
        { name: 'TeamLab Planets Entry Ticket', city: 'Tokyo', cost: '₹3,200' },
        { name: 'Fushimi Inari Shrine & Nara Tour', city: 'Kyoto', cost: '₹5,500' },
        { name: 'Osaka Castle & Food Street Tour', city: 'Osaka', cost: '₹4,500' },
      ],
    },
    'tropical-getaway': {
      name: 'Tropical Getaway',
      coverUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      dates: 'May 02 - May 10, 2026',
      travelers: 2,
      budget: '₹1,80,000',
      spent: '₹1,62,000',
      progress: 90,
      description: 'A relaxing trip to explore Bali’s tropical beaches and the scenic cliffs of Nusa Penida.',
      stops: [
        { city: 'Bali', country: 'Indonesia', duration: '5 Days', dates: 'May 02 - May 06' },
        { city: 'Nusa Penida', country: 'Indonesia', duration: '3 Days', dates: 'May 07 - May 10' },
      ],
      activities: [
        { name: 'Ubud Jungle Swing & Rice Terraces', city: 'Bali', cost: '₹2,500' },
        { name: 'Snorkeling with Manta Rays', city: 'Nusa Penida', cost: '₹4,000' },
      ],
    },
  };

  const currentTrip = tripsData[tripId || ''] || tripsData['european-explorer'];

  return (
    <div className="trip-details-page container">
      <button onClick={() => navigate('/trips')} className="btn-back">
        <ArrowLeft size={16} /> Back to Trips
      </button>

      {/* Cover Image & Header Header */}
      <div className="trip-header-card shadow-subtle">
        <div className="cover-img-wrapper">
          <img src={currentTrip.coverUrl} alt={currentTrip.name} className="trip-cover-img" />
          <div className="cover-overlay"></div>
          <div className="cover-content">
            <h2>{currentTrip.name}</h2>
            <p className="cover-desc">{currentTrip.description}</p>
          </div>
        </div>

        <div className="trip-summary-bar">
          <div className="summary-col">
            <Calendar size={18} className="summary-icon" />
            <div>
              <span className="summary-label">Dates</span>
              <span className="summary-val">{currentTrip.dates}</span>
            </div>
          </div>
          <div className="summary-col">
            <Users size={18} className="summary-icon" />
            <div>
              <span className="summary-label">Travelers</span>
              <span className="summary-val">{currentTrip.travelers} Persons</span>
            </div>
          </div>
          <div className="summary-col">
            <DollarSign size={18} className="summary-icon" />
            <div>
              <span className="summary-label">Total Budget</span>
              <span className="summary-val">{currentTrip.budget}</span>
            </div>
          </div>
          <div className="summary-actions">
            <Button variant="secondary" className="btn-icon-only" aria-label="Share Trip">
              <Share2 size={16} />
            </Button>
            <Button variant="sunset">
              <Edit3 size={16} style={{ marginRight: '8px' }} /> Edit
            </Button>
          </div>
        </div>
      </div>

      <div className="details-layout-grid">
        {/* Left Side: Route stops and Activities */}
        <div className="details-left">
          {/* Stops List */}
          <Card className="stops-card">
            <div className="card-title-wrapper">
              <Badge text="Travel Map" variant="pink" />
              <h3>Itinerary Stops</h3>
            </div>
            <div className="stops-list">
              {currentTrip.stops.map((stop: Stop, idx: number) => (
                <div key={idx} className="stop-row-item">
                  <div className="stop-marker">
                    <div className="marker-dot"></div>
                    {idx < currentTrip.stops.length - 1 && <div className="marker-line"></div>}
                  </div>
                  <div className="stop-details">
                    <div className="stop-header">
                      <h4>{stop.city}, {stop.country}</h4>
                      <Badge text={stop.duration} variant="purple" />
                    </div>
                    <p className="stop-dates">{stop.dates}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Activities List */}
          <Card className="activities-card" style={{ marginTop: '2rem' }}>
            <div className="card-title-wrapper">
              <Badge text="Experiences" variant="orange" />
              <h3>Scheduled Activities</h3>
            </div>
            <div className="activities-table-wrapper">
              <table className="activities-table">
                <thead>
                  <tr>
                    <th>Activity</th>
                    <th>City</th>
                    <th className="text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTrip.activities.map((act: Activity, idx: number) => (
                    <tr key={idx}>
                      <td className="act-name-cell">
                        <CheckCircle2 size={16} className="act-check-icon" />
                        <span>{act.name}</span>
                      </td>
                      <td>{act.city}</td>
                      <td className="text-right font-semibold">{act.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Side: Budget details and Map placeholder */}
        <div className="details-right">
          {/* Budget Widget */}
          <Card className="budget-widget-card">
            <h3>Budget Breakdown</h3>
            <div className="budget-gauge">
              <div className="gauge-circle">
                <span className="gauge-percentage">{currentTrip.progress}%</span>
                <span className="gauge-label">Used</span>
              </div>
            </div>
            <div className="budget-metrics">
              <div className="metric-row">
                <span>Budget Allocated</span>
                <strong>{currentTrip.budget}</strong>
              </div>
              <div className="metric-row">
                <span>Total Spent</span>
                <strong>{currentTrip.spent}</strong>
              </div>
              <div className="metric-row border-top">
                <span>Remaining</span>
                <strong className="color-primary">
                  {parseInt(currentTrip.progress) <= 100 ? 'Within Budget' : 'Over Budget'}
                </strong>
              </div>
            </div>
          </Card>

          {/* Interactive Placeholder Map */}
          <Card className="map-placeholder-card" style={{ marginTop: '2rem' }}>
            <h3>Route Visualizer</h3>
            <div className="mock-map">
              <div className="mock-map-graphic">
                <MapPin className="map-pin pin-1 animate-bounce" />
                <MapPin className="map-pin pin-2 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <MapPin className="map-pin pin-3 animate-bounce" style={{ animationDelay: '0.4s' }} />
                <svg className="map-path-svg">
                  <path d="M 50 120 Q 150 40 250 140 T 350 80" fill="none" stroke="var(--color-sunset-pink)" strokeWidth="3" strokeDasharray="6" />
                </svg>
              </div>
              <p className="map-caption">Interactive trip planner and map builder will load here.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
