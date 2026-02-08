import { z } from 'zod';

// Review Form Schema
export const reviewFormSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  comment: z
    .string()
    .min(10, 'Comment must be at least 10 characters')
    .max(1000, 'Comment must be less than 1000 characters'),
});

export type ReviewFormData = z.infer<typeof reviewFormSchema>;

// Review Interface - matches backend ReviewResponse
export interface Review {
  id: string;
  eventId: string;
  userId: string;
  transactionId: string;
  rating: number;
  comment: string | null;
  createdAt: string | Date;
  user?: {
    name: string | null;
  };
}

// Create Review Request  - matches backend CreateReviewRequest
export interface CreateReviewRequest {
  transactionId: string;
  rating: number;
  comment?: string;
}

// Event Reviews Response with pagination
export interface EventReviewsResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
