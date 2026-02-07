import { useMutation } from '@tanstack/react-query';
import { signUp, signIn } from '@/lib/auth-client';
import { toast } from 'sonner';

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  role: 'customer' | 'organizer';
}

interface LoginPayload {
  email: string;
  password: string;
}

export function useAuthMutations() {
  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data, error } = await signUp.email(
        {
          email: payload.email,
          password: payload.password,
          name: payload.name,
          // Pass role as additional data
          callbackURL: '/',
        },
        {
          onRequest: (ctx) => {
            // Add role to request body
            ctx.body = {
              ...ctx.body,
              role: payload.role,
            };
          },
        },
      );

      if (error) {
        throw new Error(error.message || 'Registration failed');
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Account created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data, error } = await signIn.email({
        email: payload.email,
        password: payload.password,
        callbackURL: '/',
      });

      if (error) {
        throw new Error(error.message || 'Login failed');
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Welcome back!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    registerMutation,
    loginMutation,
  };
}
