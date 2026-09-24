import React from 'react';
import ServiceCard from './ServiceCard';

const ServiceGrid = ({ services = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {services.map((service) => (
        <ServiceCard key={service._id} service={service} />
      ))}
    </div>
  );
};

export default ServiceGrid;