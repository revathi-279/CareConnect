import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Calendar, Clock, MapPin, Phone, Briefcase } from 'lucide-react';

const ProviderDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/provider/bookings');
      if (res.data?.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      setError(err.message || 'Unable to load assigned jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, nextStatus) => {
    setUpdatingId(id);
    try {
      await api.patch(`/provider/bookings/${id}/status`, { status: nextStatus });
      await fetchBookings();
    } catch (err) {
      alert(err.message || 'Status update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching assigned service requests..." />;

  const pendingJobs = bookings.filter((b) => b.status === 'Pending').length;
  const activeJobs = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'In Progress').length;
  const completedJobs = bookings.filter((b) => b.status === 'Completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#2F6F4E]">Provider Portal</span>
        <h1 className="text-3xl font-extrabold text-[#1F2937] mt-1">Assigned Service Queue</h1>
        <p className="text-gray-600">Review scheduled customer visits and advance job statuses.</p>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-gray-500">Pending Acceptance</p>
            <p className="text-2xl font-extrabold text-[#1F2937]">{pendingJobs}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-gray-500">Active Jobs</p>
            <p className="text-2xl font-extrabold text-[#1F2937]">{activeJobs}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-gray-500">Completed Jobs</p>
            <p className="text-2xl font-extrabold text-[#1F2937]">{completedJobs}</p>
          </div>
        </div>
      </div>

      {/* Jobs Table / Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#1F2937]">Assigned Jobs</h2>
        {bookings.length === 0 ? (
          <EmptyState
            title="No assigned jobs found"
            message="When customers in your category schedule appointments, they will appear here."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-lg text-[#1F2937]">{booking.service?.name}</h3>
                    <p className="text-xs text-gray-500">Customer: <strong>{booking.customer?.name}</strong></p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="text-sm text-gray-600 space-y-1.5 border-t border-b border-stone-100 py-3">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-[#2F6F4E]" />
                    <span>{booking.date} ({booking.timeSlot})</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin size={16} className="text-[#2F6F4E] shrink-0 mt-0.5" />
                    <span>{booking.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-[#2F6F4E]" />
                    <span>{booking.phone}</span>
                  </div>
                </div>

                {/* Status Advancement Controls */}
                <div className="pt-2">
                  <span className="text-xs font-semibold text-gray-400 block mb-2">Update Stage:</span>
                  <div className="flex flex-wrap gap-2">
                    {booking.status === 'Pending' && (
                      <button
                        onClick={() => handleStatusChange(booking._id, 'Confirmed')}
                        disabled={updatingId === booking._id}
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition"
                      >
                        Accept & Confirm
                      </button>
                    )}

                    {booking.status === 'Confirmed' && (
                      <button
                        onClick={() => handleStatusChange(booking._id, 'In Progress')}
                        disabled={updatingId === booking._id}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition"
                      >
                        Start Service (In Progress)
                      </button>
                    )}

                    {booking.status === 'In Progress' && (
                      <button
                        onClick={() => handleStatusChange(booking._id, 'Completed')}
                        disabled={updatingId === booking._id}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition"
                      >
                        Mark Job Completed
                      </button>
                    )}

                    {booking.status === 'Completed' && (
                      <span className="text-xs font-bold text-emerald-700">✓ Finished</span>
                    )}

                    {booking.status === 'Cancelled' && (
                      <span className="text-xs font-bold text-rose-700">Cancelled by customer</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;