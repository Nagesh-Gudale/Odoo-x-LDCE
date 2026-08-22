import { useContext } from 'react';
import { TripContext } from './tripContextDefinition';

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};

export const useTrip = useTripContext;
