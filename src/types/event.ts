// Event Status from Prisma schema
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';

// Event Category from Prisma schema
export type EventCategory =
  | 'TECHNOLOGY'
  | 'MUSIC'
  | 'BUSINESS'
  | 'HEALTH'
  | 'FOOD'
  | 'ART'
  | 'SPORTS'
  | 'EDUCATION';

// Ticket Tier - matches backend TicketTierResponse
export interface TicketTier {
  id: string;
  eventId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sold: number;
  benefits: string[];
}

// Event Item - matches backend EventResponse
export interface EventItem {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  coverImage: string;
  images: string[];
  categoryId: string;
  category: {
    value: EventCategory;
  };
  locationId: string;
  venue: string;
  date: string | Date;
  endDate?: string | Date;
  organizerId: string;
  isFree: boolean;
  status: EventStatus;
  averageRating: number;
  totalReviews: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Event with Ticket Tiers
export interface EventWithTiers extends EventItem {
  ticketTiers: TicketTier[];
}

export interface Category {
  id: string;
  value: EventCategory;
  label: string;
  icon: string;
}

export const EVENT_CATEGORIES: Category[] = [
  { id: 'cat-music', value: 'MUSIC', label: 'Music', icon: '🎵' },
  { id: 'cat-tech', value: 'TECHNOLOGY', label: 'Technology', icon: '💻' },
  { id: 'cat-sports', value: 'SPORTS', label: 'Sports', icon: '⚽' },
  { id: 'cat-art', value: 'ART', label: 'Art & Culture', icon: '🎨' },
  { id: 'cat-food', value: 'FOOD', label: 'Food & Drink', icon: '🍕' },
  { id: 'cat-biz', value: 'BUSINESS', label: 'Business', icon: '💼' },
  { id: 'cat-edu', value: 'EDUCATION', label: 'Education', icon: '📚' },
  { id: 'cat-health', value: 'HEALTH', label: 'Health & Wellness', icon: '🧘' },
];

export const EVENT_TYPES = [
  { value: 'all', label: 'All Events' },
  { value: 'paid', label: 'Paid Events' },
  { value: 'free', label: 'Free Events' },
] as const;
