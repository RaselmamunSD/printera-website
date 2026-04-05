import axios, { type AxiosInstance } from 'axios';

const rawUrl = (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '');

export const API_URL = rawUrl;
export const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Optionally redirect to login
      if (typeof window !== 'undefined' && window.location.pathname.includes('dashboard')) {
        window.location.href = '/login';
      }
    }
    
    // Log detailed error information for debugging
    if (error.response?.status === 400) {
      console.error('400 Bad Request Error:', {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data,
        response: error.response?.data
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
