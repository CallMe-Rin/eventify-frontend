import type { UserRole } from './user';

export interface AppUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;

  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  referralCode?: string;
  points?: number;
  pointsExpireAt?: string;
}
