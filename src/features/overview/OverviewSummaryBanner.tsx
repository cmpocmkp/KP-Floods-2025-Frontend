import React from 'react';
import { format } from 'date-fns';

interface OverviewSummaryBannerProps {
  reportPeriod?: { start: string; end: string };
  lastUpdated?: string;
}

export function OverviewSummaryBanner({ reportPeriod, lastUpdated }: OverviewSummaryBannerProps) {
  const formattedPeriod = reportPeriod
    ? `${format(new Date(reportPeriod.start), 'MMM d')}–${format(new Date(reportPeriod.end), 'MMM d, yyyy')}`
    : 'Loading...';

  const formattedLastUpdated = lastUpdated
    ? format(new Date(lastUpdated), 'MMM d, yyyy h:mm a')
    : format(new Date(), 'MMM d, yyyy h:mm a');

  return (
    <div className="bg-gradient-to-r from-[#1DA1F2] via-[#3B82F6] to-[#4F46E5] text-white rounded-2xl shadow-sm p-5 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold mb-1">KPD3</h1>
          <div className="text-sm text-white/90">Report Period: {formattedPeriod}</div>
        </div>
        <div className="text-sm text-white/90">
          Last Updated: {formattedLastUpdated}
        </div>
      </div>
    </div>
  );
}