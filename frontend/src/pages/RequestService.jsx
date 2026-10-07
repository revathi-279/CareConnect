import { useState ,useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import useRequestStore from '../store/requestStore';
import { Sparkles, Loader2 } from 'lucide-react';

const RequestService = () => {
  const [formData, setFormData] = useState({
    description: '',
    address: '',
    preferredDate: '',
    preferredTime: 'Morning',
    urgency: 'medium'
  });

  const autoCompleteRef = useRef(null);
  const inputRef = useRef(null);
  
  const createRequest = useRequestStore((state) => state.createRequest);
  const isLoading = useRequestStore((state) => state.isLoading);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.google && window.google.maps) {
      autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ['geocode'] } 
      );

      autoCompleteRef.current.addListener('place_changed', async () => {
        const place = await autoCompleteRef.current.getPlace();
        if (place.formatted_address) {
          // Update the React state instantly when a user clicks a dropdown option
          setFormData(prev => ({ ...prev, address: place.formatted_address }));
        }
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await createRequest(formData);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-surface p-8 rounded-2xl shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <h1 className="text-2xl font-bold text-text-main">Request a Service</h1>
        </div>
        <p className="text-text-muted mb-8">
          Describe the problem in plain terms. Our automated AI parser classifies the service and routes it to suitable providers.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">Issue Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
              placeholder="e.g., The tap in the kitchen sink is leaking heavily under the counter."
            ></textarea>
          </div>

          <div>
      <label className="block text-sm font-medium text-text-main mb-2">Service Address</label>
      <input
        type="text"
        name="address"
        ref={inputRef} 
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        required
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        placeholder="Start typing your address..."
      />
    </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">Preferred Date</label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-text-main"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">Preferred Window</label>
              <select
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-white"
              >
                <option value="Morning">Morning (8AM - 12PM)</option>
                <option value="Afternoon">Afternoon (12PM - 4PM)</option>
                <option value="Evening">Evening (4PM - 8PM)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">Urgency Level</label>
            <div className="flex gap-4">
              {['low', 'medium', 'high', 'emergency'].map((level) => (
                <label key={level} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="urgency"
                    value={level}
                    checked={formData.urgency === level}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-text-main capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>

          

          

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold text-lg transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Analyzing Issue & Routing...
              </>
            ) : (
              'Submit Request'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestService;