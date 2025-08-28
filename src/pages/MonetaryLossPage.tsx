import React from 'react';
import MonetaryLossOverview from '../components/monetaryLoss/MonetaryLossOverview';

const MonetaryLossPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <MonetaryLossOverview />
    </div>
  );
};

export default MonetaryLossPage;