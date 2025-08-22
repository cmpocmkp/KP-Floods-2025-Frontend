import React from 'react'
import { cn } from '../../lib/utils'

interface ProgressBarProps {
  value: number
  max: number
  color?: 'blue' | 'green' | 'yellow' | 'red'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500'
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3'
}

export default function ProgressBar({
  value,
  max,
  color = 'blue',
  size = 'md',
  showLabel = false,
  className
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)
  
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>{value}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn(
        'w-full bg-gray-200 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}