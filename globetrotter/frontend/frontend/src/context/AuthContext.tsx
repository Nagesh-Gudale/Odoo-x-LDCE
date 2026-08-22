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

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if a session already exists on load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUserLocal = localStorage.getItem('currentUser');
        const savedUserSession = sessionStorage.getItem('currentUser');
        
        if (savedUserLocal) {
          const parsed = JSON.parse(savedUserLocal);
          setUser(parsed);
          setIsAuthenticated(true);
        } else if (savedUserSession) {
          const parsed = JSON.parse(savedUserSession);
          setUser(parsed);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Failed to parse saved user credentials', err);
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation rules
    if (email === 'admin@globetrotter.com' || (email.includes('@') && password.length >= 8)) {
      const mockUser: User = {
        id: '1',
        name: email.split('@')[0].toUpperCase(),
        email: email,
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
      } else {
        sessionStorage.setItem('currentUser', JSON.stringify(mockUser));
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
      throw new Error('Invalid email or password. Please try again.');
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email.includes('@') && password.length >= 8) {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: name,
        email: email,
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      // Auto-persist in sessionStorage by default
      sessionStorage.setItem('currentUser', JSON.stringify(mockUser));
      setIsLoading(false);
    } else {
      setIsLoading(false);
      throw new Error('Failed to create account. Please check your credentials.');
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    setIsLoading(false);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    // Silent success as per request (do not leak user existence)
    if (!email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
  }, []);

  const resetPassword = useCallback(async (password: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
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
