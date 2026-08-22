import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AppRoutes } from './routes/AppRoutes';
import './App.css';

function AppContent() {
  const location = useLocation();

  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-signup', '/verify-login-otp'];

  const isAuthPage = authRoutes.includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAuthPage && !isAdminPage && <Navbar />}
      <main>
        <AppRoutes />
      </main>
      {!isAuthPage && !isAdminPage && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripProvider>
          <AppContent />
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
