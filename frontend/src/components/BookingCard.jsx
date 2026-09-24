import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

const BookingCard = ({ booking, onCancel }) => {
  const canCancel = booking.status === 'Pending' || booking.status === 'Confirmed';

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-stone-100">
        <div>
          <h4 className="text-base font-bold text-[#1F2937]">{booking.service?.name || 'Home Service'}</h4>
          <p className="text-xs text-gray-500 font-mono">Ref: #{booking._id.slice(-6).toUpperCase()}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="py-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Calendar size={16} className="text-[#2F6F4E]" />
          <span>{booking.date}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock size={16} className="text-[#2F6F4E]" />
          <span>{booking.timeSlot}</span>
        </div>
        <div className="flex items-start space-x-2">
          <MapPin size={16} className="text-[#2F6F4E] shrink-0 mt-0.5" />
          <span className="line-clamp-1">{booking.address}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
        <Link
          to={`/bookings/${booking._id}`}
          className="inline-flex items-center space-x-1 text-xs font-bold text-[#2F6F4E] hover:underline"
        >
          <span>View Details</span>
          <ArrowRight size={14} />
        </Link>
        {canCancel && onCancel && (
          <button
            onClick={() => onCancel(booking._id)}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 px-2.5 py-1 rounded border border-rose-200 hover:bg-rose-50 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;