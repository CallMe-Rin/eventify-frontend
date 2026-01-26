import axios from 'axios';
import type { Transaction, TransactionStatus } from '@/types/api';

const API_URL = import.meta.env.VITE_API_URL;

interface FetchTransactionsParams {
  user_id?: string;
  event_id?: string;
}

export async function fetchTransactions(
  params: FetchTransactionsParams,
): Promise<Transaction[]> {
  const queryParams = new URLSearchParams();
  if (params.user_id) queryParams.append('user_id', params.user_id);
  if (params.event_id) queryParams.append('event_id', params.event_id);

  const { data } = await axios.get<Transaction[]>(
    `${API_URL}/transactions?${queryParams.toString()}`,
  );
  return data;
}

export async function createTransactionApi(
  transaction: Omit<Transaction, 'id' | 'created_at' | 'expires_at'>,
): Promise<Transaction> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  const payload = {
    ...transaction,
    created_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
  };

  const { data } = await axios.post<Transaction>(
    `${API_URL}/transactions`,
    payload,
  );

  // Update ticket tier sold count
  if (transaction.ticket_tier_id) {
    const { data: tier } = await axios.get(
      `${API_URL}/ticketTiers/${transaction.ticket_tier_id}`,
    );
    await axios.patch(`${API_URL}/ticketTiers/${transaction.ticket_tier_id}`, {
      sold: tier.sold + transaction.quantity,
    });
  }

  // Deduct user points
  if (transaction.points_used > 0) {
    const { data: user } = await axios.get(
      `${API_URL}/users/${transaction.user_id}`,
    );
    await axios.patch(`${API_URL}/users/${transaction.user_id}`, {
      points: user.points - transaction.points_used,
    });
  }

  return data;
}

export async function updateTransactionApi(
  transactionId: string,
  status: TransactionStatus,
  additionalData?: Partial<Transaction>,
): Promise<Transaction> {
  const { data: oldTransaction } = await axios.get<Transaction>(
    `${API_URL}/transactions/${transactionId}`,
  );

  const payload = {
    ...additionalData,
    status,
  };

  // Handle rollback for canceled/expired/rejected
  if (
    ['expired', 'rejected', 'canceled'].includes(status) &&
    !['expired', 'rejected', 'canceled'].includes(oldTransaction.status)
  ) {
    // Restore ticket seats
    const { data: tier } = await axios.get(
      `${API_URL}/ticketTiers/${oldTransaction.ticket_tier_id}`,
    );
    await axios.patch(
      `${API_URL}/ticketTiers/${oldTransaction.ticket_tier_id}`,
      {
        sold: tier.sold - oldTransaction.quantity,
      },
    );

    // Refund points
    if (oldTransaction.points_used > 0) {
      const { data: user } = await axios.get(
        `${API_URL}/users/${oldTransaction.user_id}`,
      );
      await axios.patch(`${API_URL}/users/${oldTransaction.user_id}`, {
        points: user.points + oldTransaction.points_used,
      });
    }
  }

  const { data } = await axios.patch<Transaction>(
    `${API_URL}/transactions/${transactionId}`,
    payload,
  );

  return data;
}

export async function uploadPaymentProofApi(
  transactionId: string,
  proofUrl: string,
): Promise<Transaction> {
  return updateTransactionApi(transactionId, 'waiting_confirmation', {
    payment_proof_url: proofUrl,
    paid_at: new Date().toISOString(),
  });
}
