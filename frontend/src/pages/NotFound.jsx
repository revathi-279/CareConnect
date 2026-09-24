import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-extrabold text-[#2F6F4E]">404</h1>
      <h2 className="text-2xl font-bold text-[#1F2937] mt-3">Page Not Found</h2>
      <p className="text-sm text-gray-500 mt-2 max-w-sm">
        The home service page or booking link you are searching for does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-2.5 bg-[#2F6F4E] text-white font-bold rounded-xl shadow transition hover:bg-[#25593e]"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;