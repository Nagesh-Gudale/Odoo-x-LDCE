import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Globe2, 
  LayoutDashboard, 
  Users, 
  Map, 
  Compass, 
  ShieldCheck, 
  Search, 
  Bell, 
  ArrowLeft, 
  Menu, 
  X, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import './AdminLayout.css';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.includes('/admin/users')) return 'Users & Accounts Management';
    if (location.pathname.includes('/admin/trips')) return 'Platform Trips & Moderation';
    if (location.pathname.includes('/admin/destinations')) return 'Destinations & Experience Catalog';
    return 'Admin Overview & Platform Analytics';
  };

  return (
    <div className="admin-root-layout">
      {/* Left Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand" onClick={() => navigate('/admin')}>
          <div className="admin-logo-icon">
            <Globe2 size={22} className="text-white" />
            <span className="admin-pulse-dot"></span>
          </div>
          <div className="admin-brand-info">
            <span className="admin-brand-name">GlobeTrotter</span>
            <span className="admin-badge">Admin Portal</span>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="admin-nav-menu">
          <div className="nav-group-label">Core Management</div>

          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => `admin-nav-item ${isActive || location.pathname === '/admin' ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
            <ChevronRight size={14} className="nav-arrow" />
          </NavLink>

          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Users size={18} />
            <span>Users Directory</span>
            <span className="nav-counter-pill">8</span>
          </NavLink>

          <NavLink 
            to="/admin/trips" 
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Map size={18} />
            <span>Trips & Itineraries</span>
            <span className="nav-counter-pill">6</span>
          </NavLink>

          <div className="nav-group-label">Catalog & Data</div>

          <NavLink 
            to="/admin/destinations" 
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Compass size={18} />
            <span>Destinations</span>
            <span className="nav-counter-pill">450+</span>
          </NavLink>
        </nav>

        {/* Sidebar Footer & Switch to Traveler App */}
        <div className="sidebar-bottom-panel">
          {/* System Status Box */}
          <div className="system-health-card">
            <div className="health-row">
              <div className="health-dot-green"></div>
              <span className="health-label">System Healthy</span>
            </div>
            <div className="health-meta">API v1.0 • DB Connected</div>
          </div>

          {/* Return to App Button */}
          <button 
            className="btn-exit-to-app"
            onClick={() => navigate('/')}
            title="Exit admin portal and return to traveler app"
          >
            <ArrowLeft size={16} />
            <span>Back to Traveler App</span>
            <ExternalLink size={14} className="exit-icon" />
          </button>

          {/* Admin User Card */}
          <div className="admin-user-card">
            <div className="admin-avatar">
              <ShieldCheck size={16} />
            </div>
            <div className="admin-details">
              <span className="admin-name">Archita Thakur</span>
              <span className="admin-role">Super Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="admin-main-viewport">
        {/* Top Admin Header Bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button 
              className="mobile-sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="page-heading-block">
              <h1 className="admin-page-title">{getPageTitle()}</h1>
              <span className="admin-timestamp">Updated: Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          <div className="topbar-right">
            {/* Global Search Bar */}
            <div className="admin-search-wrapper">
              <Search size={16} className="search-icon" />
              <input 
                type="text"
                placeholder="Search users, trips, cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Quick Traveler App Switcher */}
            <button 
              className="btn-quick-traveler-app"
              onClick={() => navigate('/')}
              title="Switch to Plan Trip (Screen 4)"
            >
              <Compass size={16} />
              <span>Traveler View</span>
            </button>

            {/* Notifications */}
            <button className="admin-icon-btn" aria-label="Admin Alerts">
              <Bell size={18} />
              <span className="admin-alert-dot"></span>
            </button>

            {/* Profile Avatar */}
            <div className="admin-top-avatar" title="Archita (Administrator)">
              <span>AT</span>
            </div>
          </div>
        </header>

        {/* Dynamic Nested View */}
        <div className="admin-content-scroller">
          <Outlet context={{ searchQuery }} />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
