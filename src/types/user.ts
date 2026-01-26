// User types
export type UserRole = 'customer' | 'organizer';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  referralCode: string;
  role: UserRole;
  points: number;
  pointsExpireAt?: string;
  createdAt: string;
}

export interface UserPoints {
  id: string;
  userId: string;
  amount: number;
  source: 'referral' | 'purchase' | 'bonus' | 'cashback';
  expiresAt: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  name: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  referral_code: string;
  created_at: string;
  updated_at: string;
}
/*
// Transaction types
export type TransactionStatus =
  | "waiting_payment"
  | "admin_confirm"
  | "done"
  | "rejected"
  | "expired"
  | "canceled";

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
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}
*/

// Review types
export interface Review {
  id: string;
  userId: string;
  eventId: string;
  transactionId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
