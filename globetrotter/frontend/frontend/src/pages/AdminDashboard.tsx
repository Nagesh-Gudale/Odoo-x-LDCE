import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Card, StatCard } from '../components/Common';
import './Admin.css';

export const AdminDashboard: React.FC = () => {

  return (
    <div className="admin-page container">
      <div className="admin-header">
        <div className="title-section">
          <ShieldAlert className="admin-icon-top" />
          <h2>Admin Console</h2>
        </div>
        <div className="admin-tabs">
          <Link to="/admin/dashboard" className="admin-tab active">Dashboard</Link>
          <Link to="/admin/users" className="admin-tab">Manage Users</Link>
        </div>
      </div>

      <div className="admin-section-header">
        <h3>System Metrics</h3>
        <p>Real-time analytics and data counters across GlobeTrotter tables</p>
      </div>

      <div className="admin-metrics-grid">
        <StatCard value="1,240" label="Total Users" />
        <StatCard value="3,512" label="Total Trips" />
        <StatCard value="1,894" label="Public Trips" />
        <StatCard value="42" label="Destinations" />
        <StatCard value="154" label="Activities" />
      </div>

      <div className="admin-recent-activity" style={{ marginTop: '3rem' }}>
        <Card className="activity-card">
          <h3>Recent Operations</h3>
          <div className="operations-list">
            <div className="operation-item">
              <span className="op-time">10 mins ago</span>
              <p>User <strong>nagesh@odoo.com</strong> created a new trip: <em>European Explorer</em>.</p>
            </div>
            <div className="operation-item">
              <span className="op-time">30 mins ago</span>
              <p>New city registered: <strong>Bali, Indonesia</strong> with Cost Index 1.10.</p>
            </div>
            <div className="operation-item">
              <span className="op-time">1 hour ago</span>
              <p>User <strong>archita@odoo.com</strong> marked trip <em>Tropical Getaway</em> as public.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
