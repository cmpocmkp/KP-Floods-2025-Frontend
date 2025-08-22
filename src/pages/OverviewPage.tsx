import React from 'react';
import { KpiRow } from '../features/overview/KpiRow';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { overviewApi } from '../lib/api';
import { formatNumber } from '../lib/utils';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const DAMAGE_COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'];

const severityMarkers = {
  high: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  medium: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  low: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  infra: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  })
};

export default function OverviewPage() {
  const { data: trendData } = useQuery({
    queryKey: ['overview', 'trend'],
    queryFn: () => overviewApi.getTrendData()
  });

  const { data: damageData } = useQuery({
    queryKey: ['overview', 'damage'],
    queryFn: () => overviewApi.getDamageDistribution()
  });

  const { data: divisionData } = useQuery({
    queryKey: ['overview', 'divisions'],
    queryFn: () => overviewApi.getDivisionSummary()
  });

  const { data: mapData } = useQuery({
    queryKey: ['overview', 'map'],
    queryFn: () => overviewApi.getMapMarkers()
  });

  const formattedTrendData = trendData?.data?.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const damageDistributionData = damageData?.data ? [
    { name: 'Deaths', value: damageData.data.deaths },
    { name: 'Injured', value: damageData.data.injured },
    { name: 'Houses Damaged', value: damageData.data.housesDamaged },
    { name: 'Livestock Lost', value: damageData.data.livestockLost }
  ] : [];

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 space-y-6">
      <KpiRow />
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Map + Legend (7/12) */}
        <div className="xl:col-span-7">
          <Card className="p-5 md:p-6">
            <h3 className="text-lg font-semibold mb-4">Affected Areas</h3>
            <div className="h-[400px] bg-gray-50 rounded-lg overflow-hidden">
              <MapContainer
                center={[34.9526, 72.3311]}
                zoom={7}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {mapData?.data?.map((marker) => (
                  <Marker
                    key={marker.id}
                    position={[marker.lat, marker.lng]}
                    icon={severityMarkers[marker.severity]}
                  >
                    <Popup>
                      <div className="p-2">
                        <h4 className="font-semibold">{marker.location}</h4>
                        <p className="text-sm mt-1">Deaths: {marker.deaths}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm">High Severity (50+ deaths)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-sm">Medium (10-49)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Low (1-9)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-sm">Infrastructure Only</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Incident Trends (5/12) */}
        <div className="xl:col-span-5">
          <Card className="p-5 md:p-6">
            <h3 className="text-lg font-semibold mb-4">Incident Trends</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    tickLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    tickLine={{ stroke: '#E5E7EB' }}
                    tickFormatter={(value) => formatNumber(value)}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value) => [formatNumber(value as number)]}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="deaths" 
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={{ fill: '#EF4444', r: 4 }}
                    name="Deaths"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="injured" 
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ fill: '#F59E0B', r: 4 }}
                    name="Injured"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="housesDamaged" 
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', r: 4 }}
                    name="Houses Damaged"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Damage Distribution */}
        <div className="xl:col-span-5">
          <Card className="p-5 md:p-6">
            <h3 className="text-lg font-semibold mb-4">Damage Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={damageDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                    labelLine={false}
                  >
                    {damageDistributionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={DAMAGE_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatNumber(value as number)}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Division Summary Table */}
        <div className="xl:col-span-7">
          <Card className="p-5 md:p-6">
            <h3 className="text-lg font-semibold mb-4">Division-wise Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Division</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Deaths</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Injured</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Houses Damaged</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Schools Damaged</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Livestock Lost</th>
                  </tr>
                </thead>
                <tbody>
                  {divisionData?.data.map((row, index) => (
                    <tr 
                      key={row.division} 
                      className={`
                        border-b border-gray-100 hover:bg-gray-50 transition-colors
                        ${index % 2 === 0 ? 'bg-gray-50/50' : ''}
                      `}
                    >
                      <td className="py-3 px-4 font-medium">{row.division}</td>
                      <td className="text-right py-3 px-4">{formatNumber(row.deaths)}</td>
                      <td className="text-right py-3 px-4">{formatNumber(row.injured)}</td>
                      <td className="text-right py-3 px-4">{formatNumber(row.housesDamaged)}</td>
                      <td className="text-right py-3 px-4">{formatNumber(row.schoolsDamaged)}</td>
                      <td className="text-right py-3 px-4">{formatNumber(row.livestockLost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}