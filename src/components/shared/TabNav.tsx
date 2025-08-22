import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Tab {
  id: string
  label: string
  icon: LucideIcon
  count?: number
}

interface TabNavProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

export default function TabNav({ tabs, activeTab, onTabChange, className }: TabNavProps) {
  return (
    <div className={cn('border-b border-gray-200 bg-white', className)}>
      <nav className="flex space-x-8 px-6" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'group inline-flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                isActive
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={cn(
                'w-4 h-4 transition-colors duration-200',
                isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
              )} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={cn(
                  'ml-2 py-0.5 px-2 rounded-full text-xs font-medium',
                  isActive
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}