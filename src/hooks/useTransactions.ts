import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { TransactionStatus, CreateTransactionRequest } from '@/types/api';
import {
  fetchTransactions,
  createTransaction,
  updateTransactionStatus,
  uploadPaymentProof,
  acceptTransaction,
  rejectTransaction,
  cancelTransaction,
} from '@/api/transactions';

export function useTransactions(params?: {
  status?: TransactionStatus;
  eventId?: string;
}) {
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', params],
    queryFn: () => fetchTransactions(params),
  });

  const createTransactionMutation = useMutation({
    mutationFn: (request: CreateTransactionRequest) =>
      createTransaction(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      transactionId,
      status,
    }: {
      transactionId: string;
      status: TransactionStatus;
    }) => updateTransactionStatus(transactionId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const uploadProofMutation = useMutation({
    mutationFn: ({
      transactionId,
      proofUrl,
    }: {
      transactionId: string;
      proofUrl: string;
    }) => uploadPaymentProof(transactionId, proofUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (transactionId: string) => acceptTransaction(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (args: { transactionId: string; reason?: string }) =>
      rejectTransaction(args.transactionId, args.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (transactionId: string) => cancelTransaction(transactionId),
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
    ) => updateStatusMutation.mutateAsync({ transactionId, status }),
    uploadPaymentProof: (transactionId: string, proofUrl: string) =>
      uploadProofMutation.mutateAsync({ transactionId, proofUrl }),
    acceptTransaction: acceptMutation.mutateAsync,
    rejectTransaction: (transactionId: string, reason?: string) =>
      rejectMutation.mutateAsync({ transactionId, reason }),
    cancelTransaction: cancelMutation.mutateAsync,
    isCreating: createTransactionMutation.isPending,
    isUpdating: updateStatusMutation.isPending,
  };
}
