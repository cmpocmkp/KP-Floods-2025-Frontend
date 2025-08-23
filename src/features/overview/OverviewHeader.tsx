import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface OverviewHeaderProps {
  reportPeriod?: { start: string; end: string };
  lastUpdated?: string;
}

export function OverviewHeader({ reportPeriod, lastUpdated }: OverviewHeaderProps) {
  const nav = useNavigate();
  const { logout } = useAuth();
  const formattedPeriod = reportPeriod
    ? `${format(new Date(reportPeriod.start), 'MMM d')}–${format(new Date(reportPeriod.end), 'MMM d, yyyy')}`
    : 'Loading...';

  const formattedLastUpdated = lastUpdated
    ? format(new Date(lastUpdated), 'MMM d, yyyy h:mm a')
    : format(new Date(), 'MMM d, yyyy h:mm a');

  return (
    <div className="bg-gradient-to-r from-[#1DA1F2] via-[#3B82F6] to-[#4F46E5] text-white px-4 md:px-6 py-4">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-2xl font-bold mb-2">KP Floods 2025</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="text-base font-medium">
            <span className="text-white/90 font-normal">Report Period:</span>{' '}
            <span className="text-white">{formattedPeriod}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-base font-medium">
              <span className="text-white/90 font-normal">Last Updated:</span>{' '}
              <span className="text-white">{formattedLastUpdated}</span>
            </div>
            <Button 
              variant="destructive"
              size="sm"
              onClick={() => {
                logout();
                nav('/login', { replace: true });
              }}
              className="ml-4"
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}