// Transaction Status Types
export type TransactionStatus =
  | "waiting_payment"
  | "waiting_confirmation"
  | "done"
  | "rejected"
  | "expired"
  | "canceled";

// Transaction Interface
export interface Transaction {
  id: string;
  userId: string;
  eventId: string;
  ticketTierId: string;
  quantity: number;
  originalAmount: number;
  discountAmount: number;
  pointsUsed: number;
  pointsDiscount: number;
  voucherId?: string;
  couponId?: string;
  totalAmount: number;
  status: TransactionStatus;
  paymentProofUrl?: string;
  createdAt: string;
  expiresAt: string;
  paidAt?: string;
  confirmedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

// Create Transaction Request
export interface CreateTransactionRequest {
  userId: string;
  eventId: string;
  ticketTierId: string;
  quantity: number;
  originalAmount: number;
  discountAmount: number;
  pointsUsed: number;
  pointsDiscount: number;
  voucherId?: string;
  couponId?: string;
  totalAmount: number;
  status: TransactionStatus;
}

// Update Transaction Request
export interface UpdateTransactionRequest {
  status?: TransactionStatus;
  paymentProofUrl?: string;
  paidAt?: string;
  confirmedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

// Attendee Interface (for organizer view)
export interface Attendee {
  id: string;
  transactionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  eventId: string;
  ticketTierId: string;
  ticketTierName: string;
  quantity: number;
  totalPaid: number;
  purchasedAt: string;
}

// Helper Functions
export function getStatusLabel(status: TransactionStatus): string {
  const labels: Record<TransactionStatus, string> = {
    waiting_payment: "Waiting for Payment",
    waiting_confirmation: "Waiting for Confirmation",
    done: "Completed",
    rejected: "Rejected",
    expired: "Expired",
    canceled: "Canceled",
  };
  return labels[status];
}

export function getStatusColor(status: TransactionStatus): string {
  const colors: Record<TransactionStatus, string> = {
    waiting_payment: "status-waiting-payment",
    waiting_confirmation: "status-waiting-confirmation",
    done: "status-done",
    rejected: "status-rejected",
    expired: "status-expired",
    canceled: "status-canceled",
  };
  return colors[status];
}
