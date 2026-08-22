import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, ArrowRight, Sun, Moon, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import heroImage from '../../assets/hero-santorini.jpg';
import '../Auth.css';

export const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setFormError('');

    if (!email.trim()) {
      setEmailError('Email address is required.');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
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
        <div className="auth-banner">
          <img src={heroImage} alt="Santorini Sunset" className="banner-bg-image" />
          <div className="banner-overlay"></div>
          <div className="banner-content">
            <div className="banner-brand-badge">
              <Globe size={24} />
              <span>GlobeTrotter</span>
            </div>
            <h2 className="banner-heading">Account Recovery</h2>
            <p className="banner-text">
              Don't worry, we'll help you get back on track to planning your next adventure.
            </p>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="form-box">
            {isSubmitted ? (
              <div className="auth-success-state">
                <div className="success-icon-circle">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="form-title">Check Your Email</h2>
                <p className="form-subtitle">
                  If an account exists for <strong>{email}</strong>, you will receive instructions to reset your password shortly.
                </p>
                <Link to="/login" className="btn-auth-submit btn-secondary-auth">
                  <ArrowLeft size={18} />
                  <span>Return to Login</span>
                </Link>
              </div>
            ) : (
              <>
                <h2 className="form-title">Forgot your password?</h2>
                <p className="form-subtitle">Enter your email and we'll help you get back into your account.</p>

                {formError && (
                  <div className="auth-alert error-alert" role="alert">
                    <AlertCircle size={18} />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                  <div className="auth-field-group">
                    <label htmlFor="forgot-email" className="auth-field-label">
                      Email Address <span className="required-star">*</span>
                    </label>
                    <div className={`auth-input-wrapper ${emailError ? 'has-error' : ''}`}>
                      <input
                        id="forgot-email"
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

                  <button 
                    type="submit" 
                    className="btn-auth-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="btn-spinner"></span>
                        <span>Sending Link...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <div className="text-center-link">
                    <Link to="/login" className="forgot-password inline-back">
                      <ArrowLeft size={16} /> Back to Login
                    </Link>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
