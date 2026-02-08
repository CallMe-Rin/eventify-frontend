// types/register.ts
import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    role: z.enum(['CUSTOMER', 'ORGANIZER']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterFormSchema = z.infer<typeof registerSchema>;
