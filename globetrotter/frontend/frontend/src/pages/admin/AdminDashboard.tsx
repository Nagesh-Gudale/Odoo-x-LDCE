import React from 'react';
import { Users, Compass, MapPin, DollarSign, TrendingUp, Sparkles } from 'lucide-react';
import { useTrip } from '../../context/useTrip';
import '../../styles/Modules.css';

export const AdminDashboard: React.FC = () => {
  const { trips, adminUsers } = useTrip();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <span className="module-eyebrow">
          <Sparkles size={16} /> OVERVIEW METRICS
        </span>
        <h1 className="module-title">Platform Dashboard</h1>
        <p className="module-subtitle">Monitor user activity, trip creations, system volume, and revenue metrics.</p>
      </div>

      {/* Metric Cards Grid */}
      <div className="budget-summary-grid">
        <div className="budget-metric-card shadow-subtle">
          <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users size={16} /> Total Registered Users
          </span>
          <div className="metric-val">{adminUsers.length + 1240}</div>
          <span className="metric-status-badge status-ok">+18% this month</span>
        </div>

        <div className="budget-metric-card shadow-subtle">
          <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Compass size={16} /> Total Trips Planned
          </span>
          <div className="metric-val" style={{ color: 'var(--color-sunset-orange)' }}>
            {trips.length + 480}
          </div>
          <span className="metric-status-badge status-ok">+24% this month</span>
        </div>

        <div className="budget-metric-card shadow-subtle">
          <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={16} /> Active Destinations
          </span>
          <div className="metric-val">84</div>
          <span className="metric-status-badge status-ok">Global Coverage</span>
        </div>

        <div className="budget-metric-card shadow-subtle">
          <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <DollarSign size={16} /> Platform Volume (INR)
          </span>
          <div className="metric-val" style={{ color: '#32B48A', fontSize: '1.8rem' }}>
            ₹12,45,000
          </div>
          <span className="metric-status-badge status-ok">+15% revenue growth</span>
        </div>
      </div>

      {/* Chart & Activity Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: '2rem' }}>
        <div className="admin-table-card shadow-subtle">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} /> User & Trip Growth Trend (2026)
          </h3>

          {/* Simple Visual SVG Chart */}
          <div style={{ height: '220px', width: '100%', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '1rem 0' }}>
            {[
              { month: 'Jan', val: 40 },
              { month: 'Feb', val: 55 },
              { month: 'Mar', val: 65 },
              { month: 'Apr', val: 80 },
              { month: 'May', val: 70 },
              { month: 'Jun', val: 90 },
              { month: 'Jul', val: 95 },
              { month: 'Aug', val: 110 },
            ].map((item) => (
              <div key={item.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '100%',
                    height: `${item.val * 1.5}px`,
                    background: 'linear-gradient(135deg, #FF7A45, #FF4F9A)',
                    borderRadius: '8px 8px 0 0',
                    transition: 'height 0.3s ease',
                  }}
                ></div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-table-card shadow-subtle">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
            Recent Activity Log
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { text: 'User Alex Rivera created trip "Japan Cultural Discovery"', time: '10m ago' },
              { text: 'New activity "Sunset Catamaran Cruise" published', time: '42m ago' },
              { text: 'User Elena Rostova posted in Community', time: '2h ago' },
              { text: 'System backup completed successfully', time: '5h ago' },
            ].map((log, idx) => (
              <div key={idx} style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
                <p style={{ fontWeight: 700, margin: 0 }}>{log.text}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
