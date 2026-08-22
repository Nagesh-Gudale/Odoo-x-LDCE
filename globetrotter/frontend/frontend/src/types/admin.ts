export type UserStatus = 'active' | 'suspended' | 'pending';
export type UserRole = 'Admin' | 'Pro Explorer' | 'Traveler' | 'Guide';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  tripsCount: number;
  status: UserStatus;
  role: UserRole;
  joinedDate: string;
  lastActive: string;
  country: string;
}

export type TripStatus = 'Planned' | 'In Progress' | 'Completed' | 'Draft';

export interface AdminTripItem {
  id: string;
  title: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: string;
  isPublic: boolean;
  status: TripStatus;
  createdAt: string;
  sectionsCount: number;
}

export interface AdminDestinationItem {
  id: string;
  name: string;
  country: string;
  region: string;
  totalTrips: number;
  totalActivities: number;
  averageCost: number;
  currency: string;
  popularityScore: number;
  isFeatured: boolean;
  status: 'active' | 'archived';
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalTrips: number;
  publicTrips: number;
  totalDestinations: number;
  totalActivities: number;
  totalBudgetVolume: number;
  userGrowthPercent: number;
  tripGrowthPercent: number;
  publicTripsPercent: number;
}
