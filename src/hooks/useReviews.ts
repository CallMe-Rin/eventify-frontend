import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axiosInstance';
import type { Review, CreateReviewRequest } from '@/types/api';

// Query Keys
export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  byEvent: (eventId: string) => [...reviewKeys.all, 'event', eventId] as const,
  byUser: (userId: string) => [...reviewKeys.all, 'user', userId] as const,
};

// API Functions
async function fetchReviewsByEvent(eventId: string): Promise<Review[]> {
  const response = await axiosInstance.get<Review[]>('/reviews', {
    params: { eventId },
  });
  return response.data;
}

async function fetchReviewsByUser(userId: string): Promise<Review[]> {
  const response = await axiosInstance.get<Review[]>('/reviews', {
    params: { userId },
  });
  return response.data;
}

async function createReview(data: CreateReviewRequest): Promise<Review> {
  const review: Omit<Review, 'id'> = {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const response = await axiosInstance.post<Review>('/reviews', review);
  return response.data;
}

async function checkExistingReview(
  eventId: string,
  userId: string,
): Promise<Review | null> {
  const response = await axiosInstance.get<Review[]>('/reviews', {
    params: { eventId, userId },
  });
  return response.data.length > 0 ? response.data[0] : null;
}

// Query Hooks
export function useGetReviewsByEvent(eventId: string) {
  return useQuery({
    queryKey: reviewKeys.byEvent(eventId),
    queryFn: () => fetchReviewsByEvent(eventId),
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
    mutationFn: createReview,
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
