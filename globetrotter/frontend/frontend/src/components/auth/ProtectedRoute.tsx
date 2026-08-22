import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ShieldCheck } from 'lucide-react';
import '../../styles/Modules.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated, isLoading, login } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-spinner"></div>
        <p>Verifying authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If page requires admin role and current session is not admin, allow 1-click elevation for testing
  if (requireAdmin && user?.role !== 'admin') {
    return (
      <div className="module-page-container">
        <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', maxWidth: '540px' }}>
          <div className="expenses-table-card shadow-medium" style={{ padding: '2.5rem 2rem' }}>
            <ShieldCheck size={48} style={{ color: 'var(--color-sunset-orange)', marginBottom: '1rem' }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Admin Console Access
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              You are currently logged in as <strong>{user?.name || 'User'}</strong> ({user?.role || 'user'}). To access administrative tools, switch to the Admin Administrator account.
            </p>
            <button
              onClick={() => login('admin@globetrotter.com', 'admin123', true)}
              className="btn-gradient-cta"
              style={{ width: '100%', height: '44px' }}
            >
              Switch to Admin Account & Enter Console
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
