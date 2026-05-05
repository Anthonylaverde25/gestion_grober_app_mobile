import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  user: any | null;
  activeCompanyId: string | null;
  setAuth: (token: string, user: any) => void;
  setActiveCompany: (companyId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      activeCompanyId: null,
      setAuth: (token, user) => set({ 
        token, 
        user, 
        // Auto-set the first company if available in user object
        activeCompanyId: user?.companies?.[0]?.id || null 
      }),
      setActiveCompany: (companyId) => set({ activeCompanyId: companyId }),
      logout: () => set({ token: null, user: null, activeCompanyId: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
