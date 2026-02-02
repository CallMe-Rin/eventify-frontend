import { axiosInstance } from "@/lib/axiosInstance";
import type { AppRole } from "@/hooks/useAuth";

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  password: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  referral_code: string;
  role: AppRole;
  points?: number;
  created_at: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  role: AppRole;
}

export interface LoginPayload {
  email: string;
  password: string;
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

/**
 * Check if email already exists in the database
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const { data } = await axiosInstance.get<ApiUser[]>(
      `/users?email=${email}`,
    );
    return Array.isArray(data) && data.length > 0;
  } catch (error) {
    console.error("Error checking email:", error);
    throw error;
  }
}

/**
 * Register a new user
 */
export async function registerUser(payload: RegisterPayload): Promise<ApiUser> {
  // Check if email already exists
  const emailExists = await checkEmailExists(payload.email);
  if (emailExists) {
    throw new Error("Email already registered");
  }

  // Create new user
  const newUser: Partial<ApiUser> = {
    email: payload.email,
    password: payload.password,
    name: payload.name,
    role: payload.role,
    referral_code: generateReferralCode(),
    created_at: new Date().toISOString(),
  };

  const { data } = await axiosInstance.post<ApiUser>("/users", newUser);
  return data;
}

/**
 * Login user by email and password
 */
export async function loginUser(payload: LoginPayload): Promise<ApiUser> {
  const { data } = await axiosInstance.get<ApiUser[]>(
    `/users?email=${payload.email}&password=${payload.password}`,
  );

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Invalid email or password");
  }

  return data[0];
}

/**
 * Fetch user by ID
 */
export async function fetchUserById(userId: string): Promise<ApiUser> {
  const { data } = await axiosInstance.get<ApiUser>(`/users/${userId}`);
  return data;
}
