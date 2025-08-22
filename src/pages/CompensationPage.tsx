import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { DollarSign, Users, Clock } from 'lucide-react'
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip
} from 'recharts'
import { KpiCard, DataTable, DataTableColumn } from '../components/shared'
import { compensationApi } from '../lib/api'
import { CompensationByDistrict, CompensationPolicy } from '../lib/types'
import { formatNumber, formatCurrency } from '../lib/utils'

const COMPENSATION_COLORS = ['#dc2626', '#ea580c', '#3b82f6', '#16a34a', '#eab308']

export default function CompensationPage() {
  const { data: metricsData, isLoading: metricsLoading } = useQuery({
    queryKey: ['compensation', 'metrics'],
    queryFn: () => compensationApi.getMetrics()
  })

  const { data: districtData, isLoading: districtLoading } = useQuery({
    queryKey: ['compensation', 'districts'],
    queryFn: () => compensationApi.getByDistrict()
  })

  const { data: policyData, isLoading: policyLoading } = useQuery({
    queryKey: ['compensation', 'policy'],
    queryFn: () => compensationApi.getPolicy()
  })

  const metrics = metricsData?.data
  const districts = districtData?.data || []
  const policy = policyData?.data || []

  // Prepare pie chart data for compensation by category
  const categoryData = [
    { name: 'Deaths', value: policy.find(p => p.type === 'Death')?.estimatedCompensation || 0 },
    { name: 'Injuries', value: (policy.find(p => p.type === 'Grievous Injury')?.estimatedCompensation || 0) + (policy.find(p => p.type === 'Substantial Injury')?.estimatedCompensation || 0) },
    { name: 'Houses', value: (policy.find(p => p.type === 'Fully Damaged Houses')?.estimatedCompensation || 0) + (policy.find(p => p.type === 'Partially Damaged Houses')?.estimatedCompensation || 0) },
    { name: 'Livestock', value: (policy.find(p => p.type === 'Big Cattles (cows, buffalo, horse)')?.estimatedCompensation || 0) + (policy.find(p => p.type === 'Small Cattles (donkey, goat, sheep)')?.estimatedCompensation || 0) },
    { name: 'Crops', value: (policy.find(p => p.type === 'Crops per acre')?.estimatedCompensation || 0) + (policy.find(p => p.type === 'Crops per family')?.estimatedCompensation || 0) + (policy.find(p => p.type === 'Orchads per Family')?.estimatedCompensation || 0) }
  ].map((item, index) => ({
    ...item,
    color: COMPENSATION_COLORS[index]
  }))

  const districtColumns: DataTableColumn<CompensationByDistrict>[] = [
    { key: 'district', label: 'District', align: 'left' },
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
      key: 'livestockLost', 
      label: 'Livestock Lost', 
      align: 'right',
      render: (value: number) => (
        <span className="font-medium text-green-600">{formatNumber(value)}</span>
      )
    },
    { 
      key: 'totalCompensation', 
      label: 'Total Compensation (PKR)', 
      align: 'right',
      render: (value: number) => (
        <span className="font-medium text-gray-900">{formatCurrency(value)}</span>
      )
    }
  ]

  const policyColumns: DataTableColumn<CompensationPolicy>[] = [
    { key: 'type', label: 'Type', align: 'left' },
    { 
      key: 'amount', 
      label: 'Amount (PKR)', 
      align: 'right',
      render: (value: number) => (
        <span className="font-medium text-gray-900">{formatCurrency(value)}</span>
      )
    },
    { 
      key: 'eligibleCases', 
      label: 'Eligible Cases', 
      align: 'right',
      render: (value: number) => (
        <span className="font-medium text-gray-900">{formatNumber(value)}</span>
      )
    },
    { 
      key: 'estimatedCompensation', 
      label: 'Estimated Compensation', 
      align: 'right',
      render: (value: number) => (
        <span className="font-medium text-gray-900">{formatCurrency(value)}</span>
      )
    }
  ]

  const pendingAmount = (metrics?.totalRequired || 0) - (metrics?.amountDisbursed || 0)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Compensation</h1>
          <p className="text-gray-600 mt-1">Compensation policy and disbursement tracking</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KpiCard
            title="Total Compensation Required"
            value={formatCurrency(metrics?.totalRequired || 0)}
            icon={DollarSign}
            color="red"
          />
          <KpiCard
            title="Compensation Disbursed"
            value={formatCurrency(metrics?.amountDisbursed || 0)}
            icon={DollarSign}
            color="green"
          />
          <KpiCard
            title="Pending Compensation"
            value={formatCurrency(pendingAmount)}
            icon={Clock}
            color="orange"
          />
          <KpiCard
            title="Beneficiaries Paid"
            value={metrics?.beneficiariesPaid || 0}
            icon={Users}
            color="blue"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Total Compensation Estimate */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Total Compensation Estimate</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Compensation Required</p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(metrics?.totalRequired || 0)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Compensation Disbursed</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(metrics?.amountDisbursed || 0)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Pending Compensation</p>
                <p className="text-xl font-bold text-orange-600">
                  {formatCurrency(pendingAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* Compensation by Category */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Compensation by Category</h2>
            <p className="text-sm text-gray-600 mb-4">Compensation by Category (PKR)</p>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), '']}
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
              {categoryData.map((item, index) => (
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

        {/* Compensation Policy Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Compensation Policy</h2>
          </div>
          <DataTable
            data={policy}
            columns={policyColumns}
            loading={policyLoading}
            emptyMessage="No compensation policy data available"
          />
        </div>

        {/* District-wise Compensation Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">District-wise Compensation</h2>
          </div>
          <DataTable
            data={districts}
            columns={districtColumns}
            loading={districtLoading}
            emptyMessage="No district compensation data available"
          />
        </div>
      </div>
    </div>
  )
}