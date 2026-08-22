import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Globe, ArrowRight } from 'lucide-react';
import { Button, Input } from '../components/Common';
import './Auth.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login success and redirect to Home
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
            <h2 className="banner-heading">Travel beautifully. Plan intelligently.</h2>
            <p className="banner-text">Join thousands of travelers crafting the perfect multi-city itineraries across continents.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="auth-form-container">
          <div className="form-box">
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-subtitle">Enter details to manage your travel experiences</p>

            <form onSubmit={handleSubmit} className="auth-form">
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

              <div className="form-actions">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" className="forgot-password">Forgot Password?</a>
              </div>

              <Button variant="sunset" type="submit" className="w-full">
                Login <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </Button>
            </form>

            <p className="auth-footer-text">
              Don't have an account? <Link to="/register">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
