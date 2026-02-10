import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadPaymentProof as uploadToStorage } from '@/services/storage.service';
import { uploadPaymentProof as updateTransaction } from '@/api/transactions';
import type { Transaction } from '@/types/transaction';
import { toast } from 'sonner';

interface UsePaymentProofUploadParams {
  transactionId: string;
  userId: string;
  onSuccess?: () => void;
}

interface UploadPayload {
  file: File;
}

export function usePaymentProofUpload({
  transactionId,
  userId,
  onSuccess,
}: UsePaymentProofUploadParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file }: UploadPayload) => {
      toast.loading('Uploading payment proof...', { id: 'upload' });

      const { url, path } = await uploadToStorage({
        file,
        userId,
        transactionId,
      });

      const updatedTransaction = await updateTransaction(transactionId, url);
      return { updatedTransaction, uploadedPath: path };
    },

    onSuccess: ({ updatedTransaction }) => {
      toast.success('Payment proof uploaded successfully!', { id: 'upload' });

      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({
        queryKey: ['transaction', transactionId],
      });

      queryClient.setQueryData<Transaction>(
        ['transaction', transactionId],
        updatedTransaction,
      );

      onSuccess?.();
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload payment proof', {
        id: 'upload',
      });
      console.error('Upload error:', error);
    },
  });
}
