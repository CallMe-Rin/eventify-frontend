import { useMutation } from '@tanstack/react-query';
import { signUp, signIn, authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  role: 'CUSTOMER' | 'ORGANIZER';
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
          callbackURL: '/',
        },
        {
          onRequest: (ctx) => {
            const bodyObj = JSON.parse(ctx.body as string);
            bodyObj.role = payload.role;
            ctx.body = JSON.stringify(bodyObj);
          },
        },
      );

      if (error) throw new Error(error.message);
      return data;
    },

    onSuccess: async () => {
      await authClient.getSession();
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
