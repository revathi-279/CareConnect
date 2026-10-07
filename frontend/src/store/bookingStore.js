import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

const useBookingStore = create((set, get) => ({
  bookings: [],
  isLoading: false,

  fetchMyBookings: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/bookings');
      set({ bookings: response.data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to load bookings');
    }
  },

  updateJobStatus: async (bookingId, newStatus) => {
    set({ isLoading: true });
    try {
      await api.patch(`/jobs/${bookingId}/status`, { status: newStatus });
      toast.success(`Job status updated!`);
      // Refresh the bookings list to show the new status immediately
      await get().fetchMyBookings();
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Failed to update job status');
      return false;
    }
  },

  // Add this inside your zustand store definition
  resolveDispute: async (bookingId, resolutionData) => {
    set({ isLoading: true });
    try {
      await api.patch(`/bookings/${bookingId}/resolve`, resolutionData);
      toast.success('Dispute resolved successfully!');
      // Refresh bookings so the UI updates
      get().fetchMyBookings(); 
      set({ isLoading: false });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resolve dispute');
      set({ isLoading: false });
      return false;
    }
  }
}));

export default useBookingStore;