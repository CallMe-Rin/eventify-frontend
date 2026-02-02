import { createContext, useContext } from 'react';
import type { useAuth as useAuthHook } from '@/hooks/useAuth';

export type { AppRole, Profile } from '@/hooks/useAuth';

// Create context with proper typing
export const AuthContext = createContext<ReturnType<typeof useAuthHook> | null>(
  null,
);

// Export the consumer hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
