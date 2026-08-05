'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api-client';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN';
  vendorId?: string;
  addresses?: any[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('sellora_user');
    const token = ApiClient.getToken();
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        ApiClient.clearToken();
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    ApiClient.setToken(token);
    localStorage.setItem('sellora_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    ApiClient.clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
