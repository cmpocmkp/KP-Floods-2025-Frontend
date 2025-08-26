import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE } from '../lib/env';

export interface User {
  _id: string;
  user_id: string;
  user_name: string;
  email: string;
  description: string;
  jurisdiction: string;
  role: string;
  is_disabled: boolean;
  is_deleted: boolean;
  first_login: boolean;
  initial_password: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userId: string, password: string) => Promise<{ success: boolean; user?: any; error?: string }>;
  logout: () => void;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  refreshUserData: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE}/users/auth`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setToken(token);
        setUser(userData);
        localStorage.setItem('crux_user', JSON.stringify(userData));
        return true;
      } else {
        // Token is invalid or expired
        localStorage.removeItem('crux_auth_token');
        localStorage.removeItem('crux_user');
        setToken(null);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('crux_auth_token');
      localStorage.removeItem('crux_user');
      setToken(null);
      setUser(null);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('crux_auth_token');
        if (storedToken) {
          const isValid = await verifyToken(storedToken);
          if (isValid) {
            console.log('🔐 Token verified, user authenticated');
          } else {
            console.log('🔐 Token invalid, cleared authentication');
          }
        } else {
          console.log('🔐 No stored authentication found');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [API_BASE]);

  const login = async (userId: string, password: string) => {
    try {
      console.log('Attempting login:', { API_BASE, userId });
      const response = await fetch(`${API_BASE}/auth/log-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify({ username: userId, password }),
      });

      const result = await response.json();
      console.log('Login response:', { status: response.status, result });

      if (response.ok && result.status && result.statusCode === 200) {
        const token = result.access_token;
        const userData = result.user;
        
        setUser(userData);
        setToken(token);
        
        // Store in localStorage
        localStorage.setItem('crux_auth_token', token);
        localStorage.setItem('crux_user', JSON.stringify(userData));

        return { 
          success: true,
          user: userData
        };
      } else {
        console.log('Login failed:', { status: response.status, result });
        return { success: false, error: result?.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    // Clear local storage and state
    localStorage.removeItem('crux_auth_token');
    localStorage.removeItem('crux_user');
    setUser(null);
    setToken(null);
  };

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    if (!token || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const response = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          old_password: oldPassword, 
          new_password: newPassword 
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update user's first_login status
        const updatedUser = { ...user, first_login: false };
        setUser(updatedUser);
        localStorage.setItem('crux_user', JSON.stringify(updatedUser));
        
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Password change failed' };
      }
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const refreshUserData = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const userData = result.data;
        setUser(userData);
        localStorage.setItem('crux_user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    updatePassword,
    refreshUserData,
    isAuthenticated: !!user && !!token,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 