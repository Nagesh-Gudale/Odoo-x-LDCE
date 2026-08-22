import React, { useState, useEffect } from 'react';
import type { ItinerarySection, ActivitySuggestion, TripData } from '../types/trip';
import { TripContext, DEFAULT_TRIP } from './tripContextDefinition';

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tripData, setTripData] = useState<TripData>(() => {
    const saved = localStorage.getItem('globetrotter_active_trip');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_TRIP;
      }
    }
    return DEFAULT_TRIP;
  });

  useEffect(() => {
    localStorage.setItem('globetrotter_active_trip', JSON.stringify(tripData));
  }, [tripData]);

  const updateTripField = <K extends keyof TripData>(field: K, value: TripData[K]) => {
    setTripData(prev => ({ ...prev, [field]: value }));
  };

  const addSection = (newSectionData: Omit<ItinerarySection, 'id' | 'sectionNumber'>) => {
    setTripData(prev => {
      const nextNum = prev.sections.length + 1;
      const newSec: ItinerarySection = {
        ...newSectionData,
        id: `sec-${Date.now()}`,
        sectionNumber: nextNum,
        title: newSectionData.title || `Section ${nextNum}`
      };
      return {
        ...prev,
        sections: [...prev.sections, newSec]
      };
    });
  };

  const updateSection = (id: string, updatedFields: Partial<ItinerarySection>) => {
    setTripData(prev => ({
      ...prev,
      sections: prev.sections.map(sec => 
        sec.id === id ? { ...sec, ...updatedFields } : sec
      )
    }));
  };

  const deleteSection = (id: string) => {
    setTripData(prev => {
      const filtered = prev.sections.filter(sec => sec.id !== id);
      const renumbered = filtered.map((sec, idx) => ({
        ...sec,
        sectionNumber: idx + 1,
        title: sec.title.startsWith('Section') ? `Section ${idx + 1}: ${sec.title.split(': ')[1] || ''}` : sec.title
      }));
      return {
        ...prev,
        sections: renumbered
      };
    });
  };

  const isActivitySelected = (id: string) => {
    return tripData.selectedSuggestions.includes(id);
  };

  const toggleActivitySelection = (activity: ActivitySuggestion) => {
    setTripData(prev => {
      const isSelected = prev.selectedSuggestions.includes(activity.id);
      let updatedSuggestions: string[];
      const updatedSections = [...prev.sections];

      if (isSelected) {
        updatedSuggestions = prev.selectedSuggestions.filter(id => id !== activity.id);
      } else {
        updatedSuggestions = [...prev.selectedSuggestions, activity.id];
        const nextNum = updatedSections.length + 1;
        updatedSections.push({
          id: `sec-act-${activity.id}`,
          sectionNumber: nextNum,
          title: `Section ${nextNum}: ${activity.title}`,
          category: activity.category === 'Sightseeing' ? 'Sightseeing' : activity.category === 'Adventure' ? 'Activity' : 'Relaxation',
          description: activity.description,
          startDate: prev.startDate,
          endDate: prev.endDate,
          dateRange: `${prev.startDate} to ${prev.endDate}`,
          budget: activity.cost,
          currency: prev.currency,
          location: activity.destination,
          activities: [activity.title],
          notes: `Added from Activity Suggestions (${activity.tag})`,
          status: 'planned'
        });
      }

      return {
        ...prev,
        selectedSuggestions: updatedSuggestions,
        sections: updatedSections
      };
    });
  };

  const totalSectionBudget = tripData.sections.reduce((acc, sec) => acc + (Number(sec.budget) || 0), 0);

  const calculatedDays = (() => {
    if (!tripData.startDate || !tripData.endDate) return 5;
    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) ? 5 : diffDays;
  })();

  return (
    <TripContext.Provider value={{
      tripData,
      setTripData,
      updateTripField,
      addSection,
      updateSection,
      deleteSection,
      toggleActivitySelection,
      isActivitySelected,
      totalSectionBudget,
      calculatedDays
    }}>
      {children}
    </TripContext.Provider>
  );
};
