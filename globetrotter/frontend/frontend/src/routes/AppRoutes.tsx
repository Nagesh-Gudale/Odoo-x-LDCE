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
import { BuildItinerary } from '../pages/BuildItinerary';
import { TripBudget } from '../pages/TripBudget';
import { Profile } from '../pages/Profile';
import { Community } from '../pages/Community';
import { CalendarPage } from '../pages/CalendarPage';
import { Activities } from '../pages/Activities';
import { ActivityDetails } from '../pages/ActivityDetails';

// Admin Imports
import { AdminLayout } from '../pages/admin/AdminLayout';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminUsers } from '../pages/admin/AdminUsers';
import { AdminTrips } from '../pages/admin/AdminTrips';
import { AdminActivities } from '../pages/admin/AdminActivities';
import { AdminDestinations } from '../pages/admin/AdminDestinations';
import { AdminAnalytics } from '../pages/admin/AdminAnalytics';

import { ExploreCitiesPlaceholder, AboutPlaceholder } from '../pages/Placeholders';

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

      {/* Public Trips, Activities, and Community Discovery */}
      <Route path="/trips" element={<Trips />} />
      <Route path="/activities" element={<Activities />} />
      <Route path="/activities/:id" element={<ActivityDetails />} />
      <Route path="/search/activities" element={<Activities />} />
      <Route path="/community" element={<Community />} />
      <Route path="/search/cities" element={<ExploreCitiesPlaceholder />} />
      <Route path="/about" element={<AboutPlaceholder />} />

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
        path="/trips/:id/itinerary" 
        element={
          <ProtectedRoute>
            <BuildItinerary />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/trips/:id/budget" 
        element={
          <ProtectedRoute>
            <TripBudget />
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
            <CalendarPage />
          </ProtectedRoute>
        } 
      />

      {/* Protected Admin Portal Console */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="trips" element={<AdminTrips />} />
        <Route path="activities" element={<AdminActivities />} />
        <Route path="destinations" element={<AdminDestinations />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};
