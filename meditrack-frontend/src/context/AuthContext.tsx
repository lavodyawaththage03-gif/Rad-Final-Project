import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  role: 'student' | 'doctor' | 'admin';
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  register: (email: string, password: string, confirmPassword: string, role: string, firstName?: string, lastName?: string, additionalData?: any) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Add a request interceptor to attach the JWT token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
const API_BASE_URL = 'http://localhost:8080/api/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/me`);
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh user data on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const register = useCallback(
    async (
      email: string,
      password: string,
      confirmPassword: string,
      role: string,
      firstName?: string,
      lastName?: string,
      additionalData?: any
    ) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/register`, {
          ...additionalData,
          email,
          password,
          confirmPassword,
          role: role.toUpperCase(),
          firstName,
          lastName,
          dateOfBirth: additionalData?.dateOfBirth ? new Date(additionalData.dateOfBirth).toISOString().split('T')[0] : undefined
        });
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
      } catch (error: any) {
        console.error("Registration error:", error);
        if (error.response) {
          let backendError = error.response.data?.error || error.response.data?.message;
          if (!backendError) {
            if (typeof error.response.data === 'string' && error.response.data.trim() !== '') {
              backendError = error.response.data;
            } else if (typeof error.response.data === 'object' && Object.keys(error.response.data).length > 0) {
              backendError = JSON.stringify(error.response.data);
            } else {
              backendError = `Server error: ${error.response.status}`;
            }
          }
          throw new Error(backendError);
        } else if (error.request) {
          throw new Error('Network error: Backend server might not be running or CORS issue');
        } else {
          throw new Error(error.message || 'Registration failed');
        }
      }
    },
    []
  );

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
           throw new Error('Invalid email or password');
        }
        throw new Error(error.response?.data?.error || `Server error: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Network error: Backend server might not be running');
      } else {
        throw new Error('Login failed: ' + error.message);
      }
    }
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
