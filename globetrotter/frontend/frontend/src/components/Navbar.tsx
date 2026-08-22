import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { GlobeTrotterLogo } from './GlobeTrotterLogo';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleTheme = () => setIsDark((prev) => !prev);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Explore', path: '/explore' },
    { name: 'Activities', path: '/activities' },
    { name: 'Trips', path: '/trips' },
    { name: 'Community', path: '/community' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Admin', path: '/admin' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/home" className="navbar-brand-wrapper">
          <GlobeTrotterLogo size="md" showText={true} showTagline={true} />
        </Link>

        {/* Desktop Nav Links */}
        <div className="nav-menu">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Right Actions */}
        <div className="nav-actions">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle Theme"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="theme-icon" /> : <Moon className="theme-icon" />}
          </button>

          {isAuthenticated ? (
            <div className="user-profile-menu">
              <Link to="/profile" className="user-avatar-btn">
                <UserIcon size={18} />
                <span className="user-name">{user?.name || 'Explorer'}</span>
              </Link>
              <button onClick={() => logout()} className="logout-btn" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">
                Log In
              </Link>
              <Link to="/register" className="btn-register btn-gradient-cta">
                Sign Up
              </Link>
            </div>
          )}

          <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle Navigation">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu shadow-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};
