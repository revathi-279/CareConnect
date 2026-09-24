import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, Clock, MapPin, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';

const statusSteps = ['Booking Created', 'Confirmed', 'In Progress', 'Completed'];

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const fetchBooking = async () => {
    try {
      const res = await api.get(`/bookings/${id}`);
      if (res.data?.success) {
        setBooking(res.data.data);
      }
    } catch (err) {
      setError(err.message || 'Booking not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancelling(true);
    try {
      await api.patch(`/bookings/${id}/cancel`);
      await fetchBooking();
    } catch (err) {
      alert(err.message || 'Cancellation failed');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading booking session..." />;
  if (error || !booking) {
    return <div className="max-w-md mx-auto my-16 p-6 bg-red-50 text-red-700 rounded-2xl text-center">{error}</div>;
  }

  // Calculate timeline active step index
  const getStepIndex = () => {
    if (booking.status === 'Cancelled') return -1;
    if (booking.status === 'Pending') return 0;
    if (booking.status === 'Confirmed') return 1;
    if (booking.status === 'In Progress') return 2;
    if (booking.status === 'Completed') return 3;
    return 0;
  };

  const activeIdx = getStepIndex();
  const canCancel = booking.status === 'Pending' || booking.status === 'Confirmed';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-mono text-gray-400">Order #{booking._id}</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] mt-1">
            {booking.service?.name}
          </h1>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Visual Status Timeline */}
      {booking.status !== 'Cancelled' ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-6">Service Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
            {statusSteps.map((step, idx) => {
              const isPassed = activeIdx >= idx;
              const isCurrent = activeIdx === idx;
              return (
                <div key={step} className="flex flex-col items-center text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition ${
                      isCurrent
                        ? 'bg-[#2F6F4E] text-white ring-4 ring-[#2F6F4E]/20'
                        : isPassed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 size={18} /> : idx + 1}
                  </div>
                  <span className={`text-xs font-semibold ${isCurrent ? 'text-[#2F6F4E]' : 'text-gray-600'}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center text-rose-800 font-semibold text-sm">
          This booking has been cancelled.
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logistics */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">Appointment Details</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center space-x-3">
              <Calendar size={18} className="text-[#2F6F4E]" />
              <span><strong>Date:</strong> {booking.date}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock size={18} className="text-[#2F6F4E]" />
              <span><strong>Slot:</strong> {booking.timeSlot}</span>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin size={18} className="text-[#2F6F4E] shrink-0 mt-0.5" />
              <span><strong>Address:</strong> {booking.address}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone size={18} className="text-[#2F6F4E]" />
              <span><strong>Contact:</strong> {booking.phone}</span>
            </div>
            {booking.notes && (
              <div className="pt-2 text-xs bg-[#FAF6ED] p-3 rounded-xl border border-stone-200">
                <strong>Customer Notes:</strong> {booking.notes}
              </div>
            )}
          </div>
        </div>

        {/* Assigned Provider */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">Assigned Professional</h3>
          {booking.provider ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-[#2F6F4E]/10 text-[#2F6F4E] flex items-center justify-center font-bold text-lg">
                  {booking.provider.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-[#1F2937]">{booking.provider.name}</h4>
                  <p className="text-xs text-gray-500">Rating: ★ {booking.provider.rating || 4.8} / 5.0</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Phone:</strong> {booking.provider.phone}</p>
                <p><strong>Experience:</strong> {booking.provider.experience || 3} Years</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Provider details will be updated shortly.</p>
          )}

          {canCancel && (
            <div className="pt-4 border-t border-stone-100">
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition"
              >
                {cancelling ? 'Cancelling...' : 'Cancel This Booking'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;