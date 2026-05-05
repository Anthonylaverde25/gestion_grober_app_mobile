import { useMutation } from '@tanstack/react-query';
import axiosClient from '@/infrastructure/api/axios-client';
import { useAuthStore } from '@/infrastructure/store/auth-store';
import { router } from 'expo-router';

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    companies: Array<{
      id: string;
      name: string;
    }>;
  };
}

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (credentials: { email: string; password: any }) => {
      // Laravel resources wrap the response in a 'data' object by default
      const response = await axiosClient.post<{ data: LoginResponse }>('/v1/auth/login', credentials);
      return response.data.data;
    },
    onSuccess: (data) => {
      // Store token and user
      setAuth(data.access_token, data.user);
      
      // Redirect to main app
      router.replace('/(tabs)');
    },
  });
};
