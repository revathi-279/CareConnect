import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

const useRequestStore = create((set) => ({
  myRequests: [],
  isLoading: false,

 createRequest: async (requestData) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/requests', requestData);
      const newRequest = response.data.data;

      // Automatically run AI classification without waiting for manual intervention
      try {
        await api.post('/ai/classify', { requestId: newRequest._id });
      } catch (aiErr) {
        console.warn('Auto classification note:', aiErr.message);
      }

      set({ isLoading: false });
      toast.success('Request submitted and analyzed by AI!');
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Failed to submit request');
      return false;
    }
  },

  fetchMyRequests: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/requests/me');
      set({ myRequests: response.data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to load your requests');
    }
  },

  // --- ADD THIS NEW FUNCTION ---
  fetchOpenRequests: async () => {
    set({ isLoading: true });
    try {
      // Fetch requests that are 'classified' so providers can quote on them
      const response = await api.get('/requests?status=classified');
      set({ isLoading: false });
      return response.data.data;
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to load job board');
      return [];
    }
  },

  
  // -----------------------------
}));

export default useRequestStore;