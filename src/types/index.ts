// Re-export all types from user for backward compatibility
export type {
  UserRole,
  User,
  UserPoints,
  Profile,
  Coupon,
  Review,
} from "./user";

// Re-export all types from event
export type {
  EventCategory,
  EventStatus,
  TicketTier,
  EventItem,
  EventWithTiers,
  Category,
} from "./event";

export { EVENT_CATEGORIES, EVENT_TYPES } from "./event";

// Re-export all types from checkout
export type {
  PaymentMethod,
  DiscountCoupon,
  CheckoutCart,
  CheckoutState,
  AttendeeInfo,
  PriceCalculation,
  CheckoutResponse,
} from "./checkout";

// Re-export all types from location
export type { Location } from "./location";
export { LOCATIONS } from "./location";

// Formatting utilities
export const formatIDR = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatEventDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export const formatEventTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
};
