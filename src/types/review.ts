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

// Review Interface
export interface Review {
  id: string;
  eventId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// Create Review Request
export interface CreateReviewRequest {
  eventId: string;
  userId: string;
  rating: number;
  comment: string;
}
