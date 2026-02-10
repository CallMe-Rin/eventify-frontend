import { axiosInstance } from '@/lib/axiosInstance';
import type {
  Review,
  CreateReviewRequest,
  EventReviewsResponse,
} from '@/types/api';

// Query Keys for React Query
export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  byEvent: (eventId: string) => [...reviewKeys.all, 'event', eventId] as const,
  byUser: (userId: string) => [...reviewKeys.all, 'user', userId] as const,
};

// Fetch reviews by event (public endpoint)
export async function fetchReviewsByEvent(
  eventId: string,
  page: number = 1,
  limit: number = 10,
): Promise<EventReviewsResponse> {
  const { data } = await axiosInstance.get<{ data: EventReviewsResponse }>(
    `/api/events/${eventId}/reviews`,
    { params: { page, limit } },
  );
  return data.data || data;
}

// Fetch reviews by user (requires auth)
export async function fetchReviewsByUser(userId: string): Promise<Review[]> {
  try {
    const { data } = await axiosInstance.get<{ data: Review[] }>(
      '/api/reviews',
      { params: { userId } },
    );
    return Array.isArray(data) ? data : data.data || [];
  } catch {
    return [];
  }
}

// Create review (requires auth)
export async function createReview(
  request: CreateReviewRequest,
): Promise<Review> {
  const { data } = await axiosInstance.post<{ data: Review }>(
    '/api/reviews',
    request,
  );
  return data.data || data;
}

// Check if user already reviewed an event (requires auth)
export async function checkExistingReview(
  eventId: string,
  userId: string,
): Promise<Review | null> {
  if (!eventId || !userId) {
    return null;
  }

  try {
    // Fetch all reviews for this event
    const { data } = await axiosInstance.get<{ data: EventReviewsResponse }>(
      `/api/events/${eventId}/reviews`,
      { params: { page: 1, limit: 100 } },
    );

    const response = data.data || data;
    const reviews = response.reviews || [];

    // Find if this user has already reviewed
    const userReview = reviews.find((review) => review.userId === userId);

    return userReview || null;
  } catch (error) {
    console.error('Error checking existing review:', error);
    return null;
  }
}

// Delete review (requires auth, owner only)
export async function deleteReview(reviewId: string): Promise<void> {
  await axiosInstance.delete(`/api/reviews/${reviewId}`);
}

// Get organizer reviews (requires auth, organizer only)
export async function getOrganizerReviews(params?: {
  page?: number;
  limit?: number;
}) {
  const { data } = await axiosInstance.get('/api/organizer/reviews', {
    params,
  });
  return data.data || [];
}
