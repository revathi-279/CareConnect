import { useEffect, useState } from 'react';
import useBookingStore from '../store/bookingStore';
import { ShieldAlert, CheckCircle, Search } from 'lucide-react';

const AdminDashboard = () => {
  const { bookings, fetchMyBookings, resolveDispute, isLoading } = useBookingStore();
  const [activeTab, setActiveTab] = useState('disputes');

  useEffect(() => {
    // For Admins, your backend getBookings should return ALL bookings on the platform
    fetchMyBookings();
  }, []);

  const handleResolve = async (bookingId) => {
    const notes = window.prompt("Enter resolution notes for this dispute:");
    if (!notes) return;

    const action = window.prompt("Action taken? (e.g., Refund Issued, Provider Warned, Dismissed)");
    if (!action) return;

    await resolveDispute(bookingId, { resolutionNotes: notes, action });
  };

  const disputedBookings = bookings.filter(b => b.status === 'disputed');
  const otherBookings = bookings.filter(b => b.status !== 'disputed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
            <ShieldAlert className="text-red-500" size={32} /> Admin Control Panel
          </h1>
          <p className="text-text-muted mt-2">Manage platform trust, safety, and overview.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200 mb-8">
        <button 
          className={`pb-3 font-medium transition-colors flex items-center gap-2 ${activeTab === 'disputes' ? 'text-red-600 border-b-2 border-red-600' : 'text-text-muted'}`} 
          onClick={() => setActiveTab('disputes')}
        >
          Active Disputes ({disputedBookings.length})
        </button>
        <button 
          className={`pb-3 font-medium transition-colors flex items-center gap-2 ${activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-text-muted'}`} 
          onClick={() => setActiveTab('all')}
        >
          All Platform Jobs
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading platform data...</div>
      ) : activeTab === 'disputes' ? (
        <div className="grid gap-6">
          {disputedBookings.length === 0 ? (
            <div className="bg-green-50 p-8 rounded-xl border border-green-100 text-center text-green-700">
              <CheckCircle size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold">Inbox Zero</h3>
              <p>There are no active disputes. The platform is running smoothly!</p>
            </div>
          ) : (
            disputedBookings.map(booking => (
              <div key={booking._id} className="bg-white rounded-2xl p-6 shadow-sm border-2 border-red-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase mb-2 inline-block">Needs Attention</span>
                    <h3 className="text-lg font-bold text-text-main">Job #{booking._id.slice(-6).toUpperCase()}</h3>
                  </div>
                  <div className="text-right">
                    <button 
                      onClick={() => handleResolve(booking._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Resolve Dispute
                    </button>
                  </div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-4">
                  <h4 className="text-sm font-bold text-red-800 mb-1">Customer Complaint:</h4>
                  <p className="text-red-900 italic">"{booking.disputeReason || 'No reason provided.'}"</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="font-bold text-text-muted block mb-1">Customer</span>
                    {booking.customer?.name} ({booking.customer?.email})
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="font-bold text-text-muted block mb-1">Provider</span>
                    {booking.provider?.name || 'Unassigned'} 
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-text-muted">Job ID</th>
                <th className="p-4 font-semibold text-text-muted">Status</th>
                <th className="p-4 font-semibold text-text-muted">Price</th>
                <th className="p-4 font-semibold text-text-muted">Customer</th>
              </tr>
            </thead>
            <tbody>
              {otherBookings.map(b => (
                <tr key={b._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-medium">#{b._id.slice(-6).toUpperCase()}</td>
                  <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold uppercase">{b.status}</span></td>
                  <td className="p-4">${b.basePrice}</td>
                  <td className="p-4">{b.customer?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;