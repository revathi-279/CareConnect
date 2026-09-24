import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ServiceGrid from '../components/ServiceGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        if (res.data?.success) {
          setServices(res.data.data);
        }
      } catch (err) {
        setError(err.message || 'Unable to load services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#1F2937]">Home Care & Repair Directory</h1>
        <p className="text-gray-600 mt-2">
          Browse verified residential maintenance, plumbing, electrical, and cleaning services.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Retrieving service catalog..." />
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-center text-sm">{error}</div>
      ) : (
        <ServiceGrid services={services} />
      )}
    </div>
  );
};

export default Services;