import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button, Input, Card } from '../components/Common';
import './CreateTrip.css';

export const CreateTrip: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [startingLocation, setStartingLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call and redirect back to trips listing
    navigate('/trips');
  };

  return (
    <div className="create-trip-page container">
      <button onClick={() => navigate('/trips')} className="btn-back">
        <ArrowLeft size={16} /> Back to Trips
      </button>

      <div className="create-trip-content">
        <div className="form-header">
          <h2>Create New Trip</h2>
          <p>Provide details to start planning your multi-city route</p>
        </div>

        <Card className="form-card">
          <form onSubmit={handleSubmit} className="trip-form">
            <div className="form-grid-2">
              <Input
                label="Trip Name"
                type="text"
                placeholder="e.g. Summer Euro Trip"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Starting Location"
                type="text"
                placeholder="e.g. Mumbai, India"
                value={startingLocation}
                onChange={(e) => setStartingLocation(e.target.value)}
                required
              />
            </div>

            <div className="form-grid-2">
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />

              <Input
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            <div className="form-grid-2">
              <Input
                label="Number of Travelers"
                type="number"
                min="1"
                value={travelers}
                onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                required
              />

              <Input
                label="Estimated Budget"
                type="text"
                placeholder="e.g. ₹3,00,000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>

            <div className="input-group text-left">
              <label className="input-label">Trip Description</label>
              <textarea
                className="custom-textarea"
                rows={4}
                placeholder="Write about what you want to experience, see, and accomplish..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-submit-wrapper">
              <Button variant="sunset" type="submit">
                <Save size={16} style={{ marginRight: '8px' }} /> Create Trip
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
