import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Ticket, AlertCircle, Loader2 } from 'lucide-react';
import { useLoginForm } from '@/hooks/useLoginForm';
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

export default function LoginPage() {
  const { form, onSubmit, isLoading } = useLoginForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const rootError = errors.root?.message;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md">
        {/* LOGO */}
        <div className="flex justify-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-emerald-500/30">
            <Ticket
              className="h-8 w-8 text-primary-foreground"
              strokeWidth={2}
            />
          </div>
          <span className="ml-3 self-center text-2xl font-semibold">
            Eventify
          </span>
        </div>

        {/* CARD */}
        <Card className="rounded-2xl shadow-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to discover and book amazing events
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* ERROR MESSAGE */}
            {rootError && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p className="text-sm">{rootError}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                {/* EMAIL */}
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <FieldContent>
                    <div className="flex">
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        className="p-auto rounded-xl"
                        disabled={isLoading}
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <FieldError>{errors.email.message}</FieldError>
                    )}
                  </FieldContent>
                </Field>

                {/* PASSWORD */}
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <a
                      href="#"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <FieldContent>
                    <div className="relative">
                      {/* <Lock className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground" /> */}
                      <Input
                        id="password"
                        type="password"
                        className="p-auto rounded-xl"
                        placeholder="Enter your password"
                        disabled={isLoading}
                        {...register('password')}
                      />
                    </div>
                    {errors.password && (
                      <FieldError>{errors.password.message}</FieldError>
                    )}
                  </FieldContent>
                </Field>
              </FieldGroup>

              {/* LOGIN BUTTON */}
              <Button
                type="submit"
                className="w-full bg-primary rounded-xl disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <a href="/register" className="text-emerald-500 hover:underline">
                Register
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
