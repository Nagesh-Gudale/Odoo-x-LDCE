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

  const isAdmin = user?.role === 'admin';
  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Explore', path: '/explore' },
    { name: 'Activities', path: '/activities' },
    { name: 'Trips', path: '/trips' },
    { name: 'Community', path: '/community' },
    { name: 'Calendar', path: '/calendar' },
    ...(isAdmin ? [{ name: 'Admin', path: '/admin' }] : []),
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/home" className="navbar-brand-wrapper">
          <GlobeTrotterLogo size="md" showText={true} showTagline={true} />
        </Link>

        {/* Desktop Navigation Links & Actions */}
        <div className="navbar-desktop">
          <div className="navbar-links">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="navbar-right">
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle Theme"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAuthenticated ? (
              <div className="navbar-user-dropdown">
                <Link to="/profile" className="btn-user-profile">
                  <UserIcon size={16} />
                  <span>{user?.name || 'Explorer'}</span>
                </Link>
                <button onClick={() => logout()} className="btn-logout" title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="navbar-auth">
                <Link to="/login" className="btn-login">
                  Log In
                </Link>
                <Link to="/register" className="btn-signup">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Header Actions */}
        <div className="mobile-right-actions">
          <button
            onClick={toggleTheme}
            className="theme-toggle mobile-theme-toggle"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="navbar-mobile-toggle" onClick={toggleMenu} aria-label="Toggle Navigation">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="navbar-mobile">
          <div className="mobile-links">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}

            <div className="mobile-auth">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="mobile-link" onClick={() => setIsOpen(false)}>
                    Profile ({user?.name || 'Explorer'})
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="btn-login-mob"
                    style={{ color: '#FF6B6B', borderColor: 'rgba(255,107,107,0.3)' }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-login-mob" onClick={() => setIsOpen(false)}>
                    Log In
                  </Link>
                  <Link to="/register" className="btn-signup-mob" onClick={() => setIsOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
