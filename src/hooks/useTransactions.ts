import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Transaction, TransactionStatus } from '@/types/api';
import {
  fetchTransactions,
  createTransactionApi,
  updateTransactionApi,
  uploadPaymentProofApi,
} from '@/api/transactions';

export function useTransactions(user_id?: string, event_id?: string) {
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', user_id, event_id],
    queryFn: () => fetchTransactions({ user_id, event_id }),
  });

  const createTransactionMutation = useMutation({
    mutationFn: createTransactionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['ticketTiers'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      transactionId,
      status,
      additionalData,
    }: {
      transactionId: string;
      status: TransactionStatus;
      additionalData?: Partial<Transaction>;
    }) => updateTransactionApi(transactionId, status, additionalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['ticketTiers'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const uploadProofMutation = useMutation({
    mutationFn: ({
      transactionId,
      proofUrl,
    }: {
      transactionId: string;
      proofUrl: string;
    }) => uploadPaymentProofApi(transactionId, proofUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  return {
    transactions,
    isLoading,
    createTransaction: createTransactionMutation.mutateAsync,
    updateTransactionStatus: (
      transactionId: string,
      status: TransactionStatus,
      additionalData?: Partial<Transaction>,
    ) =>
      updateStatusMutation.mutateAsync({
        transactionId,
        status,
        additionalData,
      }),
    uploadPaymentProof: (transactionId: string, proofUrl: string) =>
      uploadProofMutation.mutateAsync({ transactionId, proofUrl }),
    isCreating: createTransactionMutation.isPending,
    isUpdating: updateStatusMutation.isPending,
  };
}
