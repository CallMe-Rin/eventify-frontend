import { useState, useCallback, useEffect } from "react";
import { mockDb, type MockUser } from "@/data/mockData";

export type AppRole = "customer" | "organizer";

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

// Generate a simple referral code
function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    role: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Check for stored auth on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("mock_user_id");
    if (storedUserId) {
      const user = mockDb.getCurrentUser();
      if (user) {
        setState({
          user: { id: user.id, email: user.email },
          session: { access_token: "mock-token" },
          profile: {
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
          },
          role: user.role,
          isLoading: false,
          isAuthenticated: true,
        });
        return;
      }
    }
    setState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: AppRole
  ) => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 500));

    // Check if user exists
    const existingUser = mockDb.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Create new user
    const newUser: MockUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      role,
      referral_code: generateReferralCode(),
      points: 0,
      created_at: new Date().toISOString(),
    };

    mockDb.createUser(newUser);
    mockDb.setCurrentUser(newUser);
    localStorage.setItem("mock_user_id", newUser.id);

    setState({
      user: { id: newUser.id, email: newUser.email },
      session: { access_token: "mock-token" },
      profile: {
        id: newUser.id,
        user_id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        avatar_url: newUser.avatar_url,
        phone: newUser.phone,
        bio: newUser.bio,
        referral_code: newUser.referral_code,
        created_at: newUser.created_at,
        updated_at: newUser.created_at,
      },
      role: newUser.role,
      isLoading: false,
      isAuthenticated: true,
    });

    return { user: newUser };
  };

  const signIn = async (email: string, password: string) => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 500));

    const user = mockDb.findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    mockDb.setCurrentUser(user);
    localStorage.setItem("mock_user_id", user.id);

    setState({
      user: { id: user.id, email: user.email },
      session: { access_token: "mock-token" },
      profile: {
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
      },
      role: user.role,
      isLoading: false,
      isAuthenticated: true,
    });

    return { user };
  };

  const signInWithGoogle = async () => {
    // Simulate Google sign in with a default user
    await new Promise((r) => setTimeout(r, 500));

    // Use the first mock customer user
    const user = mockDb.findUserByEmail("john@example.com");
    if (user) {
      mockDb.setCurrentUser(user);
      localStorage.setItem("mock_user_id", user.id);

      setState({
        user: { id: user.id, email: user.email },
        session: { access_token: "mock-token" },
        profile: {
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
        },
        role: user.role,
        isLoading: false,
        isAuthenticated: true,
      });
    }

    return { user };
  };

  const signOut = async () => {
    await new Promise((r) => setTimeout(r, 300));
    mockDb.setCurrentUser(null);
    localStorage.removeItem("mock_user_id");

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
    const user = mockDb.getCurrentUser();
    if (user) {
      setState((prev) => ({
        ...prev,
        profile: {
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
        },
      }));
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
