import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateReviewRequest } from '@/types/api';
import {
  reviewKeys,
  fetchReviewsByEvent,
  fetchReviewsByUser,
  createReview,
  checkExistingReview,
  deleteReview,
} from '@/api/reviews';

// Query Hooks
export function useGetReviewsByEvent(
  eventId: string,
  page: number = 1,
  limit: number = 10,
) {
  return useQuery({
    queryKey: reviewKeys.byEvent(eventId),
    queryFn: () => fetchReviewsByEvent(eventId, page, limit),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetReviewsByUser(userId: string) {
  return useQuery({
    queryKey: reviewKeys.byUser(userId),
    queryFn: () => fetchReviewsByUser(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCheckExistingReview(eventId: string, userId: string) {
  return useQuery({
    queryKey: [...reviewKeys.byEvent(eventId), 'check', userId],
    queryFn: () => checkExistingReview(eventId, userId),
    enabled: !!eventId && !!userId,
  });
}

// Mutation Hooks
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewRequest) => createReview(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.byEvent(data.eventId),
      });
      queryClient.invalidateQueries({
        queryKey: reviewKeys.byUser(data.userId),
      });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.all,
      });
    },
  });
}
