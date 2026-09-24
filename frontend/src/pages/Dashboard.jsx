import React, { useState, useEffect } from 'react';
import api from '../services/api';
import BookingCard from '../components/BookingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my');
      if (res.data?.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      setError(err.message || 'Unable to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.patch(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch (err) {
      alert(err.message || 'Cancellation failed');
    }
  };

  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'In Progress').length;
  const completedCount = bookings.filter((b) => b.status === 'Completed').length;

  if (loading) return <LoadingSpinner text="Fetching your appointments..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-[#1F2937]">Customer Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage and inspect your booked home service sessions.</p>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-gray-500">Pending Requests</p>
            <p className="text-2xl font-extrabold text-[#1F2937]">{pendingCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-gray-500">Upcoming / In Progress</p>
            <p className="text-2xl font-extrabold text-[#1F2937]">{confirmedCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-gray-500">Completed Services</p>
            <p className="text-2xl font-extrabold text-[#1F2937]">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div>
        <h2 className="text-2xl font-bold text-[#1F2937] mb-6">My Bookings</h2>
        {bookings.length === 0 ? (
          <EmptyState
            title="You don't have any bookings yet"
            message="Discover our trusted professionals and book your first service today."
            actionLabel="Explore Services"
            actionTo="/services"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} onCancel={handleCancelBooking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;