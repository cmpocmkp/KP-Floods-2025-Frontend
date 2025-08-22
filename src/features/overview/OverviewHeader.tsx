import React from 'react';
import { format } from 'date-fns';

interface OverviewHeaderProps {
  reportPeriod?: { start: string; end: string };
  lastUpdated?: string;
}

export function OverviewHeader({ reportPeriod, lastUpdated }: OverviewHeaderProps) {
  const formattedPeriod = reportPeriod
    ? `${format(new Date(reportPeriod.start), 'MMM d')}–${format(new Date(reportPeriod.end), 'MMM d, yyyy')}`
    : 'Loading...';

  const formattedLastUpdated = lastUpdated
    ? format(new Date(lastUpdated), 'MMM d, yyyy h:mm a')
    : format(new Date(), 'MMM d, yyyy h:mm a');

  return (
    <div className="bg-gradient-to-r from-[#1DA1F2] via-[#3B82F6] to-[#4F46E5] text-white px-4 md:px-6 py-4">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-xl font-semibold mb-2">KP Floods 2025</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="text-sm opacity-90">
            <span className="text-white/75">Report Period:</span> {formattedPeriod}
          </div>
          <div className="text-sm opacity-90">
            <span className="text-white/75">Last Updated:</span> {formattedLastUpdated}
          </div>
        </div>
      </div>
    </div>
  );
}