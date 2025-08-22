import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn, formatNumber, calculatePercentage } from '../../lib/utils'

interface KpiCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  color: 'red' | 'orange' | 'blue' | 'green'
  subtitle?: string
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  showPercentage?: boolean
  total?: number
}

const colorClasses = {
  red: {
    icon: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-100'
  },
  orange: {
    icon: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-100'
  },
  blue: {
    icon: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100'
  },
  green: {
    icon: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-100'
  }
}

export default function KpiCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
  trend,
  showPercentage = false,
  total
}: KpiCardProps) {
  const colors = colorClasses[color]
  
  const percentage = showPercentage && total && typeof value === 'number' 
    ? calculatePercentage(value, total) 
    : null

  return (
    <div className={cn(
      'bg-white rounded-2xl p-6 shadow-sm border',
      colors.border,
      'hover:shadow-md transition-shadow duration-200'
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className={cn(
              'p-2 rounded-xl',
              colors.bg
            )}>
              <Icon className={cn('w-6 h-6', colors.icon)} />
            </div>
          </div>
          
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </h3>
          
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-gray-900">
              {typeof value === 'number' ? formatNumber(value) : value}
            </p>
            
            {percentage !== null && (
              <span className="text-sm font-medium text-gray-500">
                ({percentage}%)
              </span>
            )}
          </div>
          
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
          
          {trend && (
            <div className={cn(
              'flex items-center space-x-1 mt-2',
              trend.direction === 'up' ? 'text-red-600' : 'text-green-600'
            )}>
              <span className="text-xs font-medium">
                {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
              </span>
              <span className="text-xs text-gray-500">
                vs last period
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}