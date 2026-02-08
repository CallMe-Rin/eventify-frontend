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
  avatarUrl?: string | null;
  role?: UserRole;
};

export function useAuth() {
  const { data: session, isPending, error } = useSession();

  const user: UserWithRole | undefined = session?.user
    ? { ...session.user }
    : undefined;

  const role = user?.role ?? null;

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
