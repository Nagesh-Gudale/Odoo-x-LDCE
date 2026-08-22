export interface DestinationStop {
  id: string;
  city: string;
  country: string;
  image: string;
  days: number;
  arrivalDate: string;
  departureDate: string;
  cost: number;
  rating: number;
}

export interface ItineraryItem {
  id: string;
  tripId: string;
  dayNumber: number;
  date: string;
  time: string;
  title: string;
  destination: string;
  duration: number; // in hours
  cost: number;
  category: string;
  notes?: string;
  image?: string;
}

export interface Expense {
  id: string;
  tripId: string;
  title: string;
  category: 'Accommodation' | 'Transport' | 'Food' | 'Activities' | 'Shopping' | 'Visa' | 'Insurance' | 'Other';
  amount: number;
  date: string;
  destination?: string;
  notes?: string;
}

export interface TripCollaborator {
  email: string;
  name: string;
  role: 'Viewer' | 'Editor';
  avatar?: string;
}

export interface Trip {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  travelers: number;
  tripType: 'Solo' | 'Couple' | 'Family' | 'Friends' | 'Business';
  travelStyle: 'Relaxed' | 'Balanced' | 'Adventure' | 'Luxury' | 'Budget' | 'Cultural' | 'Food & Travel' | 'Nature';
  coverImage: string;
  destinations: DestinationStop[];
  totalBudget: number; // Planned overall budget limit
  status: 'draft' | 'planned' | 'completed';
  visibility: 'private' | 'shared' | 'public';
  collaborators: TripCollaborator[];
  interests: string[];
}

export interface PostComment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  date: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userLocation: string;
  date: string;
  tripTitle: string;
  image: string;
  description: string;
  tags: string[];
  likes: number;
  isLiked: boolean;
  comments: PostComment[];
}

export interface UserAdminProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'Active' | 'Disabled' | 'Pending';
  joinedDate: string;
  tripsCount: number;
  avatar: string;
}

export const INITIAL_ITINERARY_SECTIONS = [
  {
    id: 'sec-1',
    sectionNumber: 1,
    title: 'Section 1: Arrival & Exploration',
    category: 'Sightseeing' as const,
    description: 'Welcome and check-in.',
    startDate: '2026-09-10',
    endDate: '2026-09-12',
    dateRange: 'Sep 10 - Sep 12',
    budget: 25000,
    currency: '₹',
    location: 'Santorini, Greece',
    activities: ['Wine Tasting Tour', 'Oia Sunset Walk'],
    status: 'planned' as const,
  }
];

// Initial Mock Datasets
export const initialTripsData: Trip[] = [
  {
    id: 'trip-001',
    ownerId: '1',
    ownerName: 'ADMIN',
    name: 'European Summer Adventure',
    description: 'Exploring the highlights of France, Italy, and Greece across two sun-drenched weeks.',
    startDate: '2026-09-01',
    endDate: '2026-09-14',
    travelers: 2,
    tripType: 'Couple',
    travelStyle: 'Balanced',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    destinations: [
      {
        id: 'dest-001',
        city: 'Paris',
        country: 'France',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
        days: 4,
        arrivalDate: '2026-09-01',
        departureDate: '2026-09-05',
        cost: 25000,
        rating: 4.9,
      },
      {
        id: 'dest-002',
        city: 'Rome',
        country: 'Italy',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
        days: 5,
        arrivalDate: '2026-09-05',
        departureDate: '2026-09-10',
        cost: 21500,
        rating: 4.8,
      },
      {
        id: 'dest-003',
        city: 'Santorini',
        country: 'Greece',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
        days: 4,
        arrivalDate: '2026-09-10',
        departureDate: '2026-09-14',
        cost: 26000,
        rating: 4.9,
      },
    ],
    totalBudget: 85000,
    status: 'planned',
    visibility: 'public',
    collaborators: [
      { email: 'sarah@example.com', name: 'Sarah Miller', role: 'Editor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' }
    ],
    interests: ['Food', 'History', 'Culture', 'Photography'],
  },
  {
    id: 'trip-002',
    ownerId: '2',
    ownerName: 'Alex Rivera',
    name: 'Japan Cultural Discovery',
    description: 'Modern metropolis vibes in Tokyo meeting ancient shrines in Kyoto and street food in Osaka.',
    startDate: '2026-10-05',
    endDate: '2026-10-15',
    travelers: 1,
    tripType: 'Solo',
    travelStyle: 'Cultural',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    destinations: [
      {
        id: 'dest-004',
        city: 'Tokyo',
        country: 'Japan',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
        days: 5,
        arrivalDate: '2026-10-05',
        departureDate: '2026-10-10',
        cost: 35000,
        rating: 4.9,
      },
      {
        id: 'dest-005',
        city: 'Kyoto',
        country: 'Japan',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
        days: 5,
        arrivalDate: '2026-10-10',
        departureDate: '2026-10-15',
        cost: 28000,
        rating: 4.9,
      },
    ],
    totalBudget: 75000,
    status: 'planned',
    visibility: 'public',
    collaborators: [],
    interests: ['Culture', 'Food', 'Architecture'],
  },
  {
    id: 'trip-003',
    ownerId: '3',
    ownerName: 'Elena Rostova',
    name: 'Bali Tropical Paradise',
    description: 'Serene rice fields in Ubud, coastal temples in Seminyak, and diving in Nusa Penida.',
    startDate: '2026-11-01',
    endDate: '2026-11-08',
    travelers: 4,
    tripType: 'Friends',
    travelStyle: 'Relaxed',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    destinations: [
      {
        id: 'dest-006',
        city: 'Bali',
        country: 'Indonesia',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
        days: 7,
        arrivalDate: '2026-11-01',
        departureDate: '2026-11-08',
        cost: 32000,
        rating: 4.8,
      },
    ],
    totalBudget: 50000,
    status: 'planned',
    visibility: 'public',
    collaborators: [],
    interests: ['Beaches', 'Nature', 'Wellness'],
  },
];

export const initialItineraryData: ItineraryItem[] = [
  {
    id: 'itin-001',
    tripId: 'trip-001',
    dayNumber: 1,
    date: '2026-09-01',
    time: '09:00',
    title: 'Arrival & Hotel Check-in',
    destination: 'Paris',
    duration: 2,
    cost: 0,
    category: 'Transport',
    notes: 'Check into hotel near Le Marais district.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'itin-002',
    tripId: 'trip-001',
    dayNumber: 1,
    date: '2026-09-01',
    time: '11:00',
    title: 'Paris Food & Wine Walking Tour',
    destination: 'Paris',
    duration: 4,
    cost: 7200,
    category: 'Food & Dining',
    notes: 'Artisanal cheese, macarons, and wine tasting.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'itin-003',
    tripId: 'trip-001',
    dayNumber: 1,
    date: '2026-09-01',
    time: '16:00',
    title: 'Eiffel Tower Sunset Visit',
    destination: 'Paris',
    duration: 3,
    cost: 3500,
    category: 'Activities',
    notes: 'Pre-booked skip-the-line summit tickets.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'itin-004',
    tripId: 'trip-001',
    dayNumber: 2,
    date: '2026-09-02',
    time: '10:00',
    title: 'Louvre Museum Tour',
    destination: 'Paris',
    duration: 4,
    cost: 2200,
    category: 'Culture & History',
    notes: 'Focus on Mona Lisa and Greek sculptures.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'itin-005',
    tripId: 'trip-001',
    dayNumber: 10,
    date: '2026-09-10',
    time: '15:30',
    title: 'Sunset Sailing in Santorini',
    destination: 'Santorini',
    duration: 3,
    cost: 8500,
    category: 'Beach & Water',
    notes: 'Catamaran cruise with BBQ and wine.',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=400&q=80',
  },
];

export const initialExpensesData: Expense[] = [
  {
    id: 'exp-001',
    tripId: 'trip-001',
    title: 'Le Marais Boutique Hotel (4 nights)',
    category: 'Accommodation',
    amount: 38000,
    date: '2026-09-01',
    destination: 'Paris',
    notes: 'Pre-paid room for 2 guests.',
  },
  {
    id: 'exp-002',
    tripId: 'trip-001',
    title: 'Paris Food & Wine Tour',
    category: 'Activities',
    amount: 14400,
    date: '2026-09-01',
    destination: 'Paris',
    notes: 'Tickets for 2 travelers.',
  },
  {
    id: 'exp-003',
    tripId: 'trip-001',
    title: 'Flight Paris to Rome',
    category: 'Transport',
    amount: 12500,
    date: '2026-09-05',
    destination: 'Rome',
    notes: 'Air France economy flight with bags.',
  },
  {
    id: 'exp-004',
    tripId: 'trip-001',
    title: 'Sunset Catamaran Cruise',
    category: 'Activities',
    amount: 17000,
    date: '2026-09-10',
    destination: 'Santorini',
    notes: '2 tickets booked in advance.',
  },
];

export const initialCommunityPostsData: CommunityPost[] = [
  {
    id: 'post-001',
    userId: '2',
    userName: 'Alex Rivera',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    userLocation: 'Tokyo, Japan',
    date: '2 days ago',
    tripTitle: 'Japan in 10 Days',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    description: 'Watching the morning sun illuminate the autumn colors over Kyoto shrines was worth the 5 AM wakeup call!',
    tags: ['Japan', 'Kyoto', 'SoloTravel', 'Culture'],
    likes: 142,
    isLiked: false,
    comments: [
      {
        id: 'c-1',
        userName: 'Sarah Miller',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        text: 'Stunning capture! Adding this to my Japan itinerary.',
        date: '1 day ago',
      },
    ],
  },
  {
    id: 'post-002',
    userId: '3',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    userLocation: 'Santorini, Greece',
    date: '3 days ago',
    tripTitle: 'Greek Island Hopping',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    description: 'Sailing along the caldera as the sun dips into the Aegean sea. Santorini never ceases to amaze.',
    tags: ['Santorini', 'Greece', 'Sailing', 'Sunset'],
    likes: 289,
    isLiked: true,
    comments: [],
  },
  {
    id: 'post-003',
    userId: '4',
    userName: 'Marcus Vance',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    userLocation: 'Dubai, UAE',
    date: '5 days ago',
    tripTitle: 'Arabian Dunes & Skyline',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    description: 'Dune bashing at sunset in Dubai! Unforgettable adrenaline rushes across the red sands.',
    tags: ['Dubai', 'Adventure', 'DesertSafari'],
    likes: 98,
    isLiked: false,
    comments: [],
  },
];

export const initialAdminUsersData: UserAdminProfile[] = [
  {
    id: 'u-1',
    name: 'ADMIN',
    email: 'admin@globetrotter.com',
    role: 'admin',
    status: 'Active',
    joinedDate: 'Jan 10, 2026',
    tripsCount: 12,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'u-2',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    role: 'user',
    status: 'Active',
    joinedDate: 'Feb 14, 2026',
    tripsCount: 4,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'u-3',
    name: 'Elena Rostova',
    email: 'elena@example.com',
    role: 'user',
    status: 'Active',
    joinedDate: 'Mar 01, 2026',
    tripsCount: 3,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'u-4',
    name: 'Marcus Vance',
    email: 'marcus@example.com',
    role: 'user',
    status: 'Pending',
    joinedDate: 'Apr 12, 2026',
    tripsCount: 1,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
];
