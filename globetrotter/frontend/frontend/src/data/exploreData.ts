export interface ExploreDestination {
  id: string;
  city: string;
  country: string;
  region: 'Europe' | 'Asia' | 'Americas' | 'Middle East' | 'Africa';
  rating: number;
  reviewsCount: number;
  costEstimate: number;
  image: string;
  description: string;
  tags: string[];
  travelStyle: 'Relaxed' | 'Balanced' | 'Adventure' | 'Cultural' | 'Luxury';
}

export const EXPLORE_DESTINATIONS_DATA: ExploreDestination[] = [
  {
    id: 'exp-paris',
    city: 'Paris',
    country: 'France',
    region: 'Europe',
    rating: 4.9,
    reviewsCount: 1420,
    costEstimate: 25000,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    description: 'The City of Light boasts world-class museums, iconic architecture, fashion, and haute cuisine.',
    tags: ['Culture', 'Romance', 'Food', 'Museums'],
    travelStyle: 'Cultural',
  },
  {
    id: 'exp-santorini',
    city: 'Santorini',
    country: 'Greece',
    region: 'Europe',
    rating: 4.9,
    reviewsCount: 980,
    costEstimate: 26000,
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    description: 'Famous whitewashed villas, cobalt blue domes, volcanic beaches, and legendary Aegean sunsets.',
    tags: ['Beaches', 'Sunset', 'Luxury', 'Islands'],
    travelStyle: 'Relaxed',
  },
  {
    id: 'exp-tokyo',
    city: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    rating: 4.9,
    reviewsCount: 2100,
    costEstimate: 35000,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    description: 'A dazzling blend of ultramodern skyscrapers, neon lights, ancient temples, and ramen alleys.',
    tags: ['Technology', 'Food', 'Culture', 'Nightlife'],
    travelStyle: 'Balanced',
  },
  {
    id: 'exp-rome',
    city: 'Rome',
    country: 'Italy',
    region: 'Europe',
    rating: 4.8,
    reviewsCount: 1650,
    costEstimate: 21500,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    description: 'Step back into history with the Colosseum, Vatican Museums, trevi fountain, and authentic pasta.',
    tags: ['History', 'Architecture', 'Food'],
    travelStyle: 'Cultural',
  },
  {
    id: 'exp-bali',
    city: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    rating: 4.8,
    reviewsCount: 1890,
    costEstimate: 32000,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    description: 'Lush terraced rice fields, sacred cliffside temples, world-class diving, and wellness retreats.',
    tags: ['Nature', 'Beaches', 'Wellness', 'Adventure'],
    travelStyle: 'Adventure',
  },
  {
    id: 'exp-dubai',
    city: 'Dubai',
    country: 'UAE',
    region: 'Middle East',
    rating: 4.8,
    reviewsCount: 1320,
    costEstimate: 40000,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    description: 'Futuristic architecture, luxury shopping, desert dune safaris, and indoor skiing complexes.',
    tags: ['Luxury', 'Shopping', 'Desert', 'Modern'],
    travelStyle: 'Luxury',
  },
];
