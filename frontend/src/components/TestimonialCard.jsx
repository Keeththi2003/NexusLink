import React from 'react';
import './TestimonialCard.css';

const TestimonialCard = ({ image, name, job, opinion }) => {
  return (
    <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-secondary-200 dark:border-secondary-700 group hover:-translate-y-1">
      <div className="flex items-center mb-4">
        <img 
          src={image} 
          alt={name} 
          className="w-12 h-12 rounded-full object-cover border-2 border-primary-200 dark:border-primary-700 group-hover:border-primary-400 dark:group-hover:border-primary-500 transition-colors duration-200"
        />
        <div className="ml-3">
          <h4 className="font-semibold text-secondary-900 dark:text-white">{name}</h4>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">{job}</p>
        </div>
      </div>
      <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed italic">
        "{opinion}"
      </p>
    </div>
  );
};

export default TestimonialCard;