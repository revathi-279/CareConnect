import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useRequestStore from '../store/requestStore';
import useQuoteStore from '../store/quoteStore';
import useBookingStore from '../store/bookingStore';
import useJobActivityStore from '../store/jobActivityStore';
import useInvoiceStore from '../store/invoiceStore';
import useReviewStore from '../store/reviewStore';
import { MapPin, Calendar, Clock, X, CheckCircle, ClipboardList, Wrench, Eye, Receipt, Star,Sparkles } from 'lucide-react';
import LiveChat from '../components/chat/LiveChat';

import useAuthStore from '../store/authStore';
const CustomerDashboard = () => {
  const { user } = useAuthStore();
  const { myRequests, fetchMyRequests, isLoading: requestsLoading } = useRequestStore();
  const { quotes, fetchQuotesForRequest, acceptQuote } = useQuoteStore();
  const { bookings, fetchMyBookings, isLoading: bookingsLoading } = useBookingStore();
const { evidence, extraWork, fetchActivity, respondToExtraWork, reportIssue } = useJobActivityStore();
  const { invoices, fetchMyInvoices, payInvoice } = useInvoiceStore();
  const { submitReview } = useReviewStore();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('requests');
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [workspaceJobId, setWorkspaceJobId] = useState(null);
  
  // Scheduling State
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Review State
  const [reviewForm, setReviewForm] = useState({ bookingId: null, rating: 5, comment: '' });

  useEffect(() => {
    fetchMyRequests();
    fetchMyBookings();
    fetchMyInvoices();
  }, [fetchMyRequests, fetchMyBookings, fetchMyInvoices]);

  const openQuotesModal = async (requestId) => { setSelectedRequestId(requestId); await fetchQuotesForRequest(requestId); };
  
  const handleAcceptQuote = async (quoteId) => {
    if (!bookingDate || !startTime || !endTime) return;
    if (await acceptQuote(quoteId, selectedRequestId, { date: bookingDate, startTime, endTime })) {
      setSelectedRequestId(null);
      setBookingDate(''); setStartTime(''); setEndTime('');
      fetchMyRequests(); fetchMyBookings(); setActiveTab('bookings'); 
    }
  };

  const openWorkspace = async (jobId) => { setWorkspaceJobId(jobId); await fetchActivity(jobId); };
  const handleWorkResponse = async (workId, status) => { if (await respondToExtraWork(workId, workspaceJobId, status)) { fetchMyBookings(); } };

  const handlePayment = async (invoiceId) => {
    if (await payInvoice(invoiceId)) {
      fetchMyInvoices();
    }
  };

  const handleReviewSubmit = async (e, bookingId) => {
    e.preventDefault();
    if (await submitReview(bookingId, reviewForm.rating, reviewForm.comment)) {
      setReviewForm({ bookingId: null, rating: 5, comment: '' }); // Reset and close
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'classified': return 'bg-secondary/20 text-secondary-hover border-secondary/30';
      case 'quoted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'booked': case 'scheduled': return 'bg-primary/20 text-primary-hover border-primary/30';
      case 'on_the_way': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'arrived': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'in_progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main">My Dashboard</h1>
          <p className="text-text-muted mt-2">Track your service requests, bookings, and billing.</p>
        </div>
        <button onClick={() => navigate('/request')} className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium shadow-sm">
          New Request
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-8 overflow-x-auto">
        <button className={`pb-3 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'requests' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-main'}`} onClick={() => setActiveTab('requests')}>
          <ClipboardList size={18} /> Open Requests
        </button>
        <button className={`pb-3 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'bookings' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-main'}`} onClick={() => setActiveTab('bookings')}>
          <Wrench size={18} /> Active Bookings
        </button>
        <button className={`pb-3 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'invoices' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-main'}`} onClick={() => setActiveTab('invoices')}>
          <Receipt size={18} /> Invoices & Reviews
        </button>
      </div>

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <>
          {requestsLoading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
          ) : myRequests.filter(r => r.status !== 'booked').length === 0 ? (
            <div className="bg-surface p-12 text-center rounded-2xl shadow-sm border border-gray-50">
              <h3 className="text-xl font-medium text-text-main mb-2">No open requests</h3>
            </div>
          ) : (
            <div className="grid gap-6">
              {myRequests.filter(r => r.status !== 'booked').map((req) => (
                <div key={req._id} className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-50 flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border mb-2 inline-block ${getStatusColor(req.status)}`}>{req.status}</span>
                   <h3 className="text-xl font-bold text-text-main mb-2">
  {req.aiInsights ? req.aiInsights.category : 'Analyzing Request...'}
</h3>
                    <p className="text-text-muted text-sm line-clamp-2 mb-4">{req.description}</p>
                    <div className="flex items-center gap-1.5 text-sm text-text-main"><MapPin size={16} className="text-primary"/> {req.address}</div>

                    {/* NEW: Capstone AI Ranking Display */}
                    {req.aiInsights && (
                      <div className="mt-4 bg-primary/5 border border-primary/20 p-4 rounded-xl">
                        <h4 className="text-sm font-bold text-primary flex items-center gap-2 mb-1">
                          <Sparkles size={16}/> AI Provider Match Complete
                        </h4>
                        <p className="text-xs text-text-muted italic bg-white p-2 rounded border border-primary/10">
                          "{req.aiInsights.reasoning}"
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="md:border-l border-gray-100 md:pl-6 flex md:flex-col justify-end gap-4">
                    {req.status === 'quoted' && (
                      <button onClick={() => openQuotesModal(req._id)} className="bg-secondary hover:bg-secondary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors w-full">View Quotes</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <>
          {bookingsLoading ? (
             <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
          ) : bookings.filter(b => b.status !== 'completed').length === 0 ? (
            <div className="bg-surface p-12 text-center rounded-2xl shadow-sm border border-gray-50">
              <h3 className="text-xl font-medium text-text-main mb-2">No active bookings</h3>
            </div>
          ) : (
            <div className="grid gap-6">
              {bookings.filter(b => b.status !== 'completed').map((booking) => (
                <div key={booking._id} className="bg-surface rounded-2xl p-6 shadow-sm border border-primary/20">
                   <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border mb-2 inline-block ${getStatusColor(booking.status)}`}>{booking.status.replace('_', ' ')}</span>
                      <h3 className="text-xl font-bold text-text-main">Job #{booking._id.slice(-6).toUpperCase()}</h3>
                    </div>
                    <div className="text-right min-w-[150px]">
                      <div className="text-2xl font-black text-primary">${booking.basePrice + (booking.additionalWorkAmount || 0)}</div>
                      <div className="text-sm text-text-muted">{booking.additionalWorkAmount > 0 ? 'Total Price' : 'Base Price'}</div>
                      
                      {['in_progress', 'completed'].includes(booking.status) && (
                        <button onClick={() => openWorkspace(booking._id)} className="mt-4 w-full flex items-center justify-center gap-2 bg-text-main hover:bg-black text-white py-2 rounded-lg text-sm font-medium transition-colors">
                          <Eye size={16} /> View Workspace
                        </button>
                      )}
                    </div>
                  </div>

                  {/* NEW DISPUTE UI */}
                  <div className="mt-4 flex justify-between items-center border-t border-gray-100 pt-4">
                    <span className="text-sm font-semibold text-primary">
                      {booking.status.replace('_', ' ').toUpperCase()}
                    </span>
                    
                    {booking.status !== 'completed' && booking.status !== 'disputed' && (
                      <button 
                        onClick={async () => {
                          const reason = window.prompt("Please describe the issue with this service:");
                          if (reason) {
                            const success = await reportIssue(booking._id, reason);
                            if (success) {
                              window.location.reload(); 
                            }
                          }
                        }}
                        className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
                      >
                        Report Issue
                      </button>
                    )}

                    {booking.status === 'disputed' && (
                      <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-lg">
                        UNDER ADMIN REVIEW
                      </span>
                    )}
                  </div>
                  {/* END NEW DISPUTE UI */}

                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* NEW: Invoices & Reviews Tab */}
      {activeTab === 'invoices' && (
        <div className="grid gap-6">
          {invoices.length === 0 ? (
            <div className="bg-surface p-12 text-center rounded-2xl shadow-sm border border-gray-50">
              <h3 className="text-xl font-medium text-text-main mb-2">No invoices yet</h3>
              <p className="text-text-muted">Invoices will appear here once a job is completed.</p>
            </div>
          ) : (
            invoices.map((invoice) => (
              <div key={invoice._id} className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-50 flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {invoice.status}
                    </span>
                    <span className="text-xs text-text-muted">Invoice Date: {new Date(invoice.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-main mb-1">Provider: {invoice.provider?.name}</h3>
                  <div className="text-sm text-text-muted mb-4">Job #{invoice.booking.slice(-6).toUpperCase()}</div>
                  
                  <div className="bg-background rounded-xl p-4 border border-gray-100 w-full max-w-sm">
                    <div className="flex justify-between mb-2"><span className="text-text-muted text-sm">Base Amount</span> <span className="font-medium">${invoice.baseAmount}</span></div>
                    <div className="flex justify-between mb-3"><span className="text-text-muted text-sm">Additional Work</span> <span className="font-medium">${invoice.additionalAmount}</span></div>
                    <div className="flex justify-between pt-3 border-t border-gray-200"><span className="font-bold">Total Due</span> <span className="font-black text-primary text-lg">${invoice.totalAmount}</span></div>
                  </div>
                </div>

                <div className="md:border-l border-gray-100 md:pl-6 flex flex-col justify-center gap-4 min-w-[250px]">
                  {invoice.status === 'unpaid' ? (
                    <button onClick={() => handlePayment(invoice._id)} className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-bold transition-colors shadow-sm">
                      Pay ${invoice.totalAmount} Now
                    </button>
                  ) : (
                    <>
                      <div className="text-center text-green-600 font-medium flex items-center justify-center gap-1 bg-green-50 py-2 rounded-lg"><CheckCircle size={18}/> Paid in Full</div>
                      
                      {reviewForm.bookingId !== invoice.booking ? (
                        <button onClick={() => setReviewForm({ bookingId: invoice.booking, rating: 5, comment: '' })} className="text-secondary hover:text-secondary-hover font-medium flex items-center justify-center gap-1 transition-colors">
                          <Star size={18} /> Leave a Review
                        </button>
                      ) : (
                        <form onSubmit={(e) => handleReviewSubmit(e, invoice.booking)} className="bg-background p-3 rounded-lg border border-gray-200">
                          <label className="block text-xs font-bold mb-1 text-text-main">Rating (1-5)</label>
                          <input type="number" min="1" max="5" required value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: e.target.value})} className="w-full p-2 text-sm border rounded mb-2" />
                          <textarea required placeholder="How was the service?" value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} rows="2" className="w-full p-2 text-sm border rounded mb-2"></textarea>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => setReviewForm({ bookingId: null, rating: 5, comment: '' })} className="flex-1 text-xs text-text-muted py-2">Cancel</button>
                            <button type="submit" className="flex-1 bg-secondary text-white text-xs font-bold py-2 rounded">Submit</button>
                          </div>
                        </form>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Quotes Modal (Unchanged from Phase 6) */}
      {selectedRequestId && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
         <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
           <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-surface">
             <h2 className="text-xl font-bold text-text-main">Available Quotes</h2>
             <button onClick={() => setSelectedRequestId(null)} className="text-gray-400 hover:text-text-main"><X size={24} /></button>
           </div>
           
           <div className="p-6 overflow-y-auto bg-background flex-1">
             {quotes.length === 0 ? (
               <p className="text-center text-text-muted py-8">Loading quotes...</p>
             ) : (
               <div className="grid gap-4">
                 {quotes.map(quote => (
                   <div key={quote._id} className="bg-surface p-5 rounded-xl border border-gray-200 shadow-sm">
                     <div className="flex justify-between items-start mb-3">
                       <div>
                         <h4 className="font-bold text-lg text-text-main">{quote.provider?.name || 'A Provider'}</h4>
                         <div className="text-xs text-text-muted flex items-center gap-1 mt-1">
                           <Clock size={14} /> Est. {quote.estimatedDuration} mins
                         </div>
                       </div>
                       <div className="text-2xl font-black text-primary">${quote.price}</div>
                     </div>
                     <p className="text-text-muted text-sm bg-background p-3 rounded-lg mb-4 italic">"{quote.message}"</p>

                     {/* NEW: Scheduling Inputs */}
                      <div className="bg-primary/5 p-3 rounded-lg mb-4 border border-primary/10">
                        <label className="block text-xs font-bold text-text-main mb-2">Schedule this job:</label>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <span className="text-[10px] text-text-muted uppercase font-bold">Date</span>
                            <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full text-sm p-1.5 border border-gray-200 rounded focus:ring-1 focus:ring-primary outline-none bg-white text-text-main" />
                          </div>
                          <div>
                            <span className="text-[10px] text-text-muted uppercase font-bold">Start</span>
                            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full text-sm p-1.5 border border-gray-200 rounded focus:ring-1 focus:ring-primary outline-none bg-white text-text-main" />
                          </div>
                          <div>
                            <span className="text-[10px] text-text-muted uppercase font-bold">End</span>
                            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full text-sm p-1.5 border border-gray-200 rounded focus:ring-1 focus:ring-primary outline-none bg-white text-text-main" />
                          </div>
                        </div>
                      </div>
                     
                     <button onClick={() => handleAcceptQuote(quote._id)} className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-hover text-white py-2.5 rounded-lg font-medium transition-colors">
                       <CheckCircle size={18} /> Accept Quote
                     </button>
                   </div>
                 ))}
               </div>
             )}
           </div>
         </div>
       </div>
      )}

      {/* Customer Workspace Modal */}
      {workspaceJobId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-surface">
              <h2 className="text-xl font-bold text-text-main">Job Workspace</h2>
              <button onClick={() => setWorkspaceJobId(null)} className="text-gray-400 hover:text-text-main"><X size={24} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-background flex-1 grid md:grid-cols-2 gap-8">
              
              {/* Evidence Section */}
              <div>
                <h3 className="font-bold text-lg mb-4 text-text-main">Provider Evidence</h3>
                {evidence.length === 0 ? <p className="text-sm text-text-muted">No evidence uploaded yet.</p> : (
                  <div className="space-y-4">
                    {evidence.map(ev => (
                      <div key={ev._id} className="bg-surface p-3 rounded-lg shadow-sm border border-gray-100">
                        <span className="text-[10px] font-bold uppercase text-secondary bg-secondary/10 px-2 py-0.5 rounded mb-2 inline-block">{ev.type}</span>
                        <img src={ev.imageUrl} alt="evidence" className="w-full h-48 object-cover rounded bg-gray-100 mb-2" onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Broken+Link'; }} />
                        <p className="text-sm text-text-main">{ev.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Scope Changes Section */}
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-text-main">Scope Changes</h3>
                {extraWork.length === 0 ? <p className="text-sm text-text-muted">No scope changes requested.</p> : (
                  <div className="space-y-4">
                    {extraWork.map(work => (
                      <div key={work._id} className={`p-4 rounded-xl shadow-sm border ${work.status === 'pending' ? 'bg-yellow-50 border-yellow-200' : work.status === 'approved' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-text-main">{work.description}</span>
                          <span className="font-black text-primary text-lg">+${work.additionalPrice}</span>
                        </div>
                        <p className="text-sm text-text-muted mb-4 bg-white/50 p-2 rounded">"{work.reason}"</p>
                        
                        {work.status === 'pending' ? (
                          <div className="flex gap-2">
                            <button onClick={() => handleWorkResponse(work._id, 'approved')} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-bold transition-colors">Approve</button>
                            <button onClick={() => handleWorkResponse(work._id, 'rejected')} className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg text-sm font-bold transition-colors">Reject</button>
                          </div>
                        ) : (
                          <span className="text-xs font-bold uppercase text-text-muted">Status: {work.status}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-2 mt-4 pt-6 border-t border-gray-100">
                <h3 className="font-bold text-lg mb-4 text-text-main">Direct Message</h3>
                {/* Find the specific booking object to pass its chat history */}
                <LiveChat 
                  bookingId={workspaceJobId} 
                  currentUser={user} // Pass your actual authenticated user object here
                  initialChatHistory={bookings.find(b => b._id === workspaceJobId)?.chatHistory || []}
                />
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;