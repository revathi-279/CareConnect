import React from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-3">
      <div className="w-10 h-10 border-4 border-[#2F6F4E]/20 border-t-[#2F6F4E] rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-gray-600">{text}</p>
    </div>
  );
};

export default LoadingSpinner;