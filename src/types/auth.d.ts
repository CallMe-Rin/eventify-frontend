// Type declarations for better-auth with custom user fields
import type { UserRole } from './user';
import type { Session as BetterAuthSession, User as BetterAuthUser } from 'better-auth';

declare global {
  namespace BetterAuth {
    interface User extends BetterAuthUser {
      role: UserRole;
      avatarUrl?: string;
      phone?: string;
      bio?: string;
      referralCode?: string;
      points?: number;
      pointsExpireAt?: string;
    }

    interface Session extends BetterAuthSession {
      user: User;
    }
  }
}

// Augment better-auth types
declare module 'better-auth' {
  interface User {
    role: UserRole;
    avatarUrl?: string;
    phone?: string;
    bio?: string;
    referralCode?: string;
    points?: number;
    pointsExpireAt?: string;
  }

  interface Session {
    user: User & {
      role: UserRole;
    };
  }
}

// Also augment the react module
declare module 'better-auth/react' {
  interface User {
    role: UserRole;
    avatarUrl?: string;
    phone?: string;
    bio?: string;
    referralCode?: string;
    points?: number;
    pointsExpireAt?: string;
  }

  interface Session {
    user: User & {
      role: UserRole;
    };
  }
}

// Augment the client types
declare module 'better-auth/client' {
  interface User {
    role: UserRole;
    avatarUrl?: string;
    phone?: string;
    bio?: string;
    referralCode?: string;
    points?: number;
    pointsExpireAt?: string;
  }
}
