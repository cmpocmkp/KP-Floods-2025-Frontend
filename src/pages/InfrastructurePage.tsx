import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Route, Zap, Construction } from 'lucide-react'
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend as RechartsLegend
} from 'recharts'
import { KpiCard, DataTable, DataTableColumn, ProgressBar } from '../components/shared'
import { infrastructureApi } from '../lib/api'
import { InfrastructureByDistrict, RoadSituation } from '../lib/types'
import { formatNumber } from '../lib/utils'

export default function InfrastructurePage() {
  const { data: metricsData, isLoading: metricsLoading } = useQuery({
    queryKey: ['infrastructure', 'metrics'],
    queryFn: () => infrastructureApi.getMetrics()
  })

  const { data: districtData, isLoading: districtLoading } = useQuery({
    queryKey: ['infrastructure', 'districts'],
    queryFn: () => infrastructureApi.getByDistrict()
  })

  const { data: situationsData, isLoading: situationsLoading } = useQuery({
    queryKey: ['infrastructure', 'situations'],
    queryFn: () => infrastructureApi.getRoadSituations()
  })

  const { data: restorationData, isLoading: restorationLoading } = useQuery({
    queryKey: ['infrastructure', 'restoration'],
    queryFn: () => infrastructureApi.getRestorationData()
  })

  const metrics = metricsData?.data
  const districts = districtData?.data || []
  const situations = situationsData?.data || []
  const restoration = restorationData?.data || []

  // Prepare restoration chart data
  const restorationChartData = restoration.map(item => ({
    category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
    'Fully Restored': item.fullyRestored,
    'Partially Restored': item.partiallyRestored,
    'Not Restored': item.notRestored
  }))

  const districtColumns: DataTableColumn<InfrastructureByDistrict>[] = [
    { key: 'district', label: 'District', align: 'left' },
    { 
      key: 'roadsDamaged', 
      label: 'Roads Damaged', 
      align: 'right',
      render: (value: number) => (
        <span className="font-medium text-gray-900">{formatNumber(value)}</span>
      )
    },
    { 
      key: 'bridgesDamaged', 
      label: 'Bridges Damaged', 
      align: 'right',
      render: (value: number) => (
        <span className="font-medium text-gray-900">{formatNumber(value)}</span>
      )
    },
    { 
      key: 'culvertsDamaged', 
      label: 'Culverts Damaged', 
      align: 'right',
      render: (value: number) => (
        <span className="font-medium text-gray-900">{formatNumber(value)}</span>
      )
    },
    { 
      key: 'totalLengthKm', 
      label: 'Total Length (KM)', 
      align: 'right',
      render: (value: number) => (
        <span className="font-medium text-gray-900">{value.toFixed(2)}</span>
      )
    },
    {
      key: 'restorationProgress',
      label: 'Restoration Progress',
      align: 'center',
      render: (value: number) => (
        <div className="w-24">
          <ProgressBar
            value={value}
            max={100}
            color="blue"
            size="sm"
            showLabel={false}
          />
          <span className="text-xs text-gray-600 mt-1 block">{value}%</span>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Infrastructure</h1>
          <p className="text-gray-600 mt-1">Infrastructure damage assessment and restoration progress</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard
            title="Roads Damaged"
            value={metrics?.roadsDamaged || 0}
            icon={Route}
            color="red"
            subtitle={`${metrics?.totalRoadsKm || 0} km total`}
          />
          <KpiCard
            title="Bridges Damaged"
            value={metrics?.bridgesDamaged || 0}
            icon={Zap}
            color="orange"
            subtitle={`${metrics?.totalBridgesMeters || 0} meters total`}
          />
          <KpiCard
            title="Culverts Damaged"
            value={metrics?.culvertsDamaged || 0}
            icon={Construction}
            color="blue"
            subtitle={`${metrics?.totalCulvertsMeters || 0} meters total`}
          />
        </div>

        {/* Infrastructure Restoration Status Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Infrastructure Restoration Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={restorationChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="category" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <RechartsLegend />
                <Bar dataKey="Fully Restored" stackId="a" fill="#16a34a" />
                <Bar dataKey="Partially Restored" stackId="a" fill="#eab308" />
                <Bar dataKey="Not Restored" stackId="a" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* District-wise Infrastructure Damage Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">District-wise Infrastructure Damage</h2>
          </div>
          <DataTable
            data={districts}
            columns={districtColumns}
            loading={districtLoading}
            emptyMessage="No infrastructure damage data available"
          />
        </div>

        {/* Road Situations */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Road Situations</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {situations.map((situation) => (
              <div key={situation.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {situation.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    situation.status === 'in_progress' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : situation.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {situation.status === 'in_progress' ? 'In Progress' : 
                     situation.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  Date: {situation.date}
                </p>
                
                <p className="text-gray-700 leading-relaxed">
                  {situation.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}