import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Check, X, Clock, Tag, Calendar, MapPin, Phone, ShieldCheck, AlertCircle } from 'lucide-react';

const timeSlots = [
  '09:00 AM - 11:00 AM',
  '11:00 AM - 01:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM'
];

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking Form State
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState(timeSlots[0]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get(`/services/${id}`);
        if (res.data?.success) {
          setService(res.data.data);
        }
      } catch (err) {
        setError(err.message || 'Service not found');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  useEffect(() => {
    if (user?.phone) {
      setPhone(user.phone);
    }
  }, [user]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setBookingError('');

    try {
      const res = await api.post('/bookings', {
        service: service._id,
        address,
        phone,
        date,
        timeSlot,
        notes
      });

      if (res.data?.success) {
        navigate(`/bookings/${res.data.data._id}`);
      }
    } catch (err) {
      setBookingError(err.message || 'Booking submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading service details..." />;
  if (error || !service) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-red-50 text-red-700 rounded-2xl text-center">
        {error || 'Service not found'}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Service Information */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2F6F4E] bg-[#2F6F4E]/10 px-3 py-1 rounded-full">
              {service.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mt-3">
              {service.name}
            </h1>
            <p className="text-gray-600 mt-3 text-base leading-relaxed">
              {service.description}
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm max-h-[380px]">
            <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
          </div>

          {/* WHAT'S INCLUDED / NOT INCLUDED */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Included */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald-900 mb-4 flex items-center space-x-1.5">
                <Check size={18} className="text-emerald-700" />
                <span>What's Included</span>
              </h3>
              <ul className="space-y-2.5 text-sm text-emerald-950 font-medium">
                {service.included?.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-700 font-bold shrink-0 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not Included */}
            <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-rose-900 mb-4 flex items-center space-x-1.5">
                <X size={18} className="text-rose-700" />
                <span>Not Included</span>
              </h3>
              <ul className="space-y-2.5 text-sm text-rose-950 font-medium">
                {service.notIncluded?.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-rose-700 font-bold shrink-0 mt-0.5">×</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Out of scope callout */}
          <div className="bg-[#FAF6ED] border border-stone-300 rounded-2xl p-4 text-xs text-gray-700 flex items-start space-x-3">
            <AlertCircle size={20} className="text-[#D4A857] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Need something outside this scope?</span>
              <p className="mt-0.5 text-gray-500">
                Additional work requirements can be discussed on-site with your assigned service professional.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Booking Form Widget */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xl">
            <div className="pb-6 border-b border-stone-100 flex justify-between items-end">
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">Total Estimate</span>
                <div className="text-3xl font-extrabold text-[#2F6F4E]">${service.startingPrice}</div>
              </div>
              <div className="text-right text-xs text-gray-500">
                <span className="flex items-center space-x-1 justify-end">
                  <Clock size={14} className="text-[#2F6F4E]" />
                  <span>{service.duration}</span>
                </span>
                <span className="text-stone-400 mt-0.5 block">Standard Visit</span>
              </div>
            </div>

            {bookingError && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg font-medium">
                {bookingError}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Service Address
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Flat number, Street, Landmark"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F6F4E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F6F4E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Service Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F6F4E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Arrival Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F6F4E]"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Special Notes (Optional)
                </label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Gate code, specific symptoms or instructions"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F6F4E]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#2F6F4E] hover:bg-[#25593e] text-white font-bold rounded-xl shadow-lg transition duration-200 disabled:opacity-50"
              >
                {submitting ? 'Assigning Provider...' : user ? 'Confirm Booking' : 'Login to Book Service'}
              </button>

              <p className="text-[11px] text-center text-gray-500">
                You will be assigned a verified specialist for this category.
              </p>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServiceDetails;