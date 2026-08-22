import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Globe, ArrowRight, Sun, Moon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { PasswordInput } from '../components/auth/PasswordInput';
import heroImage from '../assets/hero-santorini.jpg';
import './Auth.css';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isAuthenticated } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
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

  const passwordReqs = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordReqs).every(Boolean);
  const isMatch = confirmPassword.length > 0 && password === confirmPassword;

  const validateForm = (): boolean => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setFormError('');

    if (!name.trim()) {
      setNameError('Full Name is required.');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('Full Name must be at least 2 characters.');
      isValid = false;
    }

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
    } else if (!isPasswordValid) {
      setPasswordError('Password does not meet the requirements below.');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
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
      await register(name, email, password);
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/home';
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create account. Please try again.';
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Header */}
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
            <h2 className="banner-heading">Discover and plan<br />together.</h2>
            <p className="banner-text">
              Craft rich itineraries, estimate expenses instantly, and collaborate with your travel partners.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="auth-form-container">
          <div className="form-box">
            <h2 className="form-title">Create Your Account</h2>
            <p className="form-subtitle">Get started with personalized multi-city planning</p>

            {formError && (
              <div className="auth-alert error-alert" role="alert">
                <AlertCircle size={18} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="auth-field-group">
                <label htmlFor="register-name" className="auth-field-label">
                  Full Name <span className="required-star">*</span>
                </label>
                <div className={`auth-input-wrapper ${nameError ? 'has-error' : ''}`}>
                  <input
                    id="register-name"
                    type="text"
                    className="auth-input-control"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
                {nameError && <span className="auth-field-error" role="alert">{nameError}</span>}
              </div>

              <div className="auth-field-group">
                <label htmlFor="register-email" className="auth-field-label">
                  Email Address <span className="required-star">*</span>
                </label>
                <div className={`auth-input-wrapper ${emailError ? 'has-error' : ''}`}>
                  <input
                    id="register-email"
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                autoComplete="new-password"
                required
              />

              {/* Password Requirement Guidance */}
              <div className="password-requirements-box">
                <p className="req-title">Password must contain:</p>
                <div className="req-grid">
                  <span className={`req-item ${passwordReqs.length ? 'met' : ''}`}>
                    {passwordReqs.length ? '✓' : '•'} At least 8 characters
                  </span>
                  <span className={`req-item ${passwordReqs.uppercase ? 'met' : ''}`}>
                    {passwordReqs.uppercase ? '✓' : '•'} One uppercase letter
                  </span>
                  <span className={`req-item ${passwordReqs.lowercase ? 'met' : ''}`}>
                    {passwordReqs.lowercase ? '✓' : '•'} One lowercase letter
                  </span>
                  <span className={`req-item ${passwordReqs.number ? 'met' : ''}`}>
                    {passwordReqs.number ? '✓' : '•'} One number
                  </span>
                </div>
              </div>

              <div className="confirm-password-wrapper">
                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={confirmPasswordError}
                  autoComplete="new-password"
                  required
                />
                {isMatch && (
                  <div className="pass-match-indicator">
                    <CheckCircle2 size={16} />
                    <span>Passwords match</span>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className="btn-auth-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="btn-spinner"></span>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
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
