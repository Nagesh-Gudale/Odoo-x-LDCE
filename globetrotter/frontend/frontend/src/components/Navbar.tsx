import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Globe, Sun, Moon, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
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
    { name: 'Explore', path: '/search/cities' },
    { name: 'Trips', path: '/trips' },
    { name: 'Activities', path: '/activities' },
    { name: 'Budget', path: '/trips/build' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/home" className="navbar-brand-wrapper">
          <div className="logo-icon-container">
            <Globe className="brand-icon" />
          </div>
          <div className="logo-text-wrapper">
            <span className="brand-name">GlobeTrotter</span>
            <span className="brand-tagline">Your Journey, Perfectly Planned.</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-desktop">
          <div className="navbar-links">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="navbar-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAuthenticated ? (
              <div className="navbar-user-dropdown">
                <Link to="/profile" className="btn-user-profile">
                  <UserIcon size={16} />
                  <span>{user?.name || 'My Account'}</span>
                </Link>
                <button onClick={logout} className="btn-logout" title="Log out">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="navbar-auth">
                <Link to="/login" className="btn-login">Login</Link>
                <Link to="/register" className="btn-signup">Sign Up</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="mobile-right-actions">
          <button className="theme-toggle mobile-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="navbar-mobile-toggle" onClick={toggleMenu} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="navbar-mobile">
          <div className="mobile-links">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  isActive ? 'mobile-link active' : 'mobile-link'
                }
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
            <div className="mobile-auth">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="btn-login-mob" onClick={() => setIsOpen(false)}>
                    Profile ({user?.name})
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }} 
                    className="btn-signup-mob"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-login-mob" onClick={() => setIsOpen(false)}>Login</Link>
                  <Link to="/register" className="btn-signup-mob" onClick={() => setIsOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
