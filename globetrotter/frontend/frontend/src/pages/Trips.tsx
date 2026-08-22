import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Compass } from 'lucide-react';
import { Button, TripCard, Badge } from '../components/Common';
import './Trips.css';

export const Trips: React.FC = () => {
  const navigate = useNavigate();

  const myTrips = [
    {
      id: 'european-explorer',
      coverUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80',
      name: 'European Explorer',
      cities: ['Rome', 'Paris', 'London'],
      dates: 'Aug 25 - Sep 10, 2026',
      travelers: 2,
      budget: '₹3,50,000',
      progress: 45,
      status: 'upcoming',
    },
    {
      id: 'asian-heritage',
      coverUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
      name: 'Asian Heritage Tour',
      cities: ['Tokyo', 'Kyoto', 'Osaka'],
      dates: 'Oct 12 - Oct 28, 2026',
      travelers: 3,
      budget: '₹4,20,000',
      progress: 15,
      status: 'upcoming',
    },
    {
      id: 'tropical-getaway',
      coverUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
      name: 'Tropical Getaway',
      cities: ['Bali', 'Nusa Penida'],
      dates: 'May 02 - May 10, 2026',
      travelers: 2,
      budget: '₹1,80,000',
      progress: 90,
      status: 'completed',
    },
  ];

  const upcomingTrips = myTrips.filter(t => t.status === 'upcoming');
  const completedTrips = myTrips.filter(t => t.status === 'completed');

  return (
    <div className="trips-page container">
      <div className="trips-header">
        <div>
          <h2>My Trips</h2>
          <p className="subtitle">Manage and review your upcoming and past itineraries</p>
        </div>
        <Button variant="sunset" onClick={() => navigate('/trips/create')}>
          <Plus size={16} style={{ marginRight: '8px' }} /> Create New Trip
        </Button>
      </div>

      {upcomingTrips.length > 0 && (
        <div className="trips-section">
          <div className="section-title-wrapper">
            <Badge text="Upcoming Journeys" variant="orange" />
            <h3 className="section-title">Upcoming Trips</h3>
          </div>
          <div className="trips-grid">
            {upcomingTrips.map(trip => (
              <TripCard 
                key={trip.id} 
                {...trip} 
                onView={() => navigate(`/trips/${trip.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {completedTrips.length > 0 && (
        <div className="trips-section" style={{ marginTop: '3rem' }}>
          <div className="section-title-wrapper">
            <Badge text="Past Adventures" variant="purple" />
            <h3 className="section-title">Completed Trips</h3>
          </div>
          <div className="trips-grid">
            {completedTrips.map(trip => (
              <TripCard 
                key={trip.id} 
                {...trip} 
                onView={() => navigate(`/trips/${trip.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {myTrips.length === 0 && (
        <div className="no-trips-card">
          <Compass size={48} className="no-trips-icon" />
          <h3>No trips planned yet</h3>
          <p>Start planning your first multi-city adventure with GlobeTrotter today!</p>
          <Button variant="sunset" onClick={() => navigate('/trips/create')}>
            Start Planning
          </Button>
        </div>
      )}
    </div>
  );
};
