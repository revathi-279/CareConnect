import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

const useReviewStore = create((set) => ({
  isLoading: false,

  submitReview: async (bookingId, rating, comment) => {
    set({ isLoading: true });
    try {
      await api.post('/reviews', { bookingId, rating, comment });
      toast.success('Thank you! Your review has been submitted.');
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Failed to submit review');
      return false;
    }
  }
}));

export default useReviewStore;