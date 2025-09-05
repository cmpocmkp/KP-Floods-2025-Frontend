import React from 'react';
import AgricultureOverview from '../components/agriculture/AgricultureOverview';
import { DataCoveragePeriod } from '@/components/shared/DataCoveragePeriod';

const AgriculturePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <DataCoveragePeriod />
      <AgricultureOverview />
    </div>
  );
};

export default AgriculturePage;