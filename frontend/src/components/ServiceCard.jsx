import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Tag } from 'lucide-react';

const ServiceCard = ({ service }) => {
  return (
    <div className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Service Image banner */}
        <div className="relative h-48 overflow-hidden bg-stone-100">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-[#FAF6ED]/95 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-[#2F6F4E] border border-stone-200">
            {service.category}
          </div>
        </div>

        {/* Content body */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#2F6F4E] transition-colors mb-2">
            {service.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">
            {service.shortDescription}
          </p>

          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <Clock size={14} className="text-[#2F6F4E]" />
              <span>{service.duration}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Tag size={14} className="text-[#D4A857]" />
              <span>Standard Warranty</span>
            </span>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="px-5 py-3.5 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-gray-400 block font-semibold">Starting from</span>
          <span className="text-lg font-extrabold text-[#2F6F4E]">${service.startingPrice}</span>
        </div>
        <Link
          to={`/services/${service._id}`}
          className="inline-flex items-center space-x-1 text-xs font-bold px-3.5 py-2 bg-[#2F6F4E] hover:bg-[#25593e] text-white rounded-lg transition"
        >
          <span>View Details</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;