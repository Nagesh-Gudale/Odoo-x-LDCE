import React, { useState, useEffect } from 'react';
import type { ItinerarySection, ActivitySuggestion, TripData } from '../types/trip';
import { TripContext, DEFAULT_TRIP } from './tripContextDefinition';
import type { 
  Trip, 
  ItineraryItem, 
  Expense, 
  CommunityPost, 
  UserAdminProfile 
} from '../data/tripData';
import { 
  initialTripsData, 
  initialItineraryData, 
  initialExpensesData, 
  initialCommunityPostsData, 
  initialAdminUsersData 
} from '../data/tripData';

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Legacy Active Trip
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

  // Multi-Trip State
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('globetrotter_trips');
    if (saved) {
      try { return JSON.parse(saved); } catch { return initialTripsData; }
    }
    return initialTripsData;
  });

  // Itinerary Items State
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>(() => {
    const saved = localStorage.getItem('globetrotter_itineraries');
    if (saved) {
      try { return JSON.parse(saved); } catch { return initialItineraryData; }
    }
    return initialItineraryData;
  });

  // Expenses State
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('globetrotter_expenses');
    if (saved) {
      try { return JSON.parse(saved); } catch { return initialExpensesData; }
    }
    return initialExpensesData;
  });

  // Community Posts State
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('globetrotter_community');
    if (saved) {
      try { return JSON.parse(saved); } catch { return initialCommunityPostsData; }
    }
    return initialCommunityPostsData;
  });

  // Admin Users State
  const [adminUsers, setAdminUsers] = useState<UserAdminProfile[]>(() => {
    const saved = localStorage.getItem('globetrotter_admin_users');
    if (saved) {
      try { return JSON.parse(saved); } catch { return initialAdminUsersData; }
    }
    return initialAdminUsersData;
  });

  // LocalStorage Persist Sync
  useEffect(() => {
    localStorage.setItem('globetrotter_active_trip', JSON.stringify(tripData));
  }, [tripData]);

  useEffect(() => {
    localStorage.setItem('globetrotter_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('globetrotter_itineraries', JSON.stringify(itineraryItems));
  }, [itineraryItems]);

  useEffect(() => {
    localStorage.setItem('globetrotter_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('globetrotter_community', JSON.stringify(communityPosts));
  }, [communityPosts]);

  useEffect(() => {
    localStorage.setItem('globetrotter_admin_users', JSON.stringify(adminUsers));
  }, [adminUsers]);

  // Legacy Helpers
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
        sections: updatedSections,
        selectedSuggestions: updatedSuggestions
      };
    });
  };

  const totalSectionBudget = tripData.sections.reduce((acc, sec) => acc + (sec.budget || 0), 0);

  const calculatedDays = Math.max(
    1,
    Math.ceil(
      (new Date(tripData.endDate).getTime() - new Date(tripData.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1
  );

  // Extended Multi-Trip Actions
  const createTrip = (newTripData: Omit<Trip, 'id'>): Trip => {
    const newId = `trip-${Date.now()}`;
    const created: Trip = {
      ...newTripData,
      id: newId,
    };
    setTrips(prev => [created, ...prev]);
    return created;
  };

  const updateTrip = (id: string, updatedFields: Partial<Trip>) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(t => t.id !== id));
    setItineraryItems(prev => prev.filter(i => i.tripId !== id));
    setExpenses(prev => prev.filter(e => e.tripId !== id));
  };

  const addItineraryItem = (itemData: Omit<ItineraryItem, 'id'>) => {
    const newItem: ItineraryItem = {
      ...itemData,
      id: `itin-${Date.now()}`,
    };
    setItineraryItems(prev => [...prev, newItem]);
  };

  const updateItineraryItem = (id: string, updatedFields: Partial<ItineraryItem>) => {
    setItineraryItems(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
  };

  const deleteItineraryItem = (id: string) => {
    setItineraryItems(prev => prev.filter(item => item.id !== id));
  };

  const reorderItineraryItems = (tripId: string, dayNumber: number, items: ItineraryItem[]) => {
    setItineraryItems(prev => {
      const remaining = prev.filter(item => !(item.tripId === tripId && item.dayNumber === dayNumber));
      return [...remaining, ...items];
    });
  };

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const updateExpense = (id: string, updatedFields: Partial<Expense>) => {
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, ...updatedFields } : exp));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const addCommunityPost = (postData: Omit<CommunityPost, 'id' | 'likes' | 'isLiked' | 'comments'>) => {
    const newPost: CommunityPost = {
      ...postData,
      id: `post-${Date.now()}`,
      likes: 0,
      isLiked: false,
      comments: [],
    };
    setCommunityPosts(prev => [newPost, ...prev]);
  };

  const toggleLikePost = (postId: string) => {
    setCommunityPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  const addCommentToPost = (postId: string, commentText: string, userName: string) => {
    setCommunityPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            userName: userName || 'Traveler',
            userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            text: commentText,
            date: 'Just now',
          };
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
  };

  const updateUserStatus = (userId: string, status: UserAdminProfile['status']) => {
    setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
  };

  const deleteUser = (userId: string) => {
    setAdminUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <TripContext.Provider
      value={{
        tripData,
        setTripData,
        updateTripField,
        addSection,
        updateSection,
        deleteSection,
        toggleActivitySelection,
        isActivitySelected,
        totalSectionBudget,
        calculatedDays,
        trips,
        itineraryItems,
        expenses,
        communityPosts,
        adminUsers,
        createTrip,
        updateTrip,
        deleteTrip,
        addItineraryItem,
        updateItineraryItem,
        deleteItineraryItem,
        reorderItineraryItems,
        addExpense,
        updateExpense,
        deleteExpense,
        addCommunityPost,
        toggleLikePost,
        addCommentToPost,
        updateUserStatus,
        deleteUser,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};
