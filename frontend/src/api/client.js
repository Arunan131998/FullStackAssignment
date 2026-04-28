import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const storedToken = sessionStorage.getItem('token');

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

export function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }
  delete apiClient.defaults.headers.common.Authorization;
}

setAuthToken(storedToken);

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

// Add response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid session and redirect
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('role');
      setAuthToken(null);
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
