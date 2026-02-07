import { useSession } from '@/lib/auth-client';
import type { UserRole } from '@/types/user';

export type AppRole = UserRole;

type UserWithRole = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  role?: UserRole;
};

export function useAuth() {
  const { data: session, isPending, error } = useSession();

  // Extract user from better-auth session
  const user = (session?.user as UserWithRole | undefined) ?? null;

  // Extract role
  const role = user?.role ?? null;

  // Create profile object for backward compatibility
  const profile = user
    ? {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role ?? null,
      }
    : null;

  return {
    user,
    profile,
    session: session?.session ?? null,
    isLoading: isPending,
    isAuthenticated: !!user,
    role,
    error: error?.message ?? null,
  };
}
