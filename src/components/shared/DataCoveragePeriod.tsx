import React from 'react';
import { Calendar } from 'lucide-react';

export function DataCoveragePeriod() {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-4">
      <Calendar className="h-4 w-4 text-blue-600" />
      <span className="font-medium text-blue-800">Data Coverage Period:</span>
      <span className="text-blue-700">August 15, 2025 - {currentDate}</span>
    </div>
  );
}
