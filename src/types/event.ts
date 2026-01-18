export type EventCategory =
  | "music"
  | "technology"
  | "sports"
  | "art"
  | "food"
  | "business"
  | "education"
  | "health"
  | "other";

export type EventStatus = "draft" | "published" | "canceled" | "completed";

export interface TicketTier {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  sold: number;
  benfits?: string[];
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  images: string[];
  category: EventCategory;
  location: string;
  venue: string;
  date: Date;
  endDate?: string | null;
  organizerId: string;
  isFree: boolean;
  status: EventStatus;
  averageRating?: number;
  totalReviews?: number;
  createdAt: Date;
  updatedAt: Date;
}

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
  { id: "cat-music", value: "music", label: "Music", icon: "🎵" },
  { id: "cat-tech", value: "technology", label: "Technology", icon: "💻" },
  { id: "cat-sports", value: "sports", label: "Sports", icon: "⚽" },
  { id: "cat-art", value: "art", label: "Art & Culture", icon: "🎨" },
  { id: "cat-food", value: "food", label: "Food & Drink", icon: "🍕" },
  { id: "cat-biz", value: "business", label: "Business", icon: "💼" },
  { id: "cat-edu", value: "education", label: "Education", icon: "📚" },
  { id: "cat-health", value: "health", label: "Health & Wellness", icon: "🧘" },
  { id: "cat-other", value: "other", label: "Other", icon: "✨" },
];

export const EVENT_TYPES = [
  { value: "all", label: "All Events" },
  { value: "paid", label: "Paid Events" },
  { value: "free", label: "Free Events" },
] as const;
