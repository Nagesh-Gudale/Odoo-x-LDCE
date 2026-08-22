import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Explore', path: '/search/cities' },
    { name: 'Trips', path: '/trips' },
    { name: 'Activities', path: '/search/activities' },
    { name: 'Budget', path: '/trips/build' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-brand">
          <Globe className="brand-icon" />
          <span>GlobeTrotter</span>
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

          <div className="navbar-auth">
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-signup">Sign Up</Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="navbar-mobile-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
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
              <Link to="/login" className="btn-login-mob" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" className="btn-signup-mob" onClick={() => setIsOpen(false)}>Sign Up</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
