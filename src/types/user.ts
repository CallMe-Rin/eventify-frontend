export type UserRole = "customer" | "organizer";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  referralCode: string;
  role: UserRole;
  points: number;
  pointsExpireAt?: string;
  createdAt: string;
}
