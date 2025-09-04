import { TabsBar } from './TabsBar';
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
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'incidents', label: 'Incident Reports' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'livestock', label: 'Livestock' },
  { id: 'agriculture', label: 'Agriculture' },
  { id: 'warehouse', label: 'Warehouse' },
  { id: 'camps', label: 'Relief' },
  { id: 'analyze', label: 'Analyze' },
  { id: 'visualize', label: 'Visualize' },
  { id: 'monetary-loss', label: 'Monetary Loss' },
  { id: 'economic-loss', label: 'Economic Loss' },
  { id: 'compensation-policy', label: 'Compensation' },
  { id: 'brief', label: 'Flood Assistant' },
];

export function AppHeader({
  activeTab,
  onTabChange,
  userRole,
  onLogout,
  userName,
}: AppHeaderProps) {
  return (
    <div className="relative">
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-2">
      </div>

      <TabsBar
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      
      {/* User Menu - Aligned with content container */}
      <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{userName}</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 rounded-lg">
              <MoreHorizontal className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
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
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}