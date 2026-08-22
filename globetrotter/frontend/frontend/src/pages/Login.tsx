import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Globe, ArrowRight, Sun, Moon, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { PasswordInput } from '../components/auth/PasswordInput';
import heroImage from '../assets/hero-santorini.jpg';
import './Auth.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

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
    if (isAuthenticated) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/home';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setFormError('');

    if (!email.trim()) {
      setEmailError('Email address is required.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setFormError('');

    try {
      await login(email, password, rememberMe);
      navigate('/verify-login-otp', { state: { email } });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Lightweight Header */}
      <header className="auth-header">
        <Link to="/home" className="auth-header-brand">
          <div className="logo-icon-container">
            <Globe className="brand-icon" size={20} />
          </div>
          <span className="brand-name">GlobeTrotter</span>
        </Link>
        <div className="auth-header-actions">
          <button 
            className="theme-toggle" 
            onClick={() => setIsDark(!isDark)} 
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/home" className="btn-back-home">Back to Home</Link>
        </div>
      </header>

      <div className="auth-split-container">
        {/* Left Side: Brand Imagery */}
        <div className="auth-banner">
          <img src={heroImage} alt="Santorini Sunset" className="banner-bg-image" />
          <div className="banner-overlay"></div>
          <div className="banner-content">
            <div className="banner-brand-badge">
              <Globe size={24} />
              <span>GlobeTrotter</span>
            </div>
            <h2 className="banner-heading">Travel beautifully.<br />Plan intelligently.</h2>
            <p className="banner-text">
              Join thousands of travelers crafting the perfect multi-city itineraries across continents.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="auth-form-container">
          <div className="form-box">
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-subtitle">Enter your details to manage your travel experiences</p>

            {formError && (
              <div className="auth-alert error-alert" role="alert">
                <AlertCircle size={18} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="auth-field-group">
                <label htmlFor="login-email" className="auth-field-label">
                  Email Address <span className="required-star">*</span>
                </label>
                <div className={`auth-input-wrapper ${emailError ? 'has-error' : ''}`}>
                  <input
                    id="login-email"
                    type="email"
                    className="auth-input-control"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                {emailError && <span className="auth-field-error" role="alert">{emailError}</span>}
              </div>

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                autoComplete="current-password"
                required
              />

              <div className="form-actions">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember Me</span>
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <button 
                type="submit" 
                className="btn-auth-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="btn-spinner"></span>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
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
