/**
 * Industry-Grade Axios API Service with Automatic Silent Token Refresh
 * ---------------------------------------------------------------------
 * Handles attaching JWT Bearer tokens to outgoing requests and automatically
 * refreshes access tokens when encountering 401 Unauthorized responses.
 */

import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Silent Refresh on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 Unauthorized and not already retried
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const userInfo = localStorage.getItem('userInfo')
          ? JSON.parse(localStorage.getItem('userInfo'))
          : null;

        if (userInfo && userInfo.refresh) {
          // Attempt token refresh call
          const { data } = await axios.post(`${API_BASE_URL}/users/token/refresh/`, {
            refresh: userInfo.refresh,
          });

          // Update saved access token (and refresh token if rotated)
          const updatedUserInfo = {
            ...userInfo,
            token: data.access,
            refresh: data.refresh || userInfo.refresh,
          };

          localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

          // Set updated Authorization header and retry original request
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token expired or blacklisted -> clean logout
        localStorage.removeItem('userInfo');
        window.location.href = '/login?expired=true';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
