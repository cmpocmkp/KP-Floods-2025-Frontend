import React from 'react';
import MonetaryLossOverview from '../components/monetaryLoss/MonetaryLossOverview';
import { DataCoveragePeriod } from '@/components/shared/DataCoveragePeriod';

const MonetaryLossPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <DataCoveragePeriod />
      <MonetaryLossOverview />
    </div>
  );
};

export default MonetaryLossPage;