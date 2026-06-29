import React, { createContext, useState, useContext, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthUser {
  userId: string;
  email: string;
  role: string;
  fullName: string;
}

interface RawJwtPayload {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
}

const mapTokenToUser = (token: string): AuthUser => {
  const raw = jwtDecode<RawJwtPayload>(token);
  return {
    userId: raw['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
    email: raw['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
    fullName: raw['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
    role: raw['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
  };
};

interface AuthContextType {
  user: AuthUser | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem('token');
    return token ? mapTokenToUser(token) : null;
  });

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setUser(mapTokenToUser(token));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};