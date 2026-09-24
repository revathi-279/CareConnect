import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    'Pending': 'bg-amber-100 text-amber-800 border-amber-300',
    'Confirmed': 'bg-sky-100 text-sky-800 border-sky-300',
    'In Progress': 'bg-purple-100 text-purple-800 border-purple-300',
    'Completed': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'Cancelled': 'bg-rose-100 text-rose-800 border-rose-300',
  };

  const badgeStyle = styles[status] || 'bg-gray-100 text-gray-700 border-gray-300';

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {status}
    </span>
  );
};

export default StatusBadge;