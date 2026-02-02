// Transaction Status Types
export type TransactionStatus =
  | 'waiting_payment'
  | 'waiting_confirmation'
  | 'done'
  | 'rejected'
  | 'expired'
  | 'canceled';

// Transaction Interface - matches API snake_case
export interface Transaction {
  id: string;
  user_id: string;
  event_id: string;
  ticket_tier_id: string;
  quantity: number;
  original_amount?: number;
  discount_amount: number;
  points_used: number;
  points_discount?: number;
  voucher_id?: string;
  coupon_id?: string;
  total_amount: number;
  status: TransactionStatus;
  payment_proof_url?: string;
  created_at: string;
  expires_at: string;
  paid_at?: string;
  confirmed_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
}

// Create Transaction Request
export interface CreateTransactionRequest {
  user_id: string;
  event_id: string;
  ticket_tier_id: string;
  quantity: number;
  original_amount?: number;
  discount_amount: number;
  points_used: number;
  points_discount?: number;
  voucher_id?: string;
  coupon_id?: string;
  total_amount: number;
  status: TransactionStatus;
}

// Update Transaction Request
export interface UpdateTransactionRequest {
  status?: TransactionStatus;
  payment_proof_url?: string;
  paid_at?: string;
  confirmed_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
}

// Attendee Interface
export interface Attendee {
  id: string;
  transaction_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  event_id: string;
  ticket_tier_id: string;
  ticket_tier_name: string;
  quantity: number;
  total_paid: number;
  purchased_at: string;
}

// Helper Functions
export function getStatusLabel(status: TransactionStatus): string {
  const labels: Record<TransactionStatus, string> = {
    waiting_payment: 'Waiting for Payment',
    waiting_confirmation: 'Waiting for Confirmation',
    done: 'Completed',
    rejected: 'Rejected',
    expired: 'Expired',
    canceled: 'Canceled',
  };
  return labels[status];
}

export function getStatusColor(status: TransactionStatus): string {
  const colors: Record<TransactionStatus, string> = {
    waiting_payment: 'status-waiting-payment',
    waiting_confirmation: 'status-waiting-confirmation',
    done: 'status-done',
    rejected: 'status-rejected',
    expired: 'status-expired',
    canceled: 'status-canceled',
  };
  return colors[status];
}
