import axios from 'axios';

export interface LoginResponse {
  status: boolean;
  statusCode: number;
  access_token: string;
  message: string;
  user: {
    id: number;
    user_id: string;
    user_name: string;
    email: string;
    description: string;
    jurisdiction: string;
    role: string;
    is_disabled: boolean;
    is_deleted: boolean;
    first_login: boolean;
    email_verified: boolean;
    initial_password: string;
    created_by: number | null;
    created_at: string;
    updated_at: string;
    data_id: number;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

const BASE_URL = 'https://kp-floods-2025-backend-production.up.railway.app';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await axios.post<LoginResponse>(`${BASE_URL}/auth/log-in`, credentials);
      
      // Store token and user info in localStorage
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    const token = authApi.getToken();
    if (!token) return false;

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return expiry > Date.now();
    } catch {
      return false;
    }
  }
};

// Create axios instance with auth header
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = authApi.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authApi.logout();
    }
    return Promise.reject(error);
  }
);

export default authApi;