import React from 'react'
import { cn, formatNumber } from '../../lib/utils'

interface StatBadgeProps {
  label: string
  value: number
  color: 'red' | 'orange' | 'blue' | 'green'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const colorClasses = {
  red: 'bg-red-100 text-red-800 border-red-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  green: 'bg-green-100 text-green-800 border-green-200'
}

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
}

export default function StatBadge({
  label,
  value,
  color,
  size = 'md',
  className
}: StatBadgeProps) {
  return (
    <div className={cn(
      'inline-flex items-center space-x-1 rounded-full border font-medium',
      colorClasses[color],
      sizeClasses[size],
      className
    )}>
      <span>{formatNumber(value)}</span>
      <span>{label}</span>
    </div>
  )
}