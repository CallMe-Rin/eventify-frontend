import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelTransaction } from '@/api/transactions';
import { toast } from 'sonner';

export function useTransactionMutations() {
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: (transactionId: string) => cancelTransaction(transactionId),
    onSuccess: () => {
      // Invalidate and refetch transactions
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction cancelled successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to cancel transaction');
    },
  });

  return {
    cancelTransaction: cancelMutation.mutate,
    isCancelling: cancelMutation.isPending,
  };
}
