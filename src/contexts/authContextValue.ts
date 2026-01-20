import { createContext } from "react";
import { type AuthState, type AppRole } from "@/hooks/useAuth";
import type { User } from "@/types/api";

export interface AuthContextType extends AuthState {
  signUp: (
    email: string,
    password: string,
    name: string,
    role: AppRole,
  ) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
