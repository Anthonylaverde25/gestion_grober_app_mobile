import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { useAuthStore } from '../store/auth-store';

// Detect the IP of the host machine (Mac) to allow connection from physical devices
const debuggerHost = Constants.expoConfig?.hostUri?.split(':').shift();
const localhost = debuggerHost || '10.0.2.2'; // Fallback to 10.0.2.2 for Android emulator

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || `https://gestiongroberapi-production.up.railway.app/api`;

console.log(`[Axios] API Base URL: ${BASE_URL}`);

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor
axiosClient.interceptors.request.use(
  async (config) => {
    const { token, activeCompanyId } = useAuthStore.getState();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (activeCompanyId) {
      config.headers['X-Company-ID'] = activeCompanyId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout on unauthorized
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
