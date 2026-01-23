import type { TicketTier } from './event';

export type PaymentMethod =
  | 'credit-card'
  | 'virtual-account'
  | 'wallet'
  | 'paylater'
  | 'qris';

export interface DiscountCoupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase?: number;
  max_discount?: number;
  valid_from: string;
  valid_until: string;
  usage_limit?: number;
  used_count: number;
  is_referral?: boolean;
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
  status:
    | 'waiting_payment'
    | 'admin_confirm'
    | 'done'
    | 'rejected'
    | 'expired'
    | 'canceled';
  paymentProofUrl?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
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
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
}
