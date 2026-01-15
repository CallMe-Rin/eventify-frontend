import { createContext } from "react";
import {
  type AuthState,
  type AppRole,
} from "@/hooks/useAuth";

export interface AuthContextType extends AuthState {
  signUp: (
    email: string,
    password: string,
    name: string,
    role: AppRole
  ) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
