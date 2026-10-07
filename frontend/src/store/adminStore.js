import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

const useAdminStore = create((set, get) => ({
  analytics: null,
  disputes: [],
  logs: [],
  isLoading: false,

fetchDashboardData: async () => {
    set({ isLoading: true });
    try {
      const [analyticsRes, disputesRes, logsRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/bookings?status=disputed'), // Changed from /jobs to /bookings
        api.get('/admin/audit')
      ]);
      
      set({ 
        analytics: analyticsRes.data.data, 
        disputes: disputesRes.data.data,
        logs: logsRes.data.data,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to load admin data');
    }
  },

  resolveDispute: async (jobId, resolutionNotes) => {
    set({ isLoading: true });
    try {
      // In a full production app, you might have a dedicated /resolve endpoint.
      // Here, we update the status back to a workable state (e.g., 'completed' or 'canceled')
      await api.patch(`/jobs/${jobId}/status`, { status: 'completed' }); 
      toast.success('Dispute resolved & job marked completed.');
      await get().fetchDashboardData(); // Refresh data
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Failed to resolve dispute');
      return false;
    }
  }
}));

export default useAdminStore;