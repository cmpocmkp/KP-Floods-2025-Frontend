import { env } from '@/lib/env';

// Authenticated fetch wrapper that automatically adds JWT tokens
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('crux_auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  } as Record<string, string>;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 errors (token expired/invalid)
  if (response.status === 401) {
    localStorage.removeItem('crux_auth_token');
    localStorage.removeItem('crux_user');
    
    // Redirect to login page
    window.location.href = '/login';
    throw new Error('Authentication failed');
  }

  return response;
};

// Helper function for common API base URL
export const getApiUrl = (endpoint: string) => {
  // For Railway deployment, use relative URLs since frontend and backend are on same domain
  const baseUrl = env.API_BASE_URL || '/api';
  return `${baseUrl}${endpoint}`;
};

export default authFetch; 