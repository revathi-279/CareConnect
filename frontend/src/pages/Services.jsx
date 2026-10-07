import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Wrench, Clock, ArrowRight } from 'lucide-react';
import useServiceStore from '../store/serviceStore';

const Services = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const navigate = useNavigate();
  
  const { services, fetchServices, isLoading } = useServiceStore();

  useEffect(() => {
    fetchServices(categoryId);
  }, [categoryId, fetchServices]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main">Our Services</h1>
        <p className="text-text-muted mt-2">Find the right professional for your home needs.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-surface p-12 text-center rounded-2xl shadow-sm border border-gray-50">
          <h3 className="text-xl font-medium text-text-main mb-2">No services found</h3>
          <p className="text-text-muted">We couldn't find any services matching your criteria.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service._id} className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-50 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="mb-4 flex-grow">
                <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full mb-3">
                  {service.category?.name || 'General'}
                </span>
                <h3 className="text-xl font-bold text-text-main mb-2">{service.name}</h3>
                <p className="text-text-muted text-sm line-clamp-3">{service.description}</p>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mt-auto">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center text-text-main font-semibold">
                    <span className="text-2xl">${service.basePrice}</span>
                    {service.pricingModel === 'hourly' && <span className="text-sm text-text-muted font-normal ml-1">/hr</span>}
                  </div>
                  <div className="flex items-center text-text-muted text-sm">
                    <Clock size={16} className="mr-1" />
                    ~{service.estimatedDuration} mins
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate('/request')} // We will build this in Phase 4!
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-lg font-medium transition-colors"
                >
                  Request Service <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;