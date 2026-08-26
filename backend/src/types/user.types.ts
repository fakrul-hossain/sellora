import { UserRole } from './enums.types.js';

export interface UserAddress {
  id?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  area: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  isEmailVerified?: boolean;
  vendorId?: string;
  addresses?: UserAddress[];
  createdAt?: string;
  updatedAt?: string;
}
