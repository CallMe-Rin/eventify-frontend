import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { authClient, signIn } from '@/lib/auth-client';
import { toast } from 'sonner';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        form.setError('root', { message: result.error.message });
        return;
      }

      // 🔥 FORCE SESSION SYNC
      await authClient.getSession();

      toast.success('Welcome back!');

      const redirectUrl = localStorage.getItem('redirectAfterLogin');

      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectUrl, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      form.setError('root', {
        message: error instanceof Error ? error.message : 'Login failed',
      });
    }
  };

  return {
    form,
    onSubmit,
    isLoading: form.formState.isSubmitting,
  };
}
