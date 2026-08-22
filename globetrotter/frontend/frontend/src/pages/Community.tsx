import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, MessageSquare } from 'lucide-react';
import { Badge, Button, Card } from '../components/Common';
import './Community.css';

export const Community: React.FC = () => {
  const navigate = useNavigate();

  const sharedTrips = [
    {
      id: 'european-explorer',
      user: 'Ishwari Nandargi',
      avatar: 'I',
      imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80',
      name: 'Best of Western Europe',
      destinations: 'Rome ➔ Paris ➔ London',
      duration: '17 Days',
      likes: 342,
      views: '2.5K',
      comments: 24,
    },
    {
      id: 'asian-heritage',
      user: 'Pratik Rathod',
      avatar: 'P',
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
      name: 'Cultural Tour of Japan',
      destinations: 'Tokyo ➔ Kyoto ➔ Osaka',
      duration: '16 Days',
      likes: 512,
      views: '4.1K',
      comments: 48,
    },
    {
      id: 'tropical-getaway',
      user: 'Archita Thakur',
      avatar: 'A',
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
      name: 'Bali Getaway & Snorkeling',
      destinations: 'Bali ➔ Nusa Penida',
      duration: '8 Days',
      likes: 215,
      views: '1.8K',
      comments: 12,
    },
  ];

  return (
    <div className="community-page container">
      <div className="community-header">
        <h2>Travel Community</h2>
        <p className="subtitle">Discover pre-planned multi-city routes and itineraries shared by other travelers</p>
      </div>

      <div className="community-tabs">
        <Badge text="Popular Trips" variant="orange" />
        <Badge text="Recently Shared" variant="purple" />
        <Badge text="Trending Destinations" variant="pink" />
      </div>

      <div className="community-grid">
        {sharedTrips.map((trip) => (
          <Card key={trip.id} className="community-card">
            <div className="comm-user-info">
              <div className="comm-avatar">{trip.avatar}</div>
              <div>
                <h4>{trip.user}</h4>
                <p className="comm-time">Shared 2 days ago</p>
              </div>
            </div>

            <div className="comm-image-wrapper">
              <img src={trip.imageUrl} alt={trip.name} className="comm-img" />
              <div className="comm-badge-overlay">
                <Badge text={trip.duration} variant="purple" />
              </div>
            </div>

            <div className="comm-details">
              <h3 className="comm-title">{trip.name}</h3>
              <p className="comm-route">{trip.destinations}</p>

              <div className="comm-stats-row">
                <span className="comm-stat">
                  <Heart size={14} className="stat-icon-like" />
                  {trip.likes} Likes
                </span>
                <span className="comm-stat">
                  <Eye size={14} />
                  {trip.views} Views
                </span>
                <span className="comm-stat">
                  <MessageSquare size={14} />
                  {trip.comments} Comments
                </span>
              </div>

              <div className="comm-actions">
                <Button variant="sunset" onClick={() => navigate(`/trips/${trip.id}`)} className="w-full">
                  View Itinerary
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
