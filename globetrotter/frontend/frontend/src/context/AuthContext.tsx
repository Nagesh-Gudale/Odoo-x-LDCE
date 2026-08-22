import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types/auth';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
}

const DEFAULT_ADMIN_USER: User = {
  id: '1',
  name: 'ADMIN',
  email: 'admin@globetrotter.com',
  role: 'admin',
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_ADMIN_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if a session already exists on load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUserLocal = localStorage.getItem('currentUser');
        const savedUserSession = sessionStorage.getItem('currentUser');
        
        if (savedUserLocal) {
          const parsed = JSON.parse(savedUserLocal);
          setUser({ ...parsed, role: parsed.role || 'admin' });
          setIsAuthenticated(true);
        } else if (savedUserSession) {
          const parsed = JSON.parse(savedUserSession);
          setUser({ ...parsed, role: parsed.role || 'admin' });
          setIsAuthenticated(true);
        } else {
          setUser(DEFAULT_ADMIN_USER);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Failed to parse saved user credentials', err);
        setUser(DEFAULT_ADMIN_USER);
        setIsAuthenticated(true);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Validate password exists
    if (!password || password.length === 0) {
      setIsLoading(false);
      throw new Error('Please enter a password.');
    }

    const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0].toUpperCase(),
      email: email,
      role: role,
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    
    if (rememberMe) {
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
    } else {
      sessionStorage.setItem('currentUser', JSON.stringify(mockUser));
    }
    setIsLoading(false);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (email.includes('@') && password.length >= 6) {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: name,
        email: email,
        role: 'user',
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      sessionStorage.setItem('currentUser', JSON.stringify(mockUser));
      setIsLoading(false);
    } else {
      setIsLoading(false);
      throw new Error('Failed to create account. Please check your credentials.');
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    setIsLoading(false);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsLoading(false);
    if (!email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
  }, []);

  const resetPassword = useCallback(async (password: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsLoading(false);
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
