import type { TicketTier } from './event';
import type { Transaction } from './transaction';

export type PaymentMethod =
  | 'credit-card'
  | 'virtual-account'
  | 'wallet'
  | 'paylater'
  | 'qris';

export type DiscountType = 'PERCENTAGE' | 'FIXED';

// Coupon Interface - matches backend CouponResponse
export interface DiscountCoupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string | Date;
  validUntil: string | Date;
  isActive: boolean;
  eventId?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CheckoutCart {
  eventId: string;
  ticketTierId: string;
  quantity: number;
  ticketTier: TicketTier;
}

export interface CheckoutState {
  cart: CheckoutCart;
  attendeeInfo: AttendeeInfo;
  selectedPaymentMethod: PaymentMethod;
  appliedCoupon: DiscountCoupon | null;
  pointsUsed: number;
  isProcessing: boolean;
  error?: string;
}

export interface AttendeeInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface PriceCalculation {
  basePrice: number;
  couponDiscount: number;
  pointsUsed: number;
  finalPayable: number;
  cashbackEarned: number;
}

export interface CheckoutResponse {
  transaction: Transaction;
  cashbackPoints?: number;
}

// Price Breakdown Interface
export interface PriceBreakdown {
  subtotal: number;
  pointsDiscount: number;
  voucherDiscount: number;
  couponDiscount: number;
  totalDiscount: number;
  total: number;
}

// Voucher Interface (Organizer-specific)
export interface Voucher {
  id: string;
  code: string;
  eventId: string;
  organizerId: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
}
