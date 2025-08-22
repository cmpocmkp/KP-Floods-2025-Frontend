import axios from 'axios';

const BASE_URL = 'https://kp-floods-2025-backend-production.up.railway.app';

export const login = async (username: string, password: string) => {
  try {
    console.log('Attempting login with:', { username });
    const response = await axios.post(`${BASE_URL}/auth/log-in`, { username, password });
    console.log('Login response:', response.data);
    
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } else {
      throw new Error('No access token received');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  // Check if token is expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      // Token expired, clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
    return token;
  } catch (e) {
    // Invalid token, clear storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
};