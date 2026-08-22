import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Trips } from '../pages/Trips';
import { CreateTrip } from '../pages/CreateTrip';
import { TripDetails } from '../pages/TripDetails';
import { Profile } from '../pages/Profile';
import { Community } from '../pages/Community';
import { Calendar } from '../pages/Calendar';
import { AdminDashboard } from '../pages/AdminDashboard';
import { AdminUsers } from '../pages/AdminUsers';
import { 
  ExploreCitiesPlaceholder, 
  ExploreActivitiesPlaceholder, 
  TripBuilderPlaceholder,
  AboutPlaceholder 
} from '../pages/Placeholders';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root redirect to Home */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      
      {/* Primary Routes */}
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/trips" element={<Trips />} />
      <Route path="/trips/create" element={<CreateTrip />} />
      <Route path="/trips/:tripId" element={<TripDetails />} />
      
      {/* Explore & Planner Placeholders */}
      <Route path="/search/cities" element={<ExploreCitiesPlaceholder />} />
      <Route path="/search/activities" element={<ExploreActivitiesPlaceholder />} />
      <Route path="/trips/build" element={<TripBuilderPlaceholder />} />
      
      {/* Utility Pages */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/community" element={<Community />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/about" element={<AboutPlaceholder />} />
      
      {/* Admin Panel Console */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};
