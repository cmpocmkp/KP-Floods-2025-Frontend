import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Package, PackageCheck, PackageX } from 'lucide-react'
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend as RechartsLegend
} from 'recharts'
import { KpiCard, DataTable, DataTableColumn } from '../components/shared'
import { warehouseApi } from '../lib/api'
import { WarehouseItem, StockByDivision } from '../lib/types'
import { formatNumber } from '../lib/utils'

const DIVISION_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#84cc16']

export default function WarehousePage() {
  const { data: metricsData, isLoading: metricsLoading } = useQuery({
    queryKey: ['warehouse', 'metrics'],
    queryFn: () => warehouseApi.getMetrics()
  })

  const { data: itemsData, isLoading: itemsLoading } = useQuery({
    queryKey: ['warehouse', 'items'],
    queryFn: () => warehouseApi.getItems()
  })

  const { data: stockData, isLoading: stockLoading } = useQuery({
    queryKey: ['warehouse', 'stock'],
    queryFn: () => warehouseApi.getStockByDivision()
  })

  const { data: trendData, isLoading: trendLoading } = useQuery({
    queryKey: ['warehouse', 'trend'],
    queryFn: () => warehouseApi.getIssuedTrend()
  })

  const metrics = metricsData?.data
  const items = itemsData?.data || []
  const stock = stockData?.data || []
  const trend = trendData?.data || []

  // Prepare pie chart data
  const pieData = stock.map((item, index) => ({
    name: item.division,
    value: item.stock,
    percentage: item.percentage,
    color: DIVISION_COLORS[index % DIVISION_COLORS.length]
  }))

  const itemColumns: DataTableColumn<WarehouseItem>[] = [
    { key: 'item', label: 'Item', align: 'left' },
    { 
      key: 'available', 
      label: 'Available', 
      align: 'right',
      render: (value: number) => (
        <span className="font-medium text-gray-900">{formatNumber(value)}</span>
      )
    },
    { 
      key: 'issued', 
      label: 'Issued', 
      align: 'right',
      render: (value: number) => (
        <span className="font-medium text-gray-900">{formatNumber(value)}</span>
      )
    },
    { 
      key: 'remaining', 
      label: 'Remaining', 
      align: 'right',
      render: (value: number) => (
        <span className={`font-medium ${value < 0 ? 'text-red-600' : 'text-gray-900'}`}>
          {formatNumber(value)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (status: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          status === 'in_stock' 
            ? 'bg-green-100 text-green-800'
            : status === 'low_stock'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {status === 'in_stock' ? 'In Stock' : 
           status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
        </span>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Warehouse</h1>
          <p className="text-gray-600 mt-1">Inventory management and stock tracking</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard
            title="Total Items Available"
            value={metrics?.totalItemsAvailable || 0}
            icon={Package}
            color="blue"
          />
          <KpiCard
            title="Total Items Issued"
            value={metrics?.totalItemsIssued || 0}
            icon={PackageCheck}
            color="green"
          />
          <KpiCard
            title="Items Requested"
            value={metrics?.itemsRequested || 0}
            icon={PackageX}
            color="orange"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stock by Division Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Stock by Division</h2>
            <p className="text-sm text-gray-600 mb-4">Warehouse Stock by Division</p>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatNumber(value), 'Stock']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-4">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatNumber(item.value)} ({item.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items Issued in Last 7 Days */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Items Issued in Last 7 Days</h2>
            <p className="text-sm text-gray-600 mb-4">Top Items Issued in Last 7 Days</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trend} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#6b7280" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="item" 
                    stroke="#6b7280" 
                    fontSize={12}
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatNumber(value), 'Quantity']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar dataKey="quantity" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Available Items Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Top Available Items</h2>
          </div>
          <DataTable
            data={items}
            columns={itemColumns}
            loading={itemsLoading}
            emptyMessage="No items data available"
          />
        </div>
      </div>
    </div>
  )
}