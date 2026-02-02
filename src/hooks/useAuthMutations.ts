import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "./useAuthContext";
import {
  registerUser,
  loginUser,
  type RegisterPayload,
  type LoginPayload,
  type ApiUser,
} from "@/api/authService";
import type { User } from "@/types/api";

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

export function useAuthMutations() {
  const { signIn } = useAuthContext();

  /**
   * Register mutation
   */
  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const apiUser = await registerUser(payload);
      return apiUser;
    },
    onSuccess: async (apiUser) => {
      // Store user ID in localStorage
      localStorage.setItem("auth_user_id", apiUser.id);

      // Convert to User format and call signIn
      const user = apiUserToUser(apiUser);
      await signIn(user.email, apiUser.password);
    },
  });

  /**
   * Login mutation
   */
  const loginMutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const apiUser = await loginUser(payload);
      return apiUser;
    },
    onSuccess: async (apiUser) => {
      // Store user ID in localStorage
      localStorage.setItem("auth_user_id", apiUser.id);

      // Convert to User format and call signIn
      const user = apiUserToUser(apiUser);
      await signIn(user.email, apiUser.password);
    },
  });

  return {
    registerMutation,
    loginMutation,
  };
}
