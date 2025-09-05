import React from 'react';
import CompensationPolicyOverview from '../components/compensation/CompensationPolicyOverview';
import { DataCoveragePeriod } from '@/components/shared/DataCoveragePeriod';

const CompensationPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <DataCoveragePeriod />
      <CompensationPolicyOverview />
    </div>
  );
};

export default CompensationPolicyPage; 