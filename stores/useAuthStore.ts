import { create } from 'zustand';
import { auth } from '@/config/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuth from '@/hooks/useAuth';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  checkStoredCredentials: (autoSignIn: () => Promise<{ success: boolean, data?: any, message: string }>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  checkStoredCredentials: async (autoSignIn) => {
    try {
      const credentials = await AsyncStorage.getItem('userCredentials');
      if (credentials) {
        const parsedCredentials = JSON.parse(credentials);
        const { rememberMe } = parsedCredentials;

        if (rememberMe) {
          const res = await autoSignIn();
          if (res.success) {
            set((state) => ({
              ...state,
              user: res.data,
            }));
          } else {
            console.log('Auto sign-in failed');
          }
        }
      } else {
        console.log('No credentials found');
      }
    } catch (error) {
      console.error('Error checking stored credentials:', error);
    }
  },
  logout: () => {
    auth.signOut().then(() => set({ user: null }));
  },
}));

onAuthStateChanged(auth, (user) => {
  useAuthStore.getState().setUser(user);
});
