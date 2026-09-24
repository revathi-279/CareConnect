import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({ title, message, actionLabel, actionTo }) => {
  return (
    <div className="text-center py-14 px-4 bg-white rounded-2xl border border-stone-200 shadow-sm max-w-md mx-auto my-6">
      <div className="w-14 h-14 bg-[#FAF6ED] rounded-full flex items-center justify-center mx-auto text-[#2F6F4E] mb-4">
        <FolderOpen size={28} />
      </div>
      <h3 className="text-lg font-bold text-[#1F2937] mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-6">{message}</p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-block px-5 py-2.5 bg-[#2F6F4E] hover:bg-[#25593e] text-white text-sm font-semibold rounded-lg shadow transition"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;