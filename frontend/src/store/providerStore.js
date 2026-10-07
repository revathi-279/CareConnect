import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

const useProviderStore = create((set, get) => ({
  profile: null,
  availability: [],
  isLoading: false,

  fetchMyProfile: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/providers/profile/me');
      set({ profile: response.data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      // If 404, it just means they haven't created one yet, no need to show a huge error
      if (error.response?.status !== 404) {
        toast.error('Failed to load profile');
      }
    }
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/providers/profile', profileData);
      set({ profile: response.data.data, isLoading: false });
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Failed to update profile');
      return false;
    }
  },

  fetchMyAvailability: async (date = '') => {
    set({ isLoading: true });
    try {
      const url = date ? `/availability/me?date=${date}` : '/availability/me';
      const response = await api.get(url);
      set({ availability: response.data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to load availability');
    }
  },

  addAvailability: async (availabilityData) => {
    set({ isLoading: true });
    try {
      await api.post('/availability', availabilityData);
      set({ isLoading: false });
      toast.success('Time block added!');
      // Refresh the list immediately
      get().fetchMyAvailability();
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Failed to add availability');
      return false;
    }
  },

  deleteAvailability: async (id) => {
    try {
      await api.delete(`/availability/${id}`);
      toast.success('Time block removed');
      // Update local state to remove the deleted item without refetching
      set((state) => ({
        availability: state.availability.filter((block) => block._id !== id)
      }));
    } catch (error) {
      toast.error('Failed to delete availability');
    }
  }
}));

export default useProviderStore;