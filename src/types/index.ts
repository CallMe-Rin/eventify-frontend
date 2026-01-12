export type UserRole = "customer" | "organizer";

export type TransactionStatus =
  | "waiting_payment"
  | "admin_confirm"
  | "done"
  | "rejected"
  | "expired"
  | "canceled";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  referralCode: string;
  phone?: string;
  bio?: string;
  createdAt: Date;
}

export interface Event {
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
  endDate?: Date;
  organizerId: string;
  organizer?: User;
  ticketTiers: TicketTier[];
  isFree: boolean;
  status: "draft" | "published" | "canceled" | "completed";
  averageRating?: number;
  totalReviews?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketTier {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  price: number; // In IDR
  quantity: number;
  sold: number;
  benefits?: string[];
}

export interface Transaction {
  id: string;
  userId: string;
  eventId: string;
  ticketTierId: string;
  quantity: number;
  totalAmount: number;
  discountAmount: number;
  pointsUsed: number;
  couponId?: string;
  status: TransactionStatus;
  paymentProofUrl?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPoints {
  id: string;
  userId: string;
  amount: number;
  source: "referral" | "purchase" | "bonus";
  expiresAt: Date;
  createdAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usedCount: number;
  isReferral: boolean;
}

export interface Review {
  id: string;
  userId: string;
  eventId: string;
  transactionId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

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

export const EVENT_CATEGORIES: {
  value: EventCategory;
  label: string;
  icon: string;
}[] = [
  { value: "music", label: "Music", icon: "🎵" },
  { value: "technology", label: "Technology", icon: "💻" },
  { value: "sports", label: "Sports", icon: "⚽" },
  { value: "art", label: "Art & Culture", icon: "🎨" },
  { value: "food", label: "Food & Drink", icon: "🍕" },
  { value: "business", label: "Business", icon: "💼" },
  { value: "education", label: "Education", icon: "📚" },
  { value: "health", label: "Health & Wellness", icon: "🧘" },
  { value: "other", label: "Other", icon: "✨" },
];

// Helper to format IDR currency
export const formatIDR = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper to format date
export const formatEventDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export const formatEventTime = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
};
