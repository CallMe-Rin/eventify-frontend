import type { Transaction, TransactionStatus } from '@/types/transaction';

/**
 * Transaction categories for UI segmentation
 */
export type TransactionCategory = 'ongoing' | 'history';

/**
 * Statuses that represent ongoing/active transactions
 */
const ONGOING_STATUSES: TransactionStatus[] = [
  'WAITING_PAYMENT',
  'WAITING_CONFIRMATION',
];

/**
 * Statuses that represent completed/historical transactions
 */
const HISTORY_STATUSES: TransactionStatus[] = [
  'DONE',
  'REJECTED',
  'EXPIRED',
  'CANCELED',
];

/**
 * Determines if a transaction is ongoing (requires user action)
 */
export function isOngoingTransaction(status: TransactionStatus): boolean {
  return ONGOING_STATUSES.includes(status);
}

/**
 * Determines if a transaction is historical (completed/finalized)
 */
export function isHistoricalTransaction(status: TransactionStatus): boolean {
  return HISTORY_STATUSES.includes(status);
}

/**
 * Categorizes a transaction as 'ongoing' or 'history'
 */
export function categorizeTransaction(
  transaction: Transaction,
): TransactionCategory {
  return isOngoingTransaction(transaction.status) ? 'ongoing' : 'history';
}

/**
 * Separates transactions into ongoing and history groups
 */
export function separateTransactions(transactions: Transaction[]): {
  ongoing: Transaction[];
  history: Transaction[];
} {
  return transactions.reduce(
    (acc, transaction) => {
      const category = categorizeTransaction(transaction);
      acc[category].push(transaction);
      return acc;
    },
    { ongoing: [], history: [] } as {
      ongoing: Transaction[];
      history: Transaction[];
    },
  );
}

/**
 * Sorts transactions by creation date (newest first)
 */
export function sortTransactionsByDate(
  transactions: Transaction[],
): Transaction[] {
  return [...transactions].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA; // Descending order (newest first)
  });
}
