import { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '@/lib/axiosInstance';
import type { User } from '@/types/api';

export type AppRole = 'customer' | 'organizer';

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  name: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  referral_code: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: { id: string; email: string } | null;
  session: { access_token: string } | null;
  profile: Profile | null;
  role: AppRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface ApiUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  referral_code: string;
  role: AppRole;
  points?: number;
  created_at: string;
}

// Generate a simple referral code
function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Convert API user to profile format
function userToProfile(user: ApiUser): Profile {
  return {
    id: user.id,
    user_id: user.id,
    email: user.email,
    name: user.name,
    avatar_url: user.avatar_url,
    phone: user.phone,
    bio: user.bio,
    referral_code: user.referral_code,
    created_at: user.created_at,
    updated_at: user.created_at,
  };
}

// Convert API user to User format
function apiUserToUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    name: apiUser.name,
    avatarUrl: apiUser.avatar_url,
    phone: apiUser.phone,
    bio: apiUser.bio,
    referralCode: apiUser.referral_code,
    role: apiUser.role,
    points: apiUser.points ?? 0,
    createdAt: apiUser.created_at,
  };
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: { id: 'user-001', email: 'john@example.com' },
    session: null,
    profile: null,
    role: 'customer',
    isLoading: true,
    isAuthenticated: true,
  });

  const isMountedRef = useRef(true);

  // Check for stored auth on mount
  useEffect(() => {
    const loadAuth = async () => {
      const storedUserId = localStorage.getItem('auth_user_id');

      if (storedUserId) {
        try {
          const { data: user } = await axiosInstance.get<ApiUser>(
            `/users/${storedUserId}`,
          );

          if (isMountedRef.current) {
            setState({
              user: { id: user.id, email: user.email },
              session: { access_token: 'mock-token' },
              profile: userToProfile(user),
              role: user.role,
              isLoading: false,
              isAuthenticated: true,
            });
          }
        } catch {
          localStorage.removeItem('auth_user_id');
          if (isMountedRef.current) {
            setState((prev) => ({ ...prev, isLoading: false }));
          }
        }
      } else {
        if (isMountedRef.current) {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    };

    loadAuth();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const signUp = async (
    email: string,
    _password: string,
    name: string,
    role: AppRole,
  ) => {
    // Check if user exists
    const { data: existingUsers } = await axiosInstance.get<ApiUser[]>(
      `/users?email=${email}`,
    );
    if (existingUsers.length > 0) {
      throw new Error('User already exists with this email');
    }

    // Create new user
    const newUser: Partial<ApiUser> = {
      email,
      name,
      role,
      referral_code: generateReferralCode(),
      created_at: new Date().toISOString(),
    };

    const { data: createdUser } = await axiosInstance.post<ApiUser>(
      '/users',
      newUser,
    );

    localStorage.setItem('auth_user_id', createdUser.id);

    setState({
      user: { id: createdUser.id, email: createdUser.email },
      session: { access_token: 'mock-token' },
      profile: userToProfile(createdUser),
      role: createdUser.role,
      isLoading: false,
      isAuthenticated: true,
    });

    return apiUserToUser(createdUser);
  };

  const signIn = async (email: string, _password: string) => {
    // Find user by email
    const { data: users } = await axiosInstance.get<ApiUser[]>(
      `/users?email=${email}`,
    );
    if (users.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = users[0];
    localStorage.setItem('auth_user_id', user.id);

    setState({
      user: { id: user.id, email: user.email },
      session: { access_token: 'mock-token' },
      profile: userToProfile(user),
      role: user.role,
      isLoading: false,
      isAuthenticated: true,
    });

    return apiUserToUser(user);
  };

  const signInWithGoogle = async () => {
    // Use the first mock customer user (john@example.com)
    try {
      const { data: users } = await axiosInstance.get<ApiUser[]>(
        `/users?email=john@example.com`,
      );
      if (users.length > 0) {
        const user = users[0];
        localStorage.setItem('auth_user_id', user.id);

        setState({
          user: { id: user.id, email: user.email },
          session: { access_token: 'mock-token' },
          profile: userToProfile(user),
          role: user.role,
          isLoading: false,
          isAuthenticated: true,
        });
        return apiUserToUser(user);
      }
    } catch (error) {
      throw new Error('Google sign in failed');
    }
  };

  const signOut = async () => {
    localStorage.removeItem('auth_user_id');

    setState({
      user: null,
      session: null,
      profile: null,
      role: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const refreshProfile = async () => {
    const userId = localStorage.getItem('auth_user_id');
    if (userId) {
      try {
        const { data: user } = await axiosInstance.get<ApiUser>(
          `/users/${userId}`,
        );
        setState((prev) => ({
          ...prev,
          profile: userToProfile(user),
        }));
      } catch (error) {
        console.error('Failed to refresh profile', error);
      }
    }
  };

  return {
    ...state,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    refreshProfile,
  };
}
