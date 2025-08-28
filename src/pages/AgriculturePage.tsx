import React from 'react';
import AgricultureOverview from '../components/agriculture/AgricultureOverview';

const AgriculturePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <AgricultureOverview />
    </div>
  );
};

export default AgriculturePage;