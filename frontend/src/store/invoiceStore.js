import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

const useInvoiceStore = create((set) => ({
  invoices: [],
  isLoading: false,

  fetchMyInvoices: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/invoices');
      set({ invoices: response.data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to load invoices');
    }
  },

  generateInvoice: async (bookingId) => {
    set({ isLoading: true });
    try {
      await api.post('/invoices', { bookingId });
      toast.success('Invoice generated and job completed!');
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Failed to generate invoice');
      return false;
    }
  },

  payInvoice: async (invoiceId) => {
    set({ isLoading: true });
    try {
      await api.patch(`/invoices/${invoiceId}/pay`);
      toast.success('Payment successful!');
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Payment failed');
      return false;
    }
  }
}));

export default useInvoiceStore;