import React, { createContext, useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../config/api';
import type { User } from '../types/auth';

const TOKEN_KEY = 'globetrotter_token';
const USER_KEY = 'currentUser';
const PENDING_TOKEN_KEY = 'globetrotter_pending_token';
const PENDING_EMAIL_KEY = 'globetrotter_pending_email';

interface SignupResponse {
  user: User;
  message: string;
}

interface LoginResponse {
  message: string;
  pending_token?: string;
}

interface VerifySignupResponse {
  message: string;
}

interface VerifyLoginOtpResponse {
  user: User;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  verifySignup: (email: string, otp: string) => Promise<void>;
  verifyLoginOtp: (otp: string) => Promise<void>;
  resendOtp: (email: string, purpose: 'signup_verify' | 'login_mfa') => Promise<void>;
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

function readStorageValue(key: string): string | null {
  return localStorage.getItem(key) ?? sessionStorage.getItem(key) ?? null;
}

function writeStorageValue(key: string, value: string, persist: boolean): void {
  const storage = persist ? localStorage : sessionStorage;
  storage.setItem(key, value);
}

function clearStoredAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(PENDING_TOKEN_KEY);
  localStorage.removeItem(PENDING_EMAIL_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(PENDING_TOKEN_KEY);
  sessionStorage.removeItem(PENDING_EMAIL_KEY);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_ADMIN_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {

        const savedToken = readStorageValue(TOKEN_KEY);
        const savedUserLocal = localStorage.getItem(USER_KEY);
        const savedUserSession = sessionStorage.getItem(USER_KEY);

        if (savedToken) {
          const parsed = JSON.parse(savedUserLocal ?? savedUserSession ?? 'null');
          setUser(parsed);

          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Failed to parse saved user credentials', err);

        clearStoredAuth();

      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);


    try {
      const result = await apiRequest<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const pendingToken = result.pending_token;
      if (!pendingToken) {
        throw new Error('Missing login verification code.');
      }

      writeStorageValue(PENDING_TOKEN_KEY, pendingToken, rememberMe);
      writeStorageValue(PENDING_EMAIL_KEY, email, rememberMe);
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid email or password. Please try again.';
      throw new Error(message);
    } finally {
      setIsLoading(false);

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


    try {
      await apiRequest<SignupResponse>('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ full_name: name, email, password }),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create account. Please try again.';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifySignup = useCallback(async (email: string, otp: string) => {
    setIsLoading(true);

    try {
      await apiRequest<VerifySignupResponse>('/api/auth/verify-signup', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Verification failed. Please try again.';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyLoginOtp = useCallback(async (otp: string) => {
    setIsLoading(true);

    try {
      const pendingToken = readStorageValue(PENDING_TOKEN_KEY);
      if (!pendingToken) {
        throw new Error('Your login session has expired. Please log in again.');
      }

      const result = await apiRequest<VerifyLoginOtpResponse>('/api/auth/verify-login-otp', {
        method: 'POST',
        body: JSON.stringify({ pending_token: pendingToken, otp }),
      });

      const nextUser = result.user;
      const token = result.token;

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      localStorage.removeItem(PENDING_TOKEN_KEY);
      localStorage.removeItem(PENDING_EMAIL_KEY);
      sessionStorage.removeItem(PENDING_TOKEN_KEY);
      sessionStorage.removeItem(PENDING_EMAIL_KEY);
      setUser(nextUser);
      setIsAuthenticated(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login verification failed. Please try again.';
      throw new Error(message);
    } finally {

      setIsLoading(false);
    }
  }, []);

  const resendOtp = useCallback(async (email: string, purpose: 'signup_verify' | 'login_mfa') => {
    setIsLoading(true);

    try {
      await apiRequest<{ message: string }>('/api/auth/resend-otp', {
        method: 'POST',
        body: JSON.stringify({ email, purpose }),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not resend the verification code.';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);


    try {
      clearStoredAuth();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }

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
        verifySignup,
        verifyLoginOtp,
        resendOtp,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
