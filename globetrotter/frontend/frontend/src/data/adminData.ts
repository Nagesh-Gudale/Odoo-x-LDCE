import type { 
  AdminUser, 
  AdminTripItem, 
  AdminDestinationItem, 
  AdminDashboardStats 
} from '../types/admin';

export const ADMIN_STATS: AdminDashboardStats = {
  totalUsers: 15420,
  totalTrips: 25890,
  publicTrips: 18420,
  totalDestinations: 450,
  totalActivities: 1840,
  totalBudgetVolume: 324500000,
  userGrowthPercent: 14.2,
  tripGrowthPercent: 22.5,
  publicTripsPercent: 71.1
};

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-1',
    name: 'Archita Thakur',
    email: 'archita@globetrotter.io',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    tripsCount: 12,
    status: 'active',
    role: 'Admin',
    joinedDate: '2025-04-12',
    lastActive: 'Just now',
    country: 'India'
  },
  {
    id: 'usr-2',
    name: 'Elena Rostova',
    email: 'elena.rostova@travelmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    tripsCount: 8,
    status: 'active',
    role: 'Pro Explorer',
    joinedDate: '2025-06-20',
    lastActive: '15 mins ago',
    country: 'Greece'
  },
  {
    id: 'usr-3',
    name: 'Marcus Vance',
    email: 'marcus.vance@adventure.co',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    tripsCount: 15,
    status: 'active',
    role: 'Pro Explorer',
    joinedDate: '2025-02-10',
    lastActive: '2 hours ago',
    country: 'United Kingdom'
  },
  {
    id: 'usr-4',
    name: 'Sophia Chen',
    email: 'sophia.c@wanderlust.net',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    tripsCount: 5,
    status: 'active',
    role: 'Traveler',
    joinedDate: '2025-08-15',
    lastActive: '5 hours ago',
    country: 'Singapore'
  },
  {
    id: 'usr-5',
    name: 'Liam O\'Connor',
    email: 'liam.oc@celticjourney.ie',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    tripsCount: 3,
    status: 'pending',
    role: 'Traveler',
    joinedDate: '2026-01-04',
    lastActive: '1 day ago',
    country: 'Ireland'
  },
  {
    id: 'usr-6',
    name: 'Amira Benali',
    email: 'amira.b@atlasguide.org',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    tripsCount: 19,
    status: 'active',
    role: 'Guide',
    joinedDate: '2025-03-28',
    lastActive: 'Yesterday',
    country: 'Morocco'
  },
  {
    id: 'usr-7',
    name: 'David Miller',
    email: 'david.miller99@outlook.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    tripsCount: 1,
    status: 'suspended',
    role: 'Traveler',
    joinedDate: '2025-11-19',
    lastActive: '12 days ago',
    country: 'United States'
  },
  {
    id: 'usr-8',
    name: 'Clara Dubois',
    email: 'clara.dubois@voyageur.fr',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    tripsCount: 7,
    status: 'active',
    role: 'Pro Explorer',
    joinedDate: '2025-07-08',
    lastActive: '3 hours ago',
    country: 'France'
  }
];

export const INITIAL_ADMIN_TRIPS: AdminTripItem[] = [
  {
    id: 'trp-101',
    title: 'Santorini Sunset & Volcanic Caldera Tour',
    userName: 'Archita Thakur',
    userEmail: 'archita@globetrotter.io',
    destination: 'Santorini, Greece',
    startDate: '2026-09-10',
    endDate: '2026-09-16',
    travelers: 2,
    budget: 110000,
    currency: '₹',
    isPublic: true,
    status: 'Planned',
    createdAt: '2026-08-20',
    sectionsCount: 3
  },
  {
    id: 'trp-102',
    title: 'Amalfi Coast Romantic Escape',
    userName: 'Elena Rostova',
    userEmail: 'elena.rostova@travelmail.com',
    destination: 'Amalfi Coast, Italy',
    startDate: '2026-07-05',
    endDate: '2026-07-12',
    travelers: 2,
    budget: 145000,
    currency: '₹',
    isPublic: true,
    status: 'Planned',
    createdAt: '2026-08-18',
    sectionsCount: 4
  },
  {
    id: 'trp-103',
    title: 'Swiss Alps Glacial High Peaks Hike',
    userName: 'Marcus Vance',
    userEmail: 'marcus.vance@adventure.co',
    destination: 'Swiss Alps, Switzerland',
    startDate: '2026-08-01',
    endDate: '2026-08-09',
    travelers: 4,
    budget: 240000,
    currency: '₹',
    isPublic: true,
    status: 'In Progress',
    createdAt: '2026-07-15',
    sectionsCount: 5
  },
  {
    id: 'trp-104',
    title: 'Bali Hidden Waterfalls & Cultural Temples',
    userName: 'Sophia Chen',
    userEmail: 'sophia.c@wanderlust.net',
    destination: 'Bali, Indonesia',
    startDate: '2026-06-10',
    endDate: '2026-06-18',
    travelers: 3,
    budget: 85000,
    currency: '₹',
    isPublic: false,
    status: 'Completed',
    createdAt: '2026-05-22',
    sectionsCount: 4
  },
  {
    id: 'trp-105',
    title: 'Parisian Twilight & Gastronomy Week',
    userName: 'Clara Dubois',
    userEmail: 'clara.dubois@voyageur.fr',
    destination: 'Paris, France',
    startDate: '2026-10-02',
    endDate: '2026-10-08',
    travelers: 2,
    budget: 135000,
    currency: '₹',
    isPublic: true,
    status: 'Planned',
    createdAt: '2026-08-21',
    sectionsCount: 4
  },
  {
    id: 'trp-106',
    title: 'Dubai Skyline & Desert Safari Luxury',
    userName: 'David Miller',
    userEmail: 'david.miller99@outlook.com',
    destination: 'Dubai, UAE',
    startDate: '2026-11-14',
    endDate: '2026-11-20',
    travelers: 2,
    budget: 180000,
    currency: '₹',
    isPublic: false,
    status: 'Draft',
    createdAt: '2026-08-10',
    sectionsCount: 2
  }
];

export const INITIAL_ADMIN_DESTINATIONS: AdminDestinationItem[] = [
  {
    id: 'dst-1',
    name: 'Santorini',
    country: 'Greece',
    region: 'Southern Aegean',
    totalTrips: 4210,
    totalActivities: 64,
    averageCost: 110000,
    currency: '₹',
    popularityScore: 98,
    isFeatured: true,
    status: 'active'
  },
  {
    id: 'dst-2',
    name: 'Amalfi Coast',
    country: 'Italy',
    region: 'Campania',
    totalTrips: 3840,
    totalActivities: 52,
    averageCost: 145000,
    currency: '₹',
    popularityScore: 96,
    isFeatured: true,
    status: 'active'
  },
  {
    id: 'dst-3',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Lesser Sunda',
    totalTrips: 5120,
    totalActivities: 88,
    averageCost: 75000,
    currency: '₹',
    popularityScore: 95,
    isFeatured: true,
    status: 'active'
  },
  {
    id: 'dst-4',
    name: 'Swiss Alps',
    country: 'Switzerland',
    region: 'Valais & Bernese Oberland',
    totalTrips: 2890,
    totalActivities: 45,
    averageCost: 180000,
    currency: '₹',
    popularityScore: 94,
    isFeatured: true,
    status: 'active'
  },
  {
    id: 'dst-5',
    name: 'Paris',
    country: 'France',
    region: 'Île-de-France',
    totalTrips: 6420,
    totalActivities: 112,
    averageCost: 135000,
    currency: '₹',
    popularityScore: 97,
    isFeatured: true,
    status: 'active'
  },
  {
    id: 'dst-6',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    totalTrips: 3410,
    totalActivities: 58,
    averageCost: 95000,
    currency: '₹',
    popularityScore: 91,
    isFeatured: true,
    status: 'active'
  }
];
