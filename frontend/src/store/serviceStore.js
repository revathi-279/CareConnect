import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

const useServiceStore = create((set) => ({
  categories: [],
  services: [],
  isLoading: false,

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/categories');
      set({ categories: response.data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to load categories');
    }
  },

  // Fetch services, optionally filtered by a category ID
  fetchServices: async (categoryId = '') => {
    set({ isLoading: true });
    try {
      const url = categoryId ? `/services?category=${categoryId}` : '/services';
      const response = await api.get(url);
      set({ services: response.data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to load services');
    }
  },
}));

export default useServiceStore;