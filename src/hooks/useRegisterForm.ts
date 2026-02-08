import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useAuthMutations } from '@/hooks/useAuthMutations';

const registerFormSchema = z
  .object({
    role: z.enum(['CUSTOMER', 'ORGANIZER'], {
      message: 'Please select a role',
    }),
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .min(2, { message: 'Name must be at least 2 characters' }),
    email: z.email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormSchema = z.infer<typeof registerFormSchema>;

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { registerMutation } = useAuthMutations();
  const [selectedRole, setSelectedRole] = useState<
    'CUSTOMER' | 'ORGANIZER' | null
  >(null);

  const form = useForm<RegisterFormSchema>({
    defaultValues: {
      role: undefined,
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(registerFormSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data: RegisterFormSchema) => {
    registerMutation.mutate(
      {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        role: data.role,
      },
      {
        onSuccess: () => {
          // Redirect handled by useEffect above
        },
        onError: (error) => {
          form.setError('root', {
            type: 'manual',
            message:
              error instanceof Error
                ? error.message
                : 'Registration failed. Try again.',
          });
        },
      },
    );
  };

  return {
    form,
    onSubmit,
    isLoading: registerMutation.isPending,
    selectedRole,
    setSelectedRole: (role: 'CUSTOMER' | 'ORGANIZER') => {
      setSelectedRole(role);
      form.setValue('role', role);
    },
  };
};
