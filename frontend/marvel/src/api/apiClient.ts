import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.marvelcinema.local/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor to inject JWT Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('marvel_jwt_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for Error Handling and Refresh Token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Simulate token refresh on 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('[API Client] 401 Unauthorized. Attempting silent token refresh...');
      
      try {
        // In a live environment: call /auth/refresh-token
        const refreshToken = localStorage.getItem('marvel_refresh_token');
        if (refreshToken) {
          // Mocking token refresh success
          const newMockToken = 'mock_jwt_token_' + Math.random().toString(36).substring(2);
          localStorage.setItem('marvel_jwt_token', newMockToken);
          console.info('[API Client] Silent refresh succeeded. Retrying request...');
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newMockToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('[API Client] Refresh token expired or failed. Logging out...', refreshError);
        localStorage.removeItem('marvel_jwt_token');
        localStorage.removeItem('marvel_refresh_token');
        localStorage.removeItem('marvel_current_user');
        window.location.href = '/login?expired=true';
        return Promise.reject(refreshError);
      }
    }

    // Handle standard errors
    const errorMessage = (error.response?.data as { message?: string })?.message || error.message || 'An error occurred';
    console.error('[API Client Error]', errorMessage);
    
    // We only toast error messages when not in a mock flow
    // To make sure toast notifications show up properly on failure:
    // toast.error(errorMessage);

    return Promise.reject(error);
  }
);

export default apiClient;
