import React, { useState } from 'react';
import { 
  BarChart3, 
  Settings, 
  Database,
  AlertTriangle,
  Construction,
  Package,
  Tent,
  DollarSign
} from 'lucide-react';
import BrandLogo from '../BrandLogo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: string;
}

// Removed XIcon component - no longer needed

const menuItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'incidents', label: 'Incident Reports', icon: AlertTriangle },
  { id: 'infrastructure', label: 'Infrastructure', icon: Construction },
  { id: 'warehouse', label: 'Warehouse', icon: Package },
  { id: 'camps', label: 'Relief Camps', icon: Tent },
  { id: 'compensation', label: 'Compensation', icon: DollarSign },
  { id: 'sources-management', label: 'Data Sources', icon: Database },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, userRole }: SidebarProps) {
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (itemId: string) => {
    if (expandedDropdown === itemId) {
      setExpandedDropdown(null);
    } else {
      setExpandedDropdown(itemId);
    }
  };

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    // Show Settings and Data Sources only to admin and super_admin users
    if (item.id === 'settings' || item.id === 'sources-management') {
      return userRole === 'admin' || userRole === 'super_admin';
    }
    return true;
  });

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col shadow-lg md:shadow-none">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col items-start space-y-2">
          <BrandLogo size="md" />
          <p className="text-xs text-gray-500">KP Floods 2025</p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2.5 sm:py-3 rounded-lg text-left transition-all duration-200 group touch-manipulation ${
                activeTab === item.id
                  ? 'bg-primary-50 text-primary-700 border border-primary-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon 
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                  activeTab === item.id ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                }`} 
              />
              <span className="font-medium text-sm sm:text-base">{item.label}</span>
              {/* {item.id === 'facebook' && (
                <span className="ml-auto bg-green-100 text-green-800 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  Live
                </span>
              )} */}
            </button>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div className="p-3 sm:p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-3 sm:p-4">
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}