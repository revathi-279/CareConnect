import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

const useJobActivityStore = create((set, get) => ({
  evidence: [],
  extraWork: [],
  isLoading: false,
  isUploading: false,

  fetchActivity: async (bookingId) => {
    set({ isLoading: true });
    try {
      const [evidenceRes, workRes] = await Promise.all([
        api.get(`/evidence/${bookingId}`),
        api.get(`/additional-work/${bookingId}`)
      ]);
      set({ 
        evidence: evidenceRes.data.data, 
        extraWork: workRes.data.data, 
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to load job activity');
    }
  },

  uploadImage: async (file) => {
    set({ isUploading: true });
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set({ isUploading: false });
      return res.data.url;
    } catch (error) {
      set({ isUploading: false });
      toast.error(error.response?.data?.message || 'Image upload failed');
      return null;
    }
  },

  addEvidence: async (data) => {
    set({ isLoading: true });
    try {
      await api.post('/evidence', data);
      toast.success('Evidence uploaded!');
      await get().fetchActivity(data.bookingId);
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Failed to record evidence');
      return false;
    }
  },

  requestExtraWork: async (data) => {
    set({ isLoading: true });
    try {
      await api.post('/additional-work', data);
      toast.success('Scope change requested!');
      await get().fetchActivity(data.bookingId);
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Failed to request extra work');
      return false;
    }
  },

  respondToExtraWork: async (workId, bookingId, status) => {
    set({ isLoading: true });
    try {
      await api.patch(`/additional-work/${workId}/respond`, { status });
      toast.success(`Request ${status}!`);
      await get().fetchActivity(bookingId);
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Failed to respond');
      return false;
    }
  },
  reportIssue: async (bookingId, reason) => {
    set({ isLoading: true });
    try {
      await api.post(`/bookings/${bookingId}/dispute`, { reason });
      toast.success('Issue reported. Our Admin team will review this immediately.');
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Failed to report issue');
      return false;
    }
  },
}));

export default useJobActivityStore;