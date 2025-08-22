import React from 'react'
import { cn } from '../../lib/utils'

export interface DataTableColumn<T> {
  key: keyof T | string
  label: string
  render?: (value: any, row: T, index: number) => React.ReactNode
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  className?: string
  loading?: boolean
  emptyMessage?: string
}

export default function DataTable<T>({
  data,
  columns,
  className,
  loading = false,
  emptyMessage = 'No data available'
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className={cn('bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden', className)}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn('bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden', className)}>
        <div className="p-8 text-center">
          <p className="text-sm text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={cn(
                    'px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.width && `w-${column.width}`
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-150">
                {columns.map((column, columnIndex) => {
                  const value = typeof column.key === 'string' 
                    ? (row as any)[column.key]
                    : (row as any)[column.key as keyof T]
                  
                  return (
                    <td
                      key={columnIndex}
                      className={cn(
                        'px-6 py-4 whitespace-nowrap text-sm',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {column.render ? column.render(value, row, rowIndex) : (
                        <span className="text-gray-900">
                          {value}
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}