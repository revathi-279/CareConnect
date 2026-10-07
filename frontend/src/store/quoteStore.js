import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

const useQuoteStore = create((set) => ({
  quotes: [],
  isLoading: false,

  fetchQuotesForRequest: async (requestId) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/quotes?requestId=${requestId}`);
      set({ quotes: response.data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to load quotes');
    }
  },

  submitQuote: async (quoteData) => {
    set({ isLoading: true });
    try {
      await api.post('/quotes', quoteData);
      set({ isLoading: false });
      toast.success('Quote submitted successfully!');
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Failed to submit quote');
      return false;
    }
  },

// We are adding requestId as a second parameter
  // Add 'schedule' as a third parameter
  acceptQuote: async (quoteId, requestId, schedule) => {
    set({ isLoading: true });
    try {
      // 1. Mark the quote as accepted
      await api.patch(`/quotes/${quoteId}/status`, { status: 'accepted' });
      
      // 2. Generate the booking with the required scheduling data
      await api.post('/bookings', { 
        quoteId, 
        requestId,
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime
      });

      set({ isLoading: false });
      toast.success('Quote accepted and Job scheduled!');
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Failed to accept quote');
      return false;
    }
  }
}));

export default useQuoteStore;