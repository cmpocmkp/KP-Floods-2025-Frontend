import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ComposedChart
} from 'recharts';
import { Zap, Droplets, Flame, Phone, Wifi, MapPin, CheckCircle, XCircle } from 'lucide-react';

interface ServicesStatusAnalysisProps {
  data: any;
}

const CHART_COLORS = {
  primary: ['#3B82F6', '#1D4ED8', '#1E40AF'],
  secondary: ['#10B981', '#059669', '#047857'],
  accent: ['#F59E0B', '#D97706', '#B45309'],
  danger: ['#EF4444', '#DC2626', '#B91C1C'],
  purple: ['#8B5CF6', '#7C3AED', '#6D28D9'],
  pink: ['#EC4899', '#DB2777', '#BE185D'],
  teal: ['#14B8A6', '#0D9488', '#0F766E']
};

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
};

export const ServicesStatusAnalysis: React.FC<ServicesStatusAnalysisProps> = ({ data }) => {
  if (!data?.services?.data) return null;

  const servicesData = data.services.data;
  const summary = data.services.summary;

  // Prepare data for district-wise services disruption
  const districtServicesData = servicesData.map((district: any) => ({
    district: district.DistrictName,
    feedersDisconnected: district.TotalFeedersDisconnections,
    feedersRestored: district.TotalFeedersRestored,
    waterDisconnected: district.TotalWaterDisconnections,
    waterRestored: district.TotalWaterRestored,
    gasDisconnected: district.TotalGasDisconnections,
    gasRestored: district.TotalGasRestored,
    ptclDisconnected: district.TotalPTCLDisconnections,
    ptclRestored: district.TotalPTCLRestored,
    cellularDisconnected: district.TotalCellularDisconnections,
    cellularRestored: district.TotalCellularRestored,
    inaccessibleAreas: district.TotalInaccessibleAreas,
    reconnectedAreas: district.TotalReconnectedAreas
  })).filter((item: any) => 
    item.feedersDisconnected > 0 || item.waterDisconnected > 0 || 
    item.gasDisconnected > 0 || item.ptclDisconnected > 0 || 
    item.cellularDisconnected > 0 || item.inaccessibleAreas > 0
  ).sort((a: any, b: any) => 
    (b.feedersDisconnected + b.waterDisconnected + b.gasDisconnected + b.ptclDisconnected + b.cellularDisconnected) - 
    (a.feedersDisconnected + a.waterDisconnected + a.gasDisconnected + a.ptclDisconnected + a.cellularDisconnected)
  ).slice(0, 15);

  // Prepare data for service type distribution
  const serviceTypeData = [
    { name: 'Power Feeders', disconnected: summary.total_feeders_disconnections, restored: summary.total_feeders_restored, color: CHART_COLORS.accent[0] },
    { name: 'Water Supply', disconnected: summary.total_water_disconnections, restored: summary.total_water_restored, color: CHART_COLORS.primary[0] },
    { name: 'Gas Supply', disconnected: summary.total_gas_disconnections, restored: summary.total_gas_restored, color: CHART_COLORS.danger[0] },
    { name: 'PTCL Services', disconnected: summary.total_ptcl_disconnections, restored: summary.total_ptcl_restored, color: CHART_COLORS.purple[0] },
    { name: 'Cellular Services', disconnected: summary.total_cellular_disconnections, restored: summary.total_cellular_restored, color: CHART_COLORS.secondary[0] }
  ].filter(item => item.disconnected > 0);

  // Prepare data for restoration progress
  const restorationProgressData = serviceTypeData.map(service => ({
    name: service.name,
    disconnected: service.disconnected,
    restored: service.restored,
    pending: service.disconnected - service.restored,
    restorationRate: service.disconnected > 0 ? (service.restored / service.disconnected) * 100 : 0
  }));

  // Calculate overall restoration rates
  const totalDisconnected = summary.total_feeders_disconnections + summary.total_water_disconnections + 
                           summary.total_gas_disconnections + summary.total_ptcl_disconnections + 
                           summary.total_cellular_disconnections;
  const totalRestored = summary.total_feeders_restored + summary.total_water_restored + 
                       summary.total_gas_restored + summary.total_ptcl_restored + 
                       summary.total_cellular_restored;
  const overallRestorationRate = totalDisconnected > 0 ? (totalRestored / totalDisconnected) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Power Feeders</p>
                <p className="text-2xl font-bold">{formatNumber(summary.total_feeders_disconnections)}</p>
                <p className="text-sm opacity-80">Disconnected</p>
              </div>
              <Zap className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Water Supply</p>
                <p className="text-2xl font-bold">{formatNumber(summary.total_water_disconnections)}</p>
                <p className="text-sm opacity-80">Disconnected</p>
              </div>
              <Droplets className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Gas Supply</p>
                <p className="text-2xl font-bold">{formatNumber(summary.total_gas_disconnections)}</p>
                <p className="text-sm opacity-80">Disconnected</p>
              </div>
              <Flame className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Overall Restoration</p>
                <p className="text-2xl font-bold">{overallRestorationRate.toFixed(1)}%</p>
                <p className="text-sm opacity-80">Rate</p>
              </div>
              <CheckCircle className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* District-wise Services Disruption */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              District-wise Services Disruption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={districtServicesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="district" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Legend />
                <Bar dataKey="waterDisconnected" fill={CHART_COLORS.primary[0]} name="Water Disconnected" />
                <Bar dataKey="gasDisconnected" fill={CHART_COLORS.danger[0]} name="Gas Disconnected" />
                <Line type="monotone" dataKey="ptclDisconnected" stroke={CHART_COLORS.purple[0]} strokeWidth={3} name="PTCL Disconnected" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Restoration Progress by Service Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Restoration Progress by Service Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={restorationProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Legend />
                <Bar dataKey="restored" fill={CHART_COLORS.secondary[0]} name="Restored" />
                <Bar dataKey="pending" fill={CHART_COLORS.accent[0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Restoration Rates Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Service Restoration Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={restorationProgressData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="restorationRate"
                  label={({ name, restorationRate }) => `${name}: ${restorationRate.toFixed(1)}%`}
                >
                  {restorationProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS.primary[index % CHART_COLORS.primary.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Restoration Summary</h3>
              {restorationProgressData.map((service, index) => (
                <div key={service.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: CHART_COLORS.primary[index % CHART_COLORS.primary.length] }}
                    />
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {service.restored} / {service.disconnected}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      {service.restorationRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inaccessible Areas Analysis */}
      {summary.total_inaccessible_areas > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Inaccessible Areas Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {formatNumber(summary.total_inaccessible_areas)}
                </p>
                <p className="text-sm text-gray-600">Total Inaccessible Areas</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {formatNumber(summary.total_reconnected_areas)}
                </p>
                <p className="text-sm text-gray-600">Reconnected Areas</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">
                  {formatNumber(summary.total_inaccessible_areas - summary.total_reconnected_areas)}
                </p>
                <p className="text-sm text-gray-600">Still Inaccessible</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 