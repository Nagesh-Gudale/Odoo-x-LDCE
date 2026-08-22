import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, ArrowRight, Sun, Moon, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { PasswordInput } from '../../components/auth/PasswordInput';
import heroImage from '../../assets/hero-santorini.jpg';
import '../Auth.css';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

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

  const validateForm = (): boolean => {
    let isValid = true;
    setPasswordError('');
    setConfirmPasswordError('');
    setFormError('');

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
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
    try {
      await resetPassword(password);
      setIsSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to reset password. Please try again.';
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
            <h2 className="banner-heading">Set New Password</h2>
            <p className="banner-text">
              Choose a strong password to protect your travel plans and profile.
            </p>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="form-box">
            {isSuccess ? (
              <div className="auth-success-state">
                <div className="success-icon-circle">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="form-title">Password Updated!</h2>
                <p className="form-subtitle">Your password has been changed successfully. You can now log in with your new credentials.</p>
                <button onClick={() => navigate('/login')} className="btn-auth-submit">
                  <span>Return to Login</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <>
                <h2 className="form-title">Create New Password</h2>
                <p className="form-subtitle">Enter your new password below</p>

                {formError && (
                  <div className="auth-alert error-alert" role="alert">
                    <AlertCircle size={18} />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                  <PasswordInput
                    label="New Password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={passwordError}
                    autoComplete="new-password"
                    required
                  />

                  <PasswordInput
                    label="Confirm New Password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={confirmPasswordError}
                    autoComplete="new-password"
                    required
                  />

                  <button 
                    type="submit" 
                    className="btn-auth-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="btn-spinner"></span>
                        <span>Resetting...</span>
                      </>
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <div className="text-center-link">
                    <Link to="/login" className="forgot-password inline-back">
                      <ArrowLeft size={16} /> Cancel & Return to Login
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
