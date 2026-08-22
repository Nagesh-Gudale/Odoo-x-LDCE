import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Globe, ArrowRight } from 'lucide-react';
import { Button, Input } from '../components/Common';
import './Auth.css';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Simulate signup success and redirect
    navigate('/home');
  };

  return (
    <div className="auth-page">
      <div className="auth-split-container">
        {/* Left Side: Brand Imagery */}
        <div className="auth-banner">
          <div className="banner-overlay"></div>
          <div className="banner-content">
            <Link to="/home" className="banner-logo">
              <Globe size={32} />
              <span>GlobeTrotter</span>
            </Link>
            <h2 className="banner-heading">Discover and Plan together.</h2>
            <p className="banner-text">Craft rich itineraries, estimate expenses instantly, and collaborate with your travel partners.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="auth-form-container">
          <div className="form-box">
            <h2 className="form-title">Create Your Account</h2>
            <p className="form-subtitle">Get started with personalized multi-city planning</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Button variant="sunset" type="submit" className="w-full">
                Create Account <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </Button>
            </form>

            <p className="auth-footer-text">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
