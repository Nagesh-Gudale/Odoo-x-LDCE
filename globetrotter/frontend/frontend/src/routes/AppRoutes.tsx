import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { Trips } from '../pages/Trips';
import { CreateTrip } from '../pages/CreateTrip';
import { TripDetails } from '../pages/TripDetails';
import { Profile } from '../pages/Profile';
import { Community } from '../pages/Community';
import { Calendar } from '../pages/Calendar';
import { AdminDashboard } from '../pages/AdminDashboard';
import { AdminUsers } from '../pages/AdminUsers';
import { Activities } from '../pages/Activities';
import { ActivityDetails } from '../pages/ActivityDetails';
import { 
  ExploreCitiesPlaceholder, 
  TripBuilderPlaceholder,
  AboutPlaceholder 
} from '../pages/Placeholders';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root redirect to Home */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      
      {/* Primary Public Routes */}
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Public Trips & Activities Discovery */}
      <Route path="/trips" element={<Trips />} />
      <Route path="/activities" element={<Activities />} />
      <Route path="/activities/:id" element={<ActivityDetails />} />
      <Route path="/search/activities" element={<Activities />} />

      {/* Protected User Action Routes */}
      <Route 
        path="/trips/create" 
        element={
          <ProtectedRoute>
            <CreateTrip />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/trips/:tripId" 
        element={
          <ProtectedRoute>
            <TripDetails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/calendar" 
        element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        } 
      />

      {/* Explore & Planner Public Placeholders */}
      <Route path="/search/cities" element={<ExploreCitiesPlaceholder />} />
      <Route path="/trips/build" element={<TripBuilderPlaceholder />} />
      
      {/* Community & Utility Pages */}
      <Route path="/community" element={<Community />} />
      <Route path="/about" element={<AboutPlaceholder />} />
      
      {/* Admin Panel Console */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute>
            <AdminUsers />
          </ProtectedRoute>
        } 
      />

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};
