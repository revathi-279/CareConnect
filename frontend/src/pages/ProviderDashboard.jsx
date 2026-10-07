import { useState, useEffect } from 'react';
import useInvoiceStore from '../store/invoiceStore';
import useProviderStore from '../store/providerStore';
import useServiceStore from '../store/serviceStore';
import useRequestStore from '../store/requestStore';
import useQuoteStore from '../store/quoteStore';
import useBookingStore from '../store/bookingStore';
import LiveChat from '../components/chat/LiveChat';
import useAuthStore from '../store/authStore';
// Add useJobActivityStore to your imports
import useJobActivityStore from '../store/jobActivityStore';
import { User, Calendar, MapPin, Trash2, Briefcase, Navigation, Play, CheckCircle, Camera, PlusCircle, X } from 'lucide-react';
const ProviderDashboard = () => {
  const { profile, availability, fetchMyProfile, updateProfile, fetchMyAvailability, addAvailability, deleteAvailability } = useProviderStore();
  const { user } = useAuthStore();
  const { fetchCategories } = useServiceStore();
  const { fetchOpenRequests } = useRequestStore();
  const { submitQuote } = useQuoteStore();
  const { bookings, fetchMyBookings, updateJobStatus } = useBookingStore();
  const { generateInvoice } = useInvoiceStore();
  
  // NEW: Job Activity State
  const { evidence, extraWork, fetchActivity, addEvidence, requestExtraWork } = useJobActivityStore();
  const [workspaceJobId, setWorkspaceJobId] = useState(null);
  
  // Evidence Form
  const [imgUrl, setImgUrl] = useState('');
  const [imgType, setImgType] = useState('during');
  const [imgDesc, setImgDesc] = useState('');
  
  // Extra Work Form
  const [extraDesc, setExtraDesc] = useState('');
  const [extraReason, setExtraReason] = useState('');
  const [extraPrice, setExtraPrice] = useState('');
  
  const [activeTab, setActiveTab] = useState('active'); // Default to active jobs
  const [openJobs, setOpenJobs] = useState([]);
  const [quotingJobId, setQuotingJobId] = useState(null);
  
  // Forms State
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState(0);
  const [serviceAreas, setServiceAreas] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteTime, setQuoteTime] = useState('');
  const [quoteMessage, setQuoteMessage] = useState('');

  useEffect(() => {
    fetchMyProfile();
    fetchMyAvailability();
    fetchCategories();
    fetchMyBookings();
    loadOpenJobs();
  }, []);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '');
      setExperience(profile.experienceYears || 0);
      setServiceAreas(profile.serviceAreas ? profile.serviceAreas.join(', ') : '');
    }
  }, [profile]);

  const handleGenerateInvoice = async (bookingId) => {
    if (await generateInvoice(bookingId)) {
      fetchMyBookings(); // Refresh the list to see the job move to 'completed'
    }
  };

  const loadOpenJobs = async () => {
    const jobs = await fetchOpenRequests();
    setOpenJobs(jobs);
  };

  const handleProfileSubmit = async (e) => { e.preventDefault(); await updateProfile({ bio, experienceYears: Number(experience), serviceAreas: serviceAreas.split(',').map(a => a.trim()).filter(a => a) }); };
  const handleAvailabilitySubmit = async (e) => { e.preventDefault(); if (await addAvailability({ date, startTime, endTime })) { setStartTime(''); setEndTime(''); } };
  
  const handleQuoteSubmit = async (e, requestId) => {
    e.preventDefault();
    if (await submitQuote({ requestId, price: Number(quotePrice), estimatedDuration: Number(quoteTime), message: quoteMessage, validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })) {
      setQuotingJobId(null);
      loadOpenJobs();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on_the_way': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'arrived': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'in_progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const openWorkspace = async (jobId) => {
    setWorkspaceJobId(jobId);
    await fetchActivity(jobId);
  };

  const handleAddEvidence = async (e) => {
    e.preventDefault();
    if (await addEvidence({ bookingId: workspaceJobId, imageUrl: imgUrl, type: imgType, description: imgDesc })) {
      setImgUrl(''); setImgDesc('');
    }
  };

  const handleAddExtraWork = async (e) => {
    e.preventDefault();
    if (await requestExtraWork({ bookingId: workspaceJobId, description: extraDesc, reason: extraReason, additionalPrice: Number(extraPrice) })) {
      setExtraDesc(''); setExtraReason(''); setExtraPrice('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">Provider Hub</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-8 overflow-x-auto">
        <button className={`pb-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'active' ? 'text-primary border-b-2 border-primary' : 'text-text-muted'}`} onClick={() => setActiveTab('active')}>
           Active Bookings
        </button>
        <button className={`pb-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'jobs' ? 'text-primary border-b-2 border-primary' : 'text-text-muted'}`} onClick={() => setActiveTab('jobs')}>
          <Briefcase size={18} /> Job Board
        </button>
        <button className={`pb-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'profile' ? 'text-primary border-b-2 border-primary' : 'text-text-muted'}`} onClick={() => setActiveTab('profile')}>
          <User size={18} /> Profile Settings
        </button>
        <button className={`pb-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'schedule' ? 'text-primary border-b-2 border-primary' : 'text-text-muted'}`} onClick={() => setActiveTab('schedule')}>
          <Calendar size={18} /> Availability
        </button>
      </div>

      {/* NEW: Active Bookings Tab */}
      {activeTab === 'active' && (
        <div>
          <h2 className="text-xl font-bold text-text-main mb-4">Your Assigned Jobs</h2>
          {bookings.length === 0 ? (
             <p className="text-text-muted bg-surface p-8 rounded-xl border border-gray-100 text-center">You have no active bookings.</p>
          ) : (
            <div className="grid gap-6">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-50 flex flex-col md:flex-row justify-between gap-6">
                  
                  <div className="flex-1">
                    <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border inline-block mb-3 ${getStatusColor(booking.status)}`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                    <h3 className="text-xl font-bold text-text-main mb-1">Booking #{booking._id.slice(-6).toUpperCase()}</h3>
                    <div className="flex items-center gap-1.5 text-text-main font-medium mb-4">
                      <MapPin size={16} className="text-primary"/> {booking.address}
                    </div>
                    
                    <div className="bg-background rounded-xl p-4 border border-gray-100">
                      <div className="text-sm font-bold text-text-muted uppercase mb-1">Customer Details</div>
                      <div className="text-text-main font-medium">{booking.customer?.name}</div>
                      <div className="text-text-muted text-sm">{booking.customer?.email}</div>
                    </div>
                  </div>

                  {/* Job State Machine Buttons */}
                  <div className="md:border-l border-gray-100 md:pl-6 flex flex-col justify-center gap-3 min-w-[200px]">
                    <div className="text-center mb-2">
                      <div className="text-xs text-text-muted uppercase font-bold">Total Payout</div>
                      <div className="text-2xl font-black text-primary">${booking.basePrice}</div>
                    </div>

                    {booking.status === 'scheduled' && (
                      <button onClick={() => updateJobStatus(booking._id, 'on_the_way')} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors shadow-sm">
                        <Navigation size={18} /> Start Travel
                      </button>
                    )}
                    {booking.status === 'on_the_way' && (
                      <button onClick={() => updateJobStatus(booking._id, 'arrived')} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition-colors shadow-sm">
                        <MapPin size={18} /> I Have Arrived
                      </button>
                    )}
                    {booking.status === 'arrived' && (
                      <button onClick={() => updateJobStatus(booking._id, 'in_progress')} className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium transition-colors shadow-sm">
                        <Play size={18} /> Start Work
                      </button>
                    )}
                    {/* Add this button right above the "Job is currently in progress" div */}
                    {booking.status === 'in_progress' && (
                      <>
                        <button onClick={() => openWorkspace(booking._id)} className="w-full flex items-center justify-center gap-2 bg-text-main hover:bg-black text-white py-2.5 rounded-lg font-medium transition-colors shadow-sm mb-2">
                          <Camera size={18} /> Open Workspace
                        </button>
                        <button onClick={() => handleGenerateInvoice(booking._id)} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition-colors shadow-sm">
                          <CheckCircle size={18} /> Complete & Invoice
                        </button>
                      </>
                    )}
                    {booking.status === 'completed' && (
                      <div className="text-center text-sm font-medium text-green-600 bg-green-50 py-2 rounded-lg border border-green-100 flex items-center justify-center gap-1">
                        <CheckCircle size={16} /> Job Completed
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

     {/* Job Board Tab */}
      {activeTab === 'jobs' && (
        <div>
          <h2 className="text-xl font-bold text-text-main mb-4">Open Requests</h2>
          {openJobs.length === 0 ? (
            <p className="text-text-muted bg-surface p-8 rounded-xl border border-gray-100 text-center">No open jobs available right now.</p>
          ) : (
            <div className="grid gap-6">
              {openJobs.map((job) => (
                <div key={job._id} className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="bg-secondary/10 text-secondary-hover text-xs font-bold px-2 py-1 rounded uppercase tracking-wide mb-2 inline-block">
                        {job.category?.name || 'Service'}
                      </span>
                      <h3 className="text-lg font-bold text-text-main">{job.description}</h3>
                    </div>
                    <span className="text-sm font-medium text-text-muted">{job.preferredDate || 'ASAP'}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-text-muted mb-6">
                    <span className="flex items-center gap-1"><MapPin size={16} className="text-primary"/> {job.address}</span>
                  </div>

                  {/* Toggle Quote Form */}
                  {quotingJobId === job._id ? (
                    <form onSubmit={(e) => handleQuoteSubmit(e, job._id)} className="bg-background p-4 rounded-xl border border-gray-200 mt-4">
                      <h4 className="font-semibold text-text-main mb-3">Submit your Quote</h4>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs text-text-muted mb-1">Price ($)</label>
                          <input type="number" required value={quotePrice} onChange={e => setQuotePrice(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-xs text-text-muted mb-1">Est. Time (mins)</label>
                          <input type="number" required value={quoteTime} onChange={e => setQuoteTime(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-xs text-text-muted mb-1">Message to Customer</label>
                        <textarea required value={quoteMessage} onChange={e => setQuoteMessage(e.target.value)} rows="2" className="w-full px-3 py-2 border rounded-lg"></textarea>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => setQuotingJobId(null)} className="px-4 py-2 text-text-muted hover:text-text-main">Cancel</button>
                        <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-medium">Send Quote</button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex justify-end">
                      <button 
                        onClick={() => { setQuotingJobId(job._id); setQuotePrice(''); setQuoteTime(''); setQuoteMessage(''); }}
                        className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Write Quote
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Settings Tab */}
      {activeTab === 'profile' && (
        <div className="bg-surface p-8 rounded-2xl shadow-sm border border-gray-50 max-w-3xl">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">Professional Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows="4" className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Years of Experience</label>
                <input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Service Areas</label>
                <input type="text" value={serviceAreas} onChange={(e) => setServiceAreas(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
              </div>
            </div>
            <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-medium">Save Profile</button>
          </form>
        </div>
      )}

      {/* Availability Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-surface p-6 rounded-2xl border border-gray-50">
            <h3 className="font-bold mb-4">Add Time Block</h3>
            <form onSubmit={handleAvailabilitySubmit} className="space-y-4">
              <input type="date" required value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2 border rounded-lg" />
              <div className="flex gap-2">
                <input type="time" required value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                <input type="time" required value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <button type="submit" className="w-full bg-secondary text-white py-2 rounded-lg">Add</button>
            </form>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-bold mb-4">Your Schedule</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {availability.map((block) => (
                <div key={block._id} className="bg-surface p-4 rounded-xl border flex justify-between items-center group">
                  <div><div className="font-semibold">{block.date}</div><div className="text-sm text-primary">{block.startTime} - {block.endTime}</div></div>
                  <button onClick={() => deleteAvailability(block._id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Provider Workspace Modal */}
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
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Camera size={20} className="text-primary"/> Evidence</h3>
                <form onSubmit={handleAddEvidence} className="bg-surface p-4 rounded-xl shadow-sm border border-gray-200 mb-6 space-y-3">
                  <label className="block text-xs font-semibold text-text-muted">Select Image</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    required 
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const uploadedUrl = await useJobActivityStore.getState().uploadImage(file);
                        if (uploadedUrl) setImgUrl(uploadedUrl);
                      }
                    }} 
                    className="w-full text-xs text-text-muted file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" 
                  />
                  {imgUrl && (
                    <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 p-2 rounded">
                      <span>✓ Image uploaded to Cloudinary</span>
                    </div>
                  )}
                  <select value={imgType} onChange={e => setImgType(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-white">
                    <option value="before">Before Fix</option>
                    <option value="during">During Fix</option>
                    <option value="after">After Fix</option>
                  </select>
                  <input type="text" placeholder="Note (optional)" value={imgDesc} onChange={e => setImgDesc(e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
                  <button 
                    type="submit" 
                    disabled={!imgUrl || useJobActivityStore.getState().isUploading} 
                    className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {useJobActivityStore.getState().isUploading ? 'Uploading...' : 'Save Evidence to Job'}
                  </button>
                </form>
                
                <div className="space-y-3">
                  {evidence.map(ev => (
                    <div key={ev._id} className="bg-surface p-3 rounded-lg border border-gray-100 flex gap-3">
                      <img src={ev.imageUrl} alt="evidence" className="w-20 h-20 object-cover rounded bg-gray-100" onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Error'; }} />
                      <div>
                        <span className="text-[10px] font-bold uppercase text-secondary bg-secondary/10 px-2 py-0.5 rounded">{ev.type}</span>
                        <p className="text-sm mt-1 text-text-main">{ev.description || 'No notes.'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scope Changes Section */}
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><PlusCircle size={20} className="text-secondary"/> Scope Changes</h3>
                <form onSubmit={handleAddExtraWork} className="bg-surface p-4 rounded-xl shadow-sm border border-gray-200 mb-6 space-y-3">
                  <input type="text" required placeholder="What needs doing? (e.g., New Pipe)" value={extraDesc} onChange={e => setExtraDesc(e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
                  <input type="text" required placeholder="Reason for change" value={extraReason} onChange={e => setExtraReason(e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
                  <input type="number" required placeholder="Additional Cost ($)" value={extraPrice} onChange={e => setExtraPrice(e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
                  <button type="submit" className="w-full bg-secondary text-white py-2 rounded-lg text-sm font-medium">Request Approval</button>
                </form>

                <div className="space-y-3">
                  {extraWork.map(work => (
                    <div key={work._id} className={`p-3 rounded-lg border ${work.status === 'pending' ? 'bg-yellow-50 border-yellow-200' : work.status === 'approved' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-sm">{work.description}</span>
                        <span className="font-bold text-primary">+${work.additionalPrice}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase mt-2 block opacity-70">Status: {work.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 mt-4 pt-6 border-t border-gray-100">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-text-main">Direct Message</h3>
                <LiveChat 
                  bookingId={workspaceJobId} 
                  currentUser={user} 
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

export default ProviderDashboard;