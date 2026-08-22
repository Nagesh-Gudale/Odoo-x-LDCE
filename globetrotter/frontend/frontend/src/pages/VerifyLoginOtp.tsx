import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle2, Globe } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

export const VerifyLoginOtp: React.FC = () => {
  const navigate = useNavigate();
  const { verifyLoginOtp, resendOtp } = useAuth();

  const [email, setEmail] = useState(() => {
    const state = (window.history.state?.usr as { email?: string } | undefined) ?? undefined;
    return state?.email ?? localStorage.getItem('globetrotter_pending_email') ?? sessionStorage.getItem('globetrotter_pending_email') ?? '';
  });
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim() || otp.trim().length !== 6) {
      setError('Please enter your email and the 6-digit MFA code.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      await verifyLoginOtp(otp);
      setMessage('Code verified. Redirecting...');
      setTimeout(() => navigate('/home'), 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setError('Please enter your email before requesting a new code.');
      return;
    }

    setIsResending(true);
    setError('');
    setMessage('');

    try {
      await resendOtp(email, 'login_mfa');
      setMessage('A new login code has been sent.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not resend the code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <Link to="/home" className="auth-header-brand">
          <div className="logo-icon-container"><Globe className="brand-icon" size={20} /></div>
          <span className="brand-name">GlobeTrotter</span>
        </Link>
        <Link to="/home" className="btn-back-home">Back to Home</Link>
      </header>

      <div className="auth-split-container">
        <div className="auth-banner">
          <img src="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80" alt="Travel landscape" className="banner-bg-image" />
          <div className="banner-overlay" />
          <div className="banner-content">
            <div className="banner-brand-badge"><Globe size={24} /><span>GlobeTrotter</span></div>
            <h2 className="banner-heading">Secure sign-in</h2>
            <p className="banner-text">Enter the 6-digit verification code for your login confirmation.</p>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="form-box">
            <h2 className="form-title">Verify sign-in code</h2>
            <p className="form-subtitle">Use the 6-digit code sent to your email to continue.</p>

            {error && (
              <div className="auth-alert error-alert" role="alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="auth-alert" style={{ backgroundColor: 'rgba(50, 180, 138, 0.1)', border: '1px solid rgba(50,180,138,0.3)', color: '#32b48a' }} role="status">
                <CheckCircle2 size={18} />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="auth-field-group">
                <label htmlFor="login-otp-email" className="auth-field-label">Email Address</label>
                <div className="auth-input-wrapper">
                  <input
                    id="login-otp-email"
                    type="email"
                    className="auth-input-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <label htmlFor="login-otp" className="auth-field-label">Verification Code</label>
                <div className="auth-input-wrapper">
                  <input
                    id="login-otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    className="auth-input-control"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-auth-submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="btn-spinner" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify sign-in</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <button type="button" className="btn-auth-submit btn-secondary-auth" onClick={handleResend} disabled={isResending}>
                {isResending ? 'Sending...' : 'Resend code'}
              </button>
            </form>

            <p className="auth-footer-text">
              Back to <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
