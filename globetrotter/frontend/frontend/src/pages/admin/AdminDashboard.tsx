import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  Users, 
  Map, 
  Globe2, 
  Sparkles, 
  ArrowUpRight, 
  TrendingUp, 
  Compass, 
  Eye, 
  Plus, 
  ArrowRight
} from 'lucide-react';
import { 
  ADMIN_STATS, 
  INITIAL_ADMIN_TRIPS, 
  INITIAL_ADMIN_DESTINATIONS 
} from '../../data/adminData';
import type { AdminTripItem } from '../../types/admin';
import './AdminDashboard.css';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { searchQuery } = useOutletContext<{ searchQuery?: string }>();
  const [trips, setTrips] = useState<AdminTripItem[]>(INITIAL_ADMIN_TRIPS);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const filteredTrips = trips.filter(trip => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      trip.title.toLowerCase().includes(query) ||
      trip.destination.toLowerCase().includes(query) ||
      trip.userName.toLowerCase().includes(query)
    );
  });

  const togglePublic = (tripId: string) => {
    setTrips(prev => 
      prev.map(t => t.id === tripId ? { ...t, isPublic: !t.isPublic } : t)
    );
  };

  return (
    <div className="admin-dashboard-page">
      {/* Top Welcome Banner */}
      <div className="dashboard-welcome-banner">
        <div className="welcome-text-block">
          <h2>Welcome back, Administrator</h2>
          <p>Here is your high-level overview of traveler acquisition, trip planning volume, and platform destinations.</p>
        </div>

        <div className="banner-controls">
          <div className="time-range-segmented">
            {(['7d', '30d', '90d', 'all'] as const).map(range => (
              <button
                key={range}
                className={`time-range-btn ${timeRange === range ? 'active' : ''}`}
                onClick={() => setTimeRange(range)}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '3 Months' : 'All Time'}
              </button>
            ))}
          </div>

          <button 
            className="btn-admin-action-primary"
            onClick={() => navigate('/admin/users')}
          >
            <Plus size={16} />
            <span>Manage Users</span>
          </button>
        </div>
      </div>

      {/* SECTION 26: 5 Core Platform Statistics Cards */}
      <div className="admin-kpi-grid">
        {/* Total Users */}
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-box users">
              <Users size={20} />
            </div>
            <div className="kpi-trend positive">
              <ArrowUpRight size={14} />
              <span>+{ADMIN_STATS.userGrowthPercent}%</span>
            </div>
          </div>
          <div className="kpi-value-group">
            <h3 className="kpi-number">{ADMIN_STATS.totalUsers.toLocaleString()}</h3>
            <span className="kpi-label">Total Users</span>
          </div>
          <div className="kpi-footer-sub">
            <span>+1,420 new travelers this month</span>
          </div>
        </div>

        {/* Total Trips */}
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-box trips">
              <Map size={20} />
            </div>
            <div className="kpi-trend positive">
              <ArrowUpRight size={14} />
              <span>+{ADMIN_STATS.tripGrowthPercent}%</span>
            </div>
          </div>
          <div className="kpi-value-group">
            <h3 className="kpi-number">{ADMIN_STATS.totalTrips.toLocaleString()}</h3>
            <span className="kpi-label">Total Trips Created</span>
          </div>
          <div className="kpi-footer-sub">
            <span>Average 5.4 days per itinerary</span>
          </div>
        </div>

        {/* Public Trips */}
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-box public-trips">
              <Globe2 size={20} />
            </div>
            <div className="kpi-trend neutral">
              <span>{ADMIN_STATS.publicTripsPercent}%</span>
            </div>
          </div>
          <div className="kpi-value-group">
            <h3 className="kpi-number">{ADMIN_STATS.publicTrips.toLocaleString()}</h3>
            <span className="kpi-label">Public Community Trips</span>
          </div>
          <div className="kpi-footer-sub">
            <span>Shared with explorer community</span>
          </div>
        </div>

        {/* Total Destinations */}
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-box destinations">
              <Compass size={20} />
            </div>
            <div className="kpi-trend positive">
              <span>48 Countries</span>
            </div>
          </div>
          <div className="kpi-value-group">
            <h3 className="kpi-number">{ADMIN_STATS.totalDestinations}</h3>
            <span className="kpi-label">Active Destinations</span>
          </div>
          <div className="kpi-footer-sub">
            <span>6 featured this season</span>
          </div>
        </div>

        {/* Total Activities */}
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-box activities">
              <Sparkles size={20} />
            </div>
            <div className="kpi-trend positive">
              <span>Verified</span>
            </div>
          </div>
          <div className="kpi-value-group">
            <h3 className="kpi-number">{ADMIN_STATS.totalActivities.toLocaleString()}</h3>
            <span className="kpi-label">Curated Activities</span>
          </div>
          <div className="kpi-footer-sub">
            <span>Avg rating 4.8 / 5.0</span>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown & Popular Destinations Row */}
      <div className="dashboard-two-col-grid">
        {/* Left: Popular Destinations Breakdown */}
        <div className="admin-card-panel">
          <div className="panel-header-row">
            <div>
              <h3 className="panel-title">Top Destinations by Booking Volume</h3>
              <p className="panel-subtitle">Current travel demand across global hotspots</p>
            </div>
            <button 
              className="btn-panel-link"
              onClick={() => navigate('/admin/destinations')}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="destinations-rank-list">
            {INITIAL_ADMIN_DESTINATIONS.slice(0, 5).map((dest, idx) => (
              <div key={dest.id} className="rank-item-row">
                <span className="rank-badge">0{idx + 1}</span>
                <div className="rank-info-block">
                  <div className="rank-title-row">
                    <strong>{dest.name}, {dest.country}</strong>
                    <span className="rank-trips-count">{dest.totalTrips.toLocaleString()} trips planned</span>
                  </div>
                  <div className="rank-progress-track">
                    <div 
                      className="rank-progress-fill"
                      style={{ width: `${dest.popularityScore}%` }}
                    ></div>
                  </div>
                  <div className="rank-meta-row">
                    <span>Region: {dest.region}</span>
                    <span>Avg Budget: {dest.currency}{dest.averageCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Platform Health & Quick Metrics */}
        <div className="admin-card-panel">
          <div className="panel-header-row">
            <div>
              <h3 className="panel-title">Trip Planning Velocity</h3>
              <p className="panel-subtitle">Monthly itinerary construction distribution</p>
            </div>
            <div className="panel-badge-sunset">
              <TrendingUp size={14} />
              <span>Healthy Growth</span>
            </div>
          </div>

          <div className="velocity-metric-container">
            <div className="velocity-stat-highlight">
              <span className="big-stat-val">₹32.4 Cr</span>
              <span className="big-stat-desc">Total Cumulative Itinerary Budget Planned in 2026</span>
            </div>

            <div className="category-bars-stack">
              <div className="bar-stat-item">
                <div className="bar-header">
                  <span>Sightseeing & Tours</span>
                  <strong>38% (9,838 Trips)</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: '38%', background: '#3155D9' }}></div>
                </div>
              </div>

              <div className="bar-stat-item">
                <div className="bar-header">
                  <span>Beaches & Island Relaxation</span>
                  <strong>29% (7,508 Trips)</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: '29%', background: '#FF8A3D' }}></div>
                </div>
              </div>

              <div className="bar-stat-item">
                <div className="bar-header">
                  <span>Mountain & Trekking Adventure</span>
                  <strong>21% (5,436 Trips)</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: '21%', background: '#7657E8' }}></div>
                </div>
              </div>

              <div className="bar-stat-item">
                <div className="bar-header">
                  <span>Luxury & Gastronomy</span>
                  <strong>12% (3,108 Trips)</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: '12%', background: '#FF647C' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trips Moderation Table */}
      <div className="admin-card-panel">
        <div className="panel-header-row">
          <div>
            <h3 className="panel-title">Recent Platform Trips</h3>
            <p className="panel-subtitle">Real-time trip creations and visibility moderation</p>
          </div>
          <button 
            className="btn-panel-link"
            onClick={() => navigate('/admin/trips')}
          >
            <span>View All Trips ({trips.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="admin-table-container">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Trip & Destination</th>
                <th>Created By</th>
                <th>Dates & Duration</th>
                <th>Allocated Budget</th>
                <th>Visibility</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.slice(0, 5).map(trip => (
                <tr key={trip.id}>
                  <td>
                    <div className="table-trip-title-group">
                      <span className="table-trip-name">{trip.title}</span>
                      <span className="table-trip-dest">📍 {trip.destination}</span>
                    </div>
                  </td>
                  <td>
                    <div className="table-user-group">
                      <span className="table-user-name">{trip.userName}</span>
                      <span className="table-user-email">{trip.userEmail}</span>
                    </div>
                  </td>
                  <td>
                    <div className="table-date-group">
                      <span>{trip.startDate} to {trip.endDate}</span>
                      <span className="table-travelers-count">{trip.travelers} Travelers • {trip.sectionsCount} Sections</span>
                    </div>
                  </td>
                  <td>
                    <span className="table-budget-amount">
                      {trip.currency}{trip.budget.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={`visibility-pill-btn ${trip.isPublic ? 'public' : 'private'}`}
                      onClick={() => togglePublic(trip.id)}
                      title="Click to toggle public/private"
                    >
                      {trip.isPublic ? (
                        <>
                          <Globe2 size={12} />
                          <span>Public</span>
                        </>
                      ) : (
                        <>
                          <Eye size={12} />
                          <span>Private</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td>
                    <span className={`status-pill ${trip.status.toLowerCase().replace(' ', '-')}`}>
                      {trip.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="table-action-btn"
                      onClick={() => navigate('/trips/build')}
                      title="Inspect Itinerary"
                    >
                      <span>View</span>
                      <ArrowRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
