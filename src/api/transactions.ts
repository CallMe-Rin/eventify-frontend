import { axiosInstance } from '@/lib/axiosInstance';
import type { Transaction, TransactionStatus } from '@/types/api';
import type { CreateTransactionRequest } from '@/types/api';

interface FetchTransactionsParams {
  status?: TransactionStatus;
  eventId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// Fetch user transactions (requires auth)
export async function fetchTransactions(
  params?: FetchTransactionsParams,
): Promise<Transaction[]> {
  const { data } = await axiosInstance.get<{ data: Transaction[] }>(
    '/api/transactions',
    { params },
  );
  return Array.isArray(data) ? data : data.data || [];
}

// Create transaction (requires auth)
export async function createTransaction(
  request: CreateTransactionRequest,
): Promise<Transaction> {
  const { data } = await axiosInstance.post<{ data: Transaction }>(
    '/api/transactions',
    request,
  );
  return data.data || data;
}

// Update transaction status (requires auth, organizer for accepting/rejecting)
export async function updateTransactionStatus(
  transactionId: string,
  status: TransactionStatus,
): Promise<Transaction> {
  const { data } = await axiosInstance.patch<{ data: Transaction }>(
    `/api/transactions/${transactionId}/status`,
    { status },
  );
  return data.data || data;
}

// Upload payment proof (requires auth)
export async function uploadPaymentProof(
  transactionId: string,
  proofUrl: string,
): Promise<Transaction> {
  const { data } = await axiosInstance.post<{ data: Transaction }>(
    `/api/transactions/${transactionId}/upload-proof`,
    { proofUrl },
  );
  return data.data || data;
}

// Accept transaction (requires auth, organizer only)
export async function acceptTransaction(
  transactionId: string,
): Promise<Transaction> {
  const { data } = await axiosInstance.patch<{ data: Transaction }>(
    `/api/transactions/${transactionId}/accept`,
  );
  return data.data || data;
}

// Reject transaction (requires auth, organizer only)
export async function rejectTransaction(
  transactionId: string,
  rejectionReason?: string,
): Promise<Transaction> {
  const { data } = await axiosInstance.patch<{ data: Transaction }>(
    `/api/transactions/${transactionId}/reject`,
    { rejectionReason },
  );
  return data.data || data;
}

// Cancel transaction (requires auth)
export async function cancelTransaction(
  transactionId: string,
): Promise<Transaction> {
  const { data } = await axiosInstance.patch<{ data: Transaction }>(
    `/api/transactions/${transactionId}/cancel`,
  );
  return data.data || data;
}

// Get organizer transactions (requires auth, organizer only)
export async function getOrganizerTransactions(
  params?: FetchTransactionsParams,
) {
  const { data } = await axiosInstance.get('/api/organizer/transactions', {
    params,
  });
  return data.data || [];
}
