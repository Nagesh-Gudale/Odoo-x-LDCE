import { createContext } from 'react';
import type { TripData, ItinerarySection, ActivitySuggestion } from '../types/trip';
import type { Trip, ItineraryItem, Expense, CommunityPost, UserAdminProfile } from '../data/tripData';
import { INITIAL_ITINERARY_SECTIONS } from '../data/tripData';

export interface TripContextType {
  // Legacy / Active single trip state
  tripData: TripData;
  setTripData: React.Dispatch<React.SetStateAction<TripData>>;
  updateTripField: <K extends keyof TripData>(field: K, value: TripData[K]) => void;
  addSection: (section: Omit<ItinerarySection, 'id' | 'sectionNumber'>) => void;
  updateSection: (id: string, updatedFields: Partial<ItinerarySection>) => void;
  deleteSection: (id: string) => void;
  toggleActivitySelection: (activity: ActivitySuggestion) => void;
  isActivitySelected: (id: string) => boolean;
  totalSectionBudget: number;
  calculatedDays: number;

  // Extended Multi-Trip & Module Management State
  trips: Trip[];
  itineraryItems: ItineraryItem[];
  expenses: Expense[];
  communityPosts: CommunityPost[];
  adminUsers: UserAdminProfile[];

  // CRUD Actions
  createTrip: (newTrip: Omit<Trip, 'id'>) => Trip;
  updateTrip: (id: string, updatedFields: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  addItineraryItem: (item: Omit<ItineraryItem, 'id'>) => void;
  updateItineraryItem: (id: string, updatedFields: Partial<ItineraryItem>) => void;
  deleteItineraryItem: (id: string) => void;
  reorderItineraryItems: (tripId: string, dayNumber: number, items: ItineraryItem[]) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, updatedFields: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'likes' | 'isLiked' | 'comments'>) => void;
  toggleLikePost: (postId: string) => void;
  addCommentToPost: (postId: string, commentText: string, userName: string) => void;
  updateUserStatus: (userId: string, status: UserAdminProfile['status']) => void;
  deleteUser: (userId: string) => void;
}

export const DEFAULT_TRIP: TripData = {
  id: 'trip-current',
  title: 'Santorini Sunset & Island Adventure',
  destination: 'Santorini, Greece',
  startingLocation: 'Mumbai, India',
  startDate: '2026-09-10',
  endDate: '2026-09-16',
  travelers: 2,
  estimatedBudget: 110000,
  currency: '₹',
  description: 'A customized multi-day journey across the Aegean volcanic caldera, sunset wine tastings, cave suites, and hidden coastal beaches.',
  sections: INITIAL_ITINERARY_SECTIONS,
  selectedSuggestions: ['act-1', 'act-3']
};

export const TripContext = createContext<TripContextType | undefined>(undefined);
