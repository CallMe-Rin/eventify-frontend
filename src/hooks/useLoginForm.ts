import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, type LoginFormSchema } from '@/types/login';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export function useLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormSchema) {
    setIsLoading(true);

    try {
      const response = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      // Check if signIn returned an error
      if (response.error) {
        form.setError('root', {
          message: response.error.message || 'Invalid credentials',
        });
        toast.error(response.error.message || 'Login failed');
        return;
      }

      // Success
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      form.setError('root', { message: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    form,
    onSubmit,
    isLoading,
  };
}
