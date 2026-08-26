'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ApiClient } from '@/lib/api-client';

export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  vendorId?: string;
  addresses?: any[];
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isCustomer: boolean;
  isVendor: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isCustomer: false,
  isVendor: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = ApiClient.getToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await ApiClient.get<User>('/auth/me');
      localStorage.setItem('sellora_user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.warn('Failed to verify session token:', error);
      ApiClient.clearToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Instantly load cached session for fast UI paint
    const savedUser = localStorage.getItem('sellora_user');
    const token = ApiClient.getToken();
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        ApiClient.clearToken();
      }
    }

    // 2. Perform background session verification with API
    refreshUser();
  }, [refreshUser]);

  const login = (token: string, userData: User) => {
    ApiClient.setToken(token);
    localStorage.setItem('sellora_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    ApiClient.clearToken();
    setUser(null);
  };

  const isCustomer = user?.role === 'CUSTOMER';
  const isVendor = user?.role === 'SELLER' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isCustomer,
        isVendor,
        isAdmin,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
