import { createContext } from 'react';
import type { TripData, ItinerarySection, ActivitySuggestion } from '../types/trip';
import { INITIAL_ITINERARY_SECTIONS } from '../data/tripData';

export interface TripContextType {
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
