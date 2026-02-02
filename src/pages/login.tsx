import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
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
import { Label } from '../components/ui/label';
import { Ticket, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthMutations } from '@/hooks/useAuthMutations';
import { useAuthContext } from '@/hooks/useAuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role } = useAuthContext();
  const { loginMutation } = useAuthMutations();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Check if there's a redirect location stored
      const state = location.state as { from?: { pathname: string } } | null;
      const from = state?.from?.pathname;

      if (from) {
        navigate(from, { replace: true });
      } else if (role === 'organizer') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, role, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: () => {
          // The redirect will happen via the useEffect above after isAuthenticated updates
        },
        onError: (error) => {
          setError(
            error instanceof Error ? error.message : 'Login failed. Try again.',
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md">
        {/* LOGO */}
        <div className="flex justify-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/30">
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
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* EMAIL */}
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loginMutation.isPending}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Password</Label>
                  <a
                    href="#"
                    className="text-sm text-emerald-500 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    className="pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loginMutation.isPending}
                  />
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <Button
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-full disabled:opacity-50"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
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
            <div className="flex items-center w-full gap-3">
              <div className="h-px w-full bg-border" />
              <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                OR CONTINUE WITH
              </span>
              <div className="h-px w-full bg-border" />
            </div>

            <Button variant="outline" className="w-full rounded-full">
              Continue with Google
            </Button>

            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <a href="/register" className="text-emerald-500 hover:underline">
                Sign up
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
