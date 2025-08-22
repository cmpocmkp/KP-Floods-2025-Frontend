import React from 'react'
import { cn } from '../../lib/utils'

interface LegendItem {
  label: string
  color: string
  description?: string
}

interface LegendProps {
  title: string
  items: LegendItem[]
  className?: string
}

export default function Legend({ title, items, className }: LegendProps) {
  return (
    <div className={cn('bg-white rounded-2xl p-4 shadow-sm border border-gray-100', className)}>
      <h4 className="text-sm font-semibold text-gray-900 mb-3">{title}</h4>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
              {item.description && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}