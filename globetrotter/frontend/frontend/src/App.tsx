<<<<<<< Updated upstream
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AppRoutes } from './routes/AppRoutes';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main>
        <AppRoutes />
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
=======
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TripProvider } from './context/TripContext';
import CreateTrip from './pages/CreateTrip';
import BuildItinerary from './pages/BuildItinerary';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTrips from './pages/admin/AdminTrips';
import './App.css';

function App() {
  return (
    <TripProvider>
      <BrowserRouter>
        <Routes>
          {/* Traveler View: Screen 4 - Create a new Trip */}
          <Route path="/" element={<CreateTrip />} />
          <Route path="/trips/create" element={<CreateTrip />} />
          <Route path="/create-trip" element={<CreateTrip />} />

          {/* Traveler View: Screen 5 - Build Itinerary */}
          <Route path="/trips/build" element={<BuildItinerary />} />
          <Route path="/build-itinerary" element={<BuildItinerary />} />

          {/* Admin Portal Views: Sections 26 & 27 */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="trips" element={<AdminTrips />} />
            <Route path="destinations" element={<AdminTrips />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TripProvider>
  );
}

export default App;
>>>>>>> Stashed changes
