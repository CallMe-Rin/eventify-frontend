import { useMutation } from '@tanstack/react-query';
import { signIn, authClient } from '@/lib/auth-client';
import { axiosInstance } from '@/lib/axiosInstance';
import { toast } from 'sonner';

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  role: 'CUSTOMER' | 'ORGANIZER';
  referredBy?: string | null;
}

interface LoginPayload {
  email: string;
  password: string;
}

export function useAuthMutations() {
  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      // Register with custom endpoint (includes referral code generation)
      const registerResponse = await axiosInstance.post('/api/auth/register', {
        email: payload.email,
        password: payload.password,
        name: payload.name,
        role: payload.role,
        referredBy: payload.referredBy || null,
      });

      // Sign in immediately to set session cookie
      const { data: signInData, error: signInError } = await signIn.email({
        email: payload.email,
        password: payload.password,
        callbackURL: '/',
      });

      if (signInError) {
        throw new Error(
          signInError.message ||
            'Registration successful but sign-in failed. Please sign in manually.',
        );
      }

      return {
        user: registerResponse.data.data.user,
        session: signInData,
      };
    },

    onSuccess: async () => {
      // Refresh session
      await authClient.getSession();
      toast.success('Account created successfully!');
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed');
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
    onSuccess: async () => {
      await authClient.getSession();
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
