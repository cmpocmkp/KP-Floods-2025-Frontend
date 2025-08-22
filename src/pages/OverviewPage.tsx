import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Skull, Heart, Home, TreePine } from 'lucide-react'
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend as RechartsLegend,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { KpiCard, Legend, DataTable, MapIncident, DataTableColumn } from '../components/shared'
import { overviewApi } from '../lib/api'
import { DivisionSummary } from '../lib/types'
import { formatNumber, formatDate, calculatePercentage } from '../lib/utils'

const DAMAGE_COLORS = ['#dc2626', '#ea580c', '#3b82f6', '#16a34a']

export default function OverviewPage() {
  const { data: toplineData, isLoading: toplineLoading } = useQuery({
    queryKey: ['overview', 'topline'],
    queryFn: () => overviewApi.getToplineMetrics()
  })

  const { data: trendData, isLoading: trendLoading } = useQuery({
    queryKey: ['overview', 'trend'],
    queryFn: () => overviewApi.getTrendData()
  })

  const { data: damageData, isLoading: damageLoading } = useQuery({
    queryKey: ['overview', 'damage'],
    queryFn: () => overviewApi.getDamageDistribution()
  })

  const { data: divisionData, isLoading: divisionLoading } = useQuery({
    queryKey: ['overview', 'divisions'],
    queryFn: () => overviewApi.getDivisionSummary()
  })

  const { data: mapData, isLoading: mapLoading } = useQuery({
    queryKey: ['overview', 'map'],
    queryFn: () => overviewApi.getMapMarkers()
  })

  const topline = toplineData?.data
  const trends = trendData?.data || []
  const damage = damageData?.data
  const divisions = divisionData?.data || []
  const markers = mapData?.data || []

  // Prepare chart data
  const trendChartData = trends.map(item => ({
    date: formatDate(item.date),
    Deaths: item.deaths,
    Injured: item.injured,
    'Houses Damaged': item.housesDamaged
  }))

  const pieData = damage ? [
    { name: 'Deaths', value: damage.deaths, color: DAMAGE_COLORS[0] },
    { name: 'Injured', value: damage.injured, color: DAMAGE_COLORS[1] },
    { name: 'Houses Damaged', value: damage.housesDamaged, color: DAMAGE_COLORS[2] },
    { name: 'Livestock Lost', value: damage.livestockLost, color: DAMAGE_COLORS[3] }
  ] : []

  const total = damage ? damage.deaths + damage.injured + damage.housesDamaged + damage.livestockLost : 0

  // Table columns
  const divisionColumns: DataTableColumn<DivisionSummary>[] = [
    { key: 'division', label: 'Division', align: 'left' },
    { 
      key: 'deaths', 
      label: 'Deaths', 
      align: 'right',
      render: (value: number) => (
        <span className="font-medium text-red-600">{formatNumber(value)}</span>
      )
    },
    { 
      key: 'injured', 
      label: 'Injured', 
      align: 'right',
      render: (value: number) => (
        <span className="font-medium text-orange-600">{formatNumber(value)}</span>
      )
    },
    { 
      key: 'housesDamaged', 
      label: 'Houses Damaged', 
      align: 'right',
      render: (value: number) => (
        <span className="font-medium text-blue-600">{formatNumber(value)}</span>
      )
    },
    { 
      key: 'schoolsDamaged', 
      label: 'Schools Damaged', 
      align: 'right',
      render: (value: number) => (
        <span className="font-medium text-purple-600">{formatNumber(value)}</span>
      )
    },
    { 
      key: 'livestockLost', 
      label: 'Livestock Lost', 
      align: 'right',
      render: (value: number) => (
        <span className="font-medium text-green-600">{formatNumber(value)}</span>
      )
    }
  ]

  const legendItems = [
    { label: 'High Severity (50+ deaths)', color: '#dc2626', description: '50+ deaths' },
    { label: 'Medium Severity (10-49 deaths)', color: '#ea580c', description: '10-49 deaths' },
    { label: 'Low Severity (1-9 deaths)', color: '#ca8a04', description: '1-9 deaths' },
    { label: 'Infrastructure Damage Only', color: '#16a34a', description: 'No deaths' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">KP Floods 2025</h1>
              <p className="text-gray-600 mt-1">
                Report Period: {topline ? `${formatDate(topline.reportPeriod.start, 'long')} - ${formatDate(topline.reportPeriod.end, 'long')}` : 'Loading...'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last Updated:</p>
              <p className="font-medium text-gray-900">
                {topline ? formatDate(topline.lastUpdated, 'long') + ' | 10:52 AM' : 'Loading...'}
              </p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Total Deaths"
            value={topline?.totalDeaths || 0}
            icon={Skull}
            color="red"
            showPercentage={true}
            total={total}
          />
          <KpiCard
            title="Total Injured"
            value={topline?.totalInjured || 0}
            icon={Heart}
            color="orange"
            showPercentage={true}
            total={total}
          />
          <KpiCard
            title="Houses Damaged"
            value={topline?.housesDamaged || 0}
            icon={Home}
            color="blue"
            showPercentage={true}
            total={total}
          />
          <KpiCard
            title="Livestock Lost"
            value={topline?.livestockLost || 0}
            icon={TreePine}
            color="green"
            showPercentage={true}
            total={total}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Map */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Affected Areas Map</h2>
              <MapIncident 
                markers={markers} 
                height="400px"
                className="mb-4"
              />
              <Legend 
                title="Legend"
                items={legendItems}
              />
            </div>
          </div>

          {/* Right Column - Charts */}
          <div className="space-y-6">
            {/* Incident Trends */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Incident Trends</h2>
              <p className="text-sm text-gray-600 mb-4">Daily Incident Trends</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
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
                    <Line 
                      type="monotone" 
                      dataKey="Deaths" 
                      stroke="#dc2626" 
                      strokeWidth={2}
                      dot={{ fill: '#dc2626', r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Injured" 
                      stroke="#ea580c" 
                      strokeWidth={2}
                      dot={{ fill: '#ea580c', r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Houses Damaged" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Damage Distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Damage Distribution</h2>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [formatNumber(value), '']}
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
              <div className="grid grid-cols-2 gap-2 mt-4">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Division-wise Summary Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Division-wise Summary</h2>
          </div>
          <DataTable
            data={divisions}
            columns={divisionColumns}
            loading={divisionLoading}
            emptyMessage="No division data available"
          />
        </div>
      </div>
    </div>
  )
}