import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TopTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'incidents', label: 'Incident Reports' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'warehouse', label: 'Warehouse' },
  { id: 'camps', label: 'Relief' },
  { id: 'compensation', label: 'Compensation' }
];

export function TopTabs({ activeTab, onTabChange }: TopTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="h-14 w-full justify-start bg-transparent gap-2 overflow-x-auto">
        {tabs.map(tab => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 h-14"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}