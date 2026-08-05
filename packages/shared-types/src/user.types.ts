import { BaseEntity } from './entity.types.js';
import { UserRole } from './enums.types.js';

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  area: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  passwordHash?: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  isEmailVerified: boolean;
  vendorId?: string; // Tying user to vendor store if user is a SELLER
  addresses: Address[];
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: number;
}

export interface UserProfileResponse {
  user: Omit<User, 'passwordHash'>;
  tokens: AuthTokens;
}
