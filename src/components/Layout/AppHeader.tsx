import React from 'react';
import { format } from 'date-fns';
import { TopTabs } from './TopTabs';
import { KpiRow } from '../../features/overview/KpiRow';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppHeaderProps {
  reportPeriod?: { start: string; end: string };
  lastUpdated?: string;
  onTabChange: (tab: string) => void;
  activeTab: string;
  userRole?: string;
  onLogout: () => void;
  userName?: string;
}

export function AppHeader({
  reportPeriod,
  lastUpdated,
  onTabChange,
  activeTab,
  userRole,
  onLogout,
  userName
}: AppHeaderProps) {
  const formattedPeriod = reportPeriod
    ? `${format(new Date(reportPeriod.start), 'MMM d')}–${format(new Date(reportPeriod.end), 'MMM d, yyyy')}`
    : 'Loading...';

  const formattedLastUpdated = lastUpdated
    ? format(new Date(lastUpdated), 'MMM d, yyyy h:mm a')
    : format(new Date(), 'MMM d, yyyy h:mm a');

  return (
    <div className="w-full">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-500 text-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">KP Floods 2025</h1>
            
            <div className="flex items-center space-x-6">
              <div className="hidden md:block">
                <div className="text-sm opacity-90">Report Period</div>
                <div className="font-medium">{formattedPeriod}</div>
              </div>
              
              <div className="hidden md:block">
                <div className="text-sm opacity-90">Last Updated</div>
                <div className="font-medium">{formattedLastUpdated}</div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm">{userName}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreHorizontal className="h-5 w-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {(userRole === 'admin' || userRole === 'super_admin') && (
                      <>
                        <DropdownMenuItem onSelect={() => onTabChange('sources-management')}>
                          Data Sources
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onTabChange('settings')}>
                          Settings
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onSelect={onLogout} className="text-red-600">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
          <KpiRow />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <TopTabs activeTab={activeTab} onTabChange={onTabChange} />
        </div>
      </div>
    </div>
  );
}