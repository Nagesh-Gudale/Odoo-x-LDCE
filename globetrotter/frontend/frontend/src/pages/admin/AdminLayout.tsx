import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Compass, MapPin, BarChart3, ArrowLeft, ShieldCheck } from 'lucide-react';
import '../../styles/Modules.css';

export const AdminLayout: React.FC = () => {
  return (
    <div className="admin-shell-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-sunset-orange)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            <ShieldCheck size={16} /> ADMIN CONSOLE
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800 }}>GlobeTrotter</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Users size={18} /> User Management
          </NavLink>
          <NavLink to="/admin/trips" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Compass size={18} /> Trip Management
          </NavLink>
          <NavLink to="/admin/activities" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <MapPin size={18} /> Activities Catalog
          </NavLink>
          <NavLink to="/admin/destinations" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <MapPin size={18} /> Destination Catalog
          </NavLink>
          <NavLink to="/admin/analytics" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <BarChart3 size={18} /> Analytics & Reports
          </NavLink>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <Link to="/" className="btn-outline-cta" style={{ width: '100%', fontSize: '0.82rem', justifyContent: 'center' }}>
            <ArrowLeft size={14} /> Back to Main App
          </Link>
        </div>
      </aside>

      {/* Main Viewport Outlet */}
      <main className="admin-main-viewport">
        <Outlet />
      </main>
    </div>
  );
};
