import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  User,
  Lock,
  Ticket,
  AlertCircle,
  Loader2,
  Mail,
  Calendar,
  Share2,
} from 'lucide-react';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { useForm, FormProvider } from 'react-hook-form';
import { registerSchema, type RegisterFormSchema } from '@/types/register';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthMutations } from '@/hooks/useAuthMutations';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const { registerMutation } = useAuthMutations();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: undefined,
    },
  });

  const {
    register,
    setValue,
    formState: { errors },
  } = form;

  const [selectedRole, setSelectedRole] = React.useState<
    'customer' | 'organizer' | undefined
  >(undefined);

  function onSubmit(data: RegisterFormSchema) {
    registerMutation.mutate(data);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 py-10">
      {/* Logo */}
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Ticket className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Eventify</span>
          </Link>
        </div>
      </div>

      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">
            Create Account
          </CardTitle>
          <CardDescription>
            Join Eventify to discover or create amazing events
          </CardDescription>

          {/* ERROR MESSAGE */}
          {registerMutation.isError && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{registerMutation.error?.message || 'Registration failed'}</p>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* ROLE SELECTION */}
              <Field>
                <FieldLabel>I Want to</FieldLabel>
                <FieldContent>
                  <div className="grid grid-cols-2 gap-3">
                    {/* USER */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole('customer');
                        setValue('role', 'CUSTOMER', { shouldValidate: true });
                      }}
                      className={`rounded-xl border-2 p-4 text-center transition hover:cursor-pointer hover:bg-secondary/40 ${
                        selectedRole === 'customer'
                          ? 'border-primary bg-accent'
                          : 'hover:border-2'
                      }`}
                    >
                      <User
                        className={cn(
                          'mx-auto h-8 w-8',
                          selectedRole === 'customer'
                            ? 'text-primary'
                            : 'text-muted-foreground',
                        )}
                      />
                      <p className="text-sm font-medium pt-1">Join as User</p>
                    </button>

                    {/* ORGANIZER */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole('organizer');
                        setValue('role', 'ORGANIZER', { shouldValidate: true });
                      }}
                      className={`rounded-xl border-2 p-4 text-center transition hover:cursor-pointer hover:bg-secondary/40 ${
                        selectedRole === 'organizer'
                          ? 'border-primary bg-accent/50'
                          : 'hover:border-2'
                      }`}
                    >
                      <Calendar
                        className={cn(
                          'mx-auto h-8 w-8',
                          selectedRole === 'organizer'
                            ? 'text-primary'
                            : 'text-muted-foreground',
                        )}
                      />
                      <p className="text-sm font-medium pt-1">
                        Event Organizer
                      </p>
                    </button>
                  </div>
                </FieldContent>
                <FieldError>{errors.role?.message}</FieldError>
              </Field>

              {/* NAME */}
              <Field>
                <FieldLabel>Name</FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      {...register('name')}
                      placeholder="Your Name"
                      className="pl-10 rounded-xl"
                    />
                  </div>
                </FieldContent>
                <FieldError>{errors.name?.message}</FieldError>
              </Field>

              {/* EMAIL */}
              <Field>
                <FieldLabel>Email</FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      {...register('email')}
                      type="email"
                      placeholder="email@example.com"
                      className="pl-10 rounded-xl"
                    />
                  </div>
                </FieldContent>
                <FieldError>{errors.email?.message}</FieldError>
              </Field>

              {/* PASSWORD */}
              <Field>
                <FieldLabel>Password</FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      {...register('password')}
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 rounded-xl"
                    />
                  </div>
                </FieldContent>
                <FieldError>{errors.password?.message}</FieldError>
              </Field>

              {/* CONFIRM PASSWORD */}
              <Field>
                <FieldLabel>Confirm Password</FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      {...register('confirmPassword')}
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 rounded-xl"
                    />
                  </div>
                </FieldContent>
                <FieldError>{errors.confirmPassword?.message}</FieldError>
              </Field>

              {/* REFERRAL */}
              <Field>
                <FieldLabel>{`Referral Code (Optional)`}</FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <Share2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      {...register('referredBy')}
                      placeholder="Referral Code"
                      className="pl-10 rounded-xl"
                    />
                  </div>
                </FieldContent>
                <FieldError>{errors.referredBy?.message}</FieldError>
              </Field>

              <Button
                type="submit"
                className="w-full bg-primary rounded-xl"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </FormProvider>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
