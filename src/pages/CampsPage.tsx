import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Tent, MapPin, Users } from 'lucide-react'
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from 'recharts'
import { KpiCard, DataTable, DataTableColumn } from '../components/shared'
import { campsApi } from '../lib/api'
import { CampsByDistrict } from '../lib/types'
import { formatNumber } from '../lib/utils'

export default function CampsPage() {
  const { data: metricsData, isLoading: metricsLoading } = useQuery({
    queryKey: ['camps', 'metrics'],
    queryFn: () => campsApi.getMetrics()
  })

  const { data: districtData, isLoading: districtLoading } = useQuery({
    queryKey: ['camps', 'districts'],
    queryFn: () => campsApi.getByDistrict()
  })

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['camps', 'chart'],
    queryFn: () => campsApi.getDistrictChart()
  })

  const metrics = metricsData?.data
  const districts = districtData?.data || []
  const chart = chartData?.data || []

  const districtColumns: DataTableColumn<CampsByDistrict>[] = [
    { key: 'district', label: 'District', align: 'left' },
    { 
      key: 'numberOfCamps', 
      label: 'Number of Camps', 
      align: 'right',
      render: (value: number) => (
        <span className="font-medium text-gray-900">{formatNumber(value)}</span>
      )
    },
    { 
      key: 'estimatedCapacity', 
      label: 'Estimated Capacity', 
      align: 'right',
      render: (value: number) => (
        <span className="font-medium text-gray-900">{formatNumber(value)}</span>
      )
    },
    { 
      key: 'currentOccupancy', 
      label: 'Current Occupancy', 
      align: 'right',
      render: (value: number, row: CampsByDistrict) => {
        const occupancyRate = (value / row.estimatedCapacity) * 100
        const colorClass = occupancyRate > 90 ? 'text-red-600' : 
                          occupancyRate > 70 ? 'text-orange-600' : 'text-gray-900'
        return (
          <div className="text-right">
            <span className={`font-medium ${colorClass}`}>{formatNumber(value)}</span>
            <div className="text-xs text-gray-500">({occupancyRate.toFixed(1)}%)</div>
          </div>
        )
      }
    },
    { key: 'facilitiesAvailable', label: 'Facilities Available', align: 'left' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Relief Camps</h1>
          <p className="text-gray-600 mt-1">Relief camp management and capacity tracking</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard
            title="Total Camps"
            value={metrics?.totalCamps || 0}
            icon={Tent}
            color="blue"
          />
          <KpiCard
            title="Districts with Camps"
            value={metrics?.districtsWithCamps || 0}
            icon={MapPin}
            color="green"
          />
          <KpiCard
            title="Estimated Capacity"
            value={metrics?.estimatedCapacity || 0}
            icon={Users}
            color="orange"
          />
        </div>

        {/* Camps by District Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Camps by District</h2>
          <p className="text-sm text-gray-600 mb-4">Relief Camps by District</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="district" 
                  stroke="#6b7280"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  formatter={(value: number) => [value, 'Number of Camps']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="camps" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* District-wise Camp Details Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">District-wise Camp Details</h2>
          </div>
          <DataTable
            data={districts}
            columns={districtColumns}
            loading={districtLoading}
            emptyMessage="No camp data available"
          />
        </div>

        {/* Camp Statistics Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Capacity vs Occupancy</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Capacity:</span>
                <span className="font-medium text-gray-900">
                  {formatNumber(districts.reduce((sum, d) => sum + d.estimatedCapacity, 0))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Occupancy:</span>
                <span className="font-medium text-gray-900">
                  {formatNumber(districts.reduce((sum, d) => sum + d.currentOccupancy, 0))}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm text-gray-600">Occupancy Rate:</span>
                <span className="font-medium text-blue-600">
                  {districts.length > 0 ? (
                    ((districts.reduce((sum, d) => sum + d.currentOccupancy, 0) / 
                      districts.reduce((sum, d) => sum + d.estimatedCapacity, 0)) * 100).toFixed(1)
                  ) : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Occupied Districts</h3>
            <div className="space-y-3">
              {districts
                .sort((a, b) => (b.currentOccupancy / b.estimatedCapacity) - (a.currentOccupancy / a.estimatedCapacity))
                .slice(0, 3)
                .map((district, index) => {
                  const occupancyRate = (district.currentOccupancy / district.estimatedCapacity) * 100
                  return (
                    <div key={district.district} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{district.district}:</span>
                      <span className={`font-medium ${
                        occupancyRate > 90 ? 'text-red-600' : 
                        occupancyRate > 70 ? 'text-orange-600' : 'text-gray-900'
                      }`}>
                        {occupancyRate.toFixed(1)}%
                      </span>
                    </div>
                  )
                })}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Facilities</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Medical Facilities</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Food Distribution</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Temporary Shelter</span>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                All camps provide basic medical, food, and shelter facilities
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}