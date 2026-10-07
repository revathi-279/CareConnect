import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import toast from 'react-hot-toast';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { _id, name, role, token } = response.data;
          
          set({
            user: { _id, name, email, role },
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          toast.success('Welcome back!');
          return true;
        } catch (error) {
          set({ isLoading: false });
          toast.error(error.response?.data?.message || 'Login failed');
          return false;
        }
      },

      register: async (name, email, password, role = 'customer') => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/register', { name, email, password, role });
          const { _id, token } = response.data;
          
          set({
            user: { _id, name, email, role },
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          toast.success('Account created successfully!');
          return true;
        } catch (error) {
          set({ isLoading: false });
          toast.error(error.response?.data?.message || 'Registration failed');
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        toast.success('Logged out successfully');
      },
    }),
    {
      name: 'auth-storage', // name of item in localStorage
    }
  )
);

export default useAuthStore;