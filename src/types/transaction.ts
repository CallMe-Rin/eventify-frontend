// Transaction Status from Prisma schema
export type TransactionStatus =
  | 'WAITING_PAYMENT'
  | 'WAITING_CONFIRMATION'
  | 'DONE'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELED';

// Transaction Interface - matches backend TransactionResponse
export interface Transaction {
  id: string;
  userId: string;
  eventId: string;
  ticketTierId: string;
  quantity: number;
  totalAmount: number;
  discountAmount: number;
  pointsUsed: number;
  status: TransactionStatus;
  paymentProofUrl?: string;
  couponId?: string;
  createdAt: string | Date;
  expiresAt?: string | Date;
}

// Create Transaction Request for API
export interface CreateTransactionRequest {
  eventId: string;
  ticketTierId: string;
  quantity: number;
  pointsUsed?: number;
  couponCode?: string;
}

// Update Transaction Request for API
export interface UpdateTransactionRequest {
  status?: TransactionStatus;
  paymentProofUrl?: string;
}

// Payment Proof Upload Request
export interface PaymentProofRequest {
  proofUrl: string;
}

// Paginated Transaction Response
export interface PaginatedTransactionResponse {
  data: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Helper Functions
export function getStatusLabel(status: TransactionStatus): string {
  const labels: Record<TransactionStatus, string> = {
    WAITING_PAYMENT: 'Waiting for Payment',
    WAITING_CONFIRMATION: 'Waiting for Confirmation',
    DONE: 'Completed',
    REJECTED: 'Rejected',
    EXPIRED: 'Expired',
    CANCELED: 'Canceled',
  };
  return labels[status];
}

export function getStatusColor(status: TransactionStatus): string {
  const colors: Record<TransactionStatus, string> = {
    WAITING_PAYMENT: 'status-waiting-payment',
    WAITING_CONFIRMATION: 'status-waiting-confirmation',
    DONE: 'status-done',
    REJECTED: 'status-rejected',
    EXPIRED: 'status-expired',
    CANCELED: 'status-canceled',
  };
  return colors[status];
}
