import React from 'react';
import { TopTabs } from './TopTabs';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole?: string;
  onLogout: () => void;
  userName?: string;
  reportPeriod?: { start: string; end: string };
  lastUpdated?: string;
}

export function AppHeader({
  activeTab,
  onTabChange,
  userRole,
  onLogout,
  userName,
  reportPeriod,
  lastUpdated
}: AppHeaderProps) {
  return (
    <div className="w-full">
      {/* Top Navigation */}
      <div className="w-full bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex items-center justify-between">
          <TopTabs activeTab={activeTab} onTabChange={onTabChange} />
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{userName}</span>
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
  );
}