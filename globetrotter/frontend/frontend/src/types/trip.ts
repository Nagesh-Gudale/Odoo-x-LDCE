export interface DestinationSuggestion {
  id: string;
  title: string;
  city: string;
  country: string;
  category: 'Sightseeing' | 'Adventure' | 'Food & Culture' | 'Beaches' | 'Relaxation' | 'Luxury';
  estimatedCost: number;
  currency: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  description: string;
  highlights: string[];
  recommendedDuration: string;
}

export interface ActivitySuggestion {
  id: string;
  title: string;
  destination: string;
  category: 'Sightseeing' | 'Adventure' | 'Food & Culture' | 'Beaches' | 'Relaxation';
  cost: number;
  duration: string;
  rating: number;
  imageUrl: string;
  description: string;
  tag: string;
}

export interface ItinerarySection {
  id: string;
  sectionNumber: number;
  title: string;
  category: 'Travel' | 'Hotel' | 'Sightseeing' | 'Dining' | 'Activity' | 'Relaxation';
  description: string;
  startDate: string;
  endDate: string;
  dateRange: string;
  budget: number;
  currency: string;
  location: string;
  activities?: string[];
  notes?: string;
  status?: 'planned' | 'confirmed' | 'optional';
}

export interface TripData {
  id: string;
  title: string;
  destination: string;
  startingLocation: string;
  startDate: string;
  endDate: string;
  travelers: number;
  estimatedBudget: number;
  currency: string;
  description: string;
  sections: ItinerarySection[];
  selectedSuggestions: string[];
}
