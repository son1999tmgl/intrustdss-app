/**
 * Hợp đồng dữ liệu người dùng và phiên đăng nhập (User & Session Contract)
 */

export type UserRole = 'admin' | 'manager' | 'operator' | 'guest';

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  roles: UserRole[];
  permissions: string[];
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: UserProfile;
}
