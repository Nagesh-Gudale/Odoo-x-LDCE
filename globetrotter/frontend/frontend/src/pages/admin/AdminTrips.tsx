import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  Map, 
  Compass, 
  Search, 
  Globe2, 
  Eye, 
  Plus, 
  Trash2, 
  Edit3, 
  Star, 
  X
} from 'lucide-react';
import { INITIAL_ADMIN_TRIPS, INITIAL_ADMIN_DESTINATIONS } from '../../data/adminData';
import type { AdminTripItem, AdminDestinationItem } from '../../types/admin';
import './AdminTrips.css';

export const AdminTrips: React.FC = () => {
  const navigate = useNavigate();
  const { searchQuery: globalSearch } = useOutletContext<{ searchQuery?: string }>();
  
  const [activeTab, setActiveTab] = useState<'trips' | 'destinations'>('trips');
  const [trips, setTrips] = useState<AdminTripItem[]>(INITIAL_ADMIN_TRIPS);
  const [destinations, setDestinations] = useState<AdminDestinationItem[]>(INITIAL_ADMIN_DESTINATIONS);
  const [localSearch, setLocalSearch] = useState('');

  // Destination Modal
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);
  const [destName, setDestName] = useState('');
  const [destCountry, setDestCountry] = useState('');
  const [destRegion, setDestRegion] = useState('');
  const [destCost, setDestCost] = useState<number>(100000);
  const [destFeatured] = useState(false);

  const effectiveSearch = (globalSearch || localSearch).toLowerCase();

  const filteredTrips = trips.filter(trip => 
    trip.title.toLowerCase().includes(effectiveSearch) ||
    trip.destination.toLowerCase().includes(effectiveSearch) ||
    trip.userName.toLowerCase().includes(effectiveSearch)
  );

  const filteredDestinations = destinations.filter(dest => 
    dest.name.toLowerCase().includes(effectiveSearch) ||
    dest.country.toLowerCase().includes(effectiveSearch) ||
    dest.region.toLowerCase().includes(effectiveSearch)
  );

  const togglePublic = (tripId: string) => {
    setTrips(prev => 
      prev.map(t => t.id === tripId ? { ...t, isPublic: !t.isPublic } : t)
    );
  };

  const deleteTrip = (tripId: string) => {
    if (window.confirm('Delete this trip permanently?')) {
      setTrips(prev => prev.filter(t => t.id !== tripId));
    }
  };

  const toggleFeaturedDest = (destId: string) => {
    setDestinations(prev => 
      prev.map(d => d.id === destId ? { ...d, isFeatured: !d.isFeatured } : d)
    );
  };

  const handleSaveDestination = (e: React.FormEvent) => {
    e.preventDefault();
    const newDest: AdminDestinationItem = {
      id: `dst-${Date.now()}`,
      name: destName,
      country: destCountry,
      region: destRegion,
      totalTrips: 1,
      totalActivities: 8,
      averageCost: Number(destCost),
      currency: '₹',
      popularityScore: 90,
      isFeatured: destFeatured,
      status: 'active'
    };
    setDestinations(prev => [newDest, ...prev]);
    setIsDestModalOpen(false);
    setDestName('');
    setDestCountry('');
    setDestRegion('');
  };

  return (
    <div className="admin-trips-page">
      {/* Header & Tabs */}
      <div className="trips-header-block">
        <div>
          <h2 className="trips-page-title">Trips & Destinations Management</h2>
          <p className="trips-page-sub">Monitor user-generated itineraries, public sharing permissions, and curated destination catalogs.</p>
        </div>

        <div className="trips-header-actions">
          {activeTab === 'destinations' ? (
            <button className="btn-add-item" onClick={() => setIsDestModalOpen(true)}>
              <Plus size={16} />
              <span>+ Add Destination</span>
            </button>
          ) : (
            <button className="btn-add-item" onClick={() => navigate('/trips/create')}>
              <Plus size={16} />
              <span>+ Create Test Trip</span>
            </button>
          )}
        </div>
      </div>

      {/* Segmented Tab Navigation & Search */}
      <div className="trips-tabs-toolbar">
        <div className="catalog-tabs-group">
          <button 
            className={`catalog-tab-btn ${activeTab === 'trips' ? 'active' : ''}`}
            onClick={() => setActiveTab('trips')}
          >
            <Map size={16} />
            <span>Platform Trips ({trips.length})</span>
          </button>
          <button 
            className={`catalog-tab-btn ${activeTab === 'destinations' ? 'active' : ''}`}
            onClick={() => setActiveTab('destinations')}
          >
            <Compass size={16} />
            <span>Destinations Catalog ({destinations.length})</span>
          </button>
        </div>

        <div className="table-search-input">
          <Search size={15} className="search-icon-dim" />
          <input 
            type="text"
            placeholder={activeTab === 'trips' ? 'Filter trips by name, place...' : 'Filter destinations by name, country...'}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TAB 1: Trips Table */}
      {activeTab === 'trips' && (
        <div className="admin-table-card">
          <div className="table-responsive-wrapper">
            <table className="trips-data-table">
              <thead>
                <tr>
                  <th>Trip Title & Destination</th>
                  <th>Creator</th>
                  <th>Dates & Duration</th>
                  <th>Budget</th>
                  <th>Visibility</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-table-row">
                      <Map size={32} />
                      <div>No trips found matching search</div>
                    </td>
                  </tr>
                ) : (
                  filteredTrips.map(trip => (
                    <tr key={trip.id}>
                      <td>
                        <div className="trip-primary-info">
                          <span className="trip-name-text">{trip.title}</span>
                          <span className="trip-dest-text">📍 {trip.destination}</span>
                        </div>
                      </td>

                      <td>
                        <div className="creator-cell">
                          <span className="creator-name">{trip.userName}</span>
                          <span className="creator-email">{trip.userEmail}</span>
                        </div>
                      </td>

                      <td>
                        <div className="date-info-cell">
                          <span>{trip.startDate} → {trip.endDate}</span>
                          <span className="sub-meta-pill">{trip.sectionsCount} Sections • {trip.travelers} Travelers</span>
                        </div>
                      </td>

                      <td>
                        <span className="budget-bold-val">
                          {trip.currency}{trip.budget.toLocaleString()}
                        </span>
                      </td>

                      <td>
                        <button 
                          className={`visibility-badge-btn ${trip.isPublic ? 'is-public' : 'is-private'}`}
                          onClick={() => togglePublic(trip.id)}
                          title="Click to toggle Public / Private"
                        >
                          {trip.isPublic ? (
                            <>
                              <Globe2 size={13} />
                              <span>Public</span>
                            </>
                          ) : (
                            <>
                              <Eye size={13} />
                              <span>Private</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td>
                        <span className={`trip-status-tag ${trip.status.toLowerCase().replace(' ', '-')}`}>
                          {trip.status}
                        </span>
                      </td>

                      <td>
                        <div className="table-actions-cluster">
                          <button 
                            className="table-btn-icon"
                            onClick={() => navigate('/trips/build')}
                            title="Inspect Trip Itinerary"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button 
                            className="table-btn-icon delete-btn"
                            onClick={() => deleteTrip(trip.id)}
                            title="Delete Trip"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Destinations Catalog */}
      {activeTab === 'destinations' && (
        <div className="admin-table-card">
          <div className="table-responsive-wrapper">
            <table className="trips-data-table">
              <thead>
                <tr>
                  <th>Destination</th>
                  <th>Region & Country</th>
                  <th>Trips Planned</th>
                  <th>Activities</th>
                  <th>Avg Budget</th>
                  <th>Popularity Score</th>
                  <th>Featured</th>
                </tr>
              </thead>
              <tbody>
                {filteredDestinations.map(dest => (
                  <tr key={dest.id}>
                    <td>
                      <div className="dest-name-group">
                        <span className="dest-main-title">{dest.name}</span>
                        <span className="dest-country-label">📍 {dest.country}</span>
                      </div>
                    </td>

                    <td>
                      <span className="region-text">{dest.region}</span>
                    </td>

                    <td>
                      <span className="metric-chip">
                        {dest.totalTrips.toLocaleString()} trips
                      </span>
                    </td>

                    <td>
                      <span className="activities-count-text">
                        {dest.totalActivities} curated
                      </span>
                    </td>

                    <td>
                      <span className="budget-bold-val">
                        {dest.currency}{dest.averageCost.toLocaleString()}
                      </span>
                    </td>

                    <td>
                      <div className="popularity-score-bar">
                        <div className="score-fill" style={{ width: `${dest.popularityScore}%` }}></div>
                        <span className="score-text">{dest.popularityScore}%</span>
                      </div>
                    </td>

                    <td>
                      <button 
                        className={`featured-toggle-btn ${dest.isFeatured ? 'featured' : ''}`}
                        onClick={() => toggleFeaturedDest(dest.id)}
                      >
                        <Star size={14} fill={dest.isFeatured ? '#FFB547' : 'none'} color={dest.isFeatured ? '#FFB547' : '#949AA8'} />
                        <span>{dest.isFeatured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Destination Modal */}
      {isDestModalOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setIsDestModalOpen(false)}>
          <div className="user-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="user-modal-header">
              <h3>Add Destination to Catalog</h3>
              <button 
                className="user-modal-close"
                onClick={() => setIsDestModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDestination} className="user-modal-form">
              <div className="form-group-item">
                <label>City / Destination Name</label>
                <input 
                  type="text"
                  value={destName}
                  onChange={(e) => setDestName(e.target.value)}
                  placeholder="e.g. Kyoto"
                  required
                />
              </div>

              <div className="modal-row-two">
                <div className="form-group-item">
                  <label>Country</label>
                  <input 
                    type="text"
                    value={destCountry}
                    onChange={(e) => setDestCountry(e.target.value)}
                    placeholder="e.g. Japan"
                    required
                  />
                </div>

                <div className="form-group-item">
                  <label>Region / Province</label>
                  <input 
                    type="text"
                    value={destRegion}
                    onChange={(e) => setDestRegion(e.target.value)}
                    placeholder="e.g. Kansai"
                    required
                  />
                </div>
              </div>

              <div className="form-group-item">
                <label>Estimated Average Cost (₹ INR)</label>
                <input 
                  type="number"
                  value={destCost}
                  onChange={(e) => setDestCost(Number(e.target.value))}
                  min={5000}
                  step={5000}
                  required
                />
              </div>

              <div className="modal-actions-footer">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setIsDestModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-submit-user"
                >
                  Save Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTrips;
