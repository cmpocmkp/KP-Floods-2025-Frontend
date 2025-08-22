import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Eye } from 'lucide-react'
import { DataTable, DataTableColumn, StatBadge } from '../components/shared'
import { incidentsApi } from '../lib/api'
import { IncidentReport, IncidentDetail } from '../lib/types'
import { formatNumber, formatDate } from '../lib/utils'

const DISTRICTS = ['All Districts', 'Buner', 'Swat', 'Shangla', 'Mansehra', 'Bajaur', 'Swabi']

export default function IncidentsPage() {
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts')

  const { data: incidentsData, isLoading: incidentsLoading } = useQuery({
    queryKey: ['incidents', 'list', selectedDistrict],
    queryFn: () => incidentsApi.getIncidents({ district: selectedDistrict === 'All Districts' ? undefined : selectedDistrict })
  })

  const { data: detailsData, isLoading: detailsLoading } = useQuery({
    queryKey: ['incidents', 'details'],
    queryFn: () => incidentsApi.getIncidentDetails()
  })

  const incidents = incidentsData?.data || []
  const details = detailsData?.data || []

  // Filter incidents based on selected district
  const filteredIncidents = selectedDistrict === 'All Districts' 
    ? incidents 
    : incidents.filter(incident => incident.district === selectedDistrict)

  const incidentColumns: DataTableColumn<IncidentReport>[] = [
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
    { key: 'cause', label: 'Cause', align: 'left' },
    { 
      key: 'date', 
      label: 'Date', 
      align: 'left',
      render: (value: string) => formatDate(value)
    },
    {
      key: 'id',
      label: 'Actions',
      align: 'center',
      render: () => (
        <button className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium text-sm">
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Incident Reports</h1>
          
          {/* District Filter */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Filter by District:</p>
            <div className="flex flex-wrap gap-2">
              {DISTRICTS.map((district) => (
                <button
                  key={district}
                  onClick={() => setSelectedDistrict(district)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedDistrict === district
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {district}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* District-wise Incident Reports Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">District-wise Incident Reports</h2>
          </div>
          <DataTable
            data={filteredIncidents}
            columns={incidentColumns}
            loading={incidentsLoading}
            emptyMessage="No incidents found for the selected district"
          />
        </div>

        {/* Recent Incident Details */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Incident Details</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {details.map((detail, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {detail.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Date: {formatDate(detail.date)}
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {detail.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <StatBadge
                    label="Deaths"
                    value={detail.stats.deaths}
                    color="red"
                    size="sm"
                  />
                  <StatBadge
                    label="Injured"
                    value={detail.stats.injured}
                    color="orange"
                    size="sm"
                  />
                  <StatBadge
                    label="Houses Damaged"
                    value={detail.stats.housesDamaged}
                    color="blue"
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}