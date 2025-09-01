import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ComposedChart
} from 'recharts';
import { Footprints, Landmark, MapPin, DollarSign, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface RoadsBridgesAnalysisProps {
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

const formatCurrency = (amount: number): string => {
  if (amount >= 1_000_000_000) {
    return `Rs ${(amount / 1_000_000_000).toFixed(2)}B`;
  } else if (amount >= 1_000_000) {
    return `Rs ${(amount / 1_000_000).toFixed(2)}M`;
  } else if (amount >= 1_000) {
    return `Rs ${(amount / 1_000).toFixed(2)}K`;
  }
  return `Rs ${amount.toFixed(2)}`;
};

export const RoadsBridgesAnalysis: React.FC<RoadsBridgesAnalysisProps> = ({ data }) => {
  if (!data?.cw_roads_bridges?.data) return null;

  const roadsData = data?.cw_roads_bridges?.data || [];
  const summary = data?.cw_roads_bridges?.summary || {
    total_districts: 0,
    total_effected_roads: 0,
    total_damage_spots: 0,
    total_length_km: 0,
    total_damage_length_km: 0,
    total_restored_open_all: 0,
    total_restored_light_traffic: 0,
    total_not_restored_closed: 0,
    total_restoration_cost_m: 0,
    total_rehabilitation_cost_m: 0
  };

  // Prepare data for district-wise roads analysis
  const districtRoadsData = roadsData.map((district: any) => ({
    district: district.district,
    effectedRoads: district.effected_roads,
    damageSpots: district.damage_spots,
    totalLength: district.total_length_km,
    damageLength: district.damage_length_km,
    restoredOpenAll: district.restored_open_all,
    restoredLightTraffic: district.restored_light_traffic,
    notRestored: district.not_restored_closed,
    restorationCost: district.restoration_cost_m,
    rehabilitationCost: district.rehabilitation_cost_m,
    totalCost: district.restoration_cost_m + district.rehabilitation_cost_m
  })).sort((a: any, b: any) => b.effectedRoads - a.effectedRoads).slice(0, 15);

  // Prepare data for restoration status
  const restorationStatusData = [
    { name: 'Fully Restored', value: summary.total_restored_open_all, color: CHART_COLORS.secondary[0] },
    { name: 'Light Traffic', value: summary.total_restored_light_traffic, color: CHART_COLORS.accent[0] },
    { name: 'Not Restored', value: summary.total_not_restored_closed, color: CHART_COLORS.danger[0] }
  ].filter(item => item.value > 0);

  // Prepare data for cost analysis
  const costAnalysisData = roadsData.map((district: any) => ({
    district: district.district,
    restorationCost: district.restoration_cost_m,
    rehabilitationCost: district.rehabilitation_cost_m,
    totalCost: district.restoration_cost_m + district.rehabilitation_cost_m,
    damageLength: district.damage_length_km
  })).filter((item: any) => item.totalCost > 0).sort((a: any, b: any) => b.totalCost - a.totalCost).slice(0, 10);

  // Calculate restoration rates
  const totalRoads = summary.total_effected_roads;
  const fullyRestoredRate = totalRoads > 0 ? (summary.total_restored_open_all / totalRoads) * 100 : 0;
  const lightTrafficRate = totalRoads > 0 ? (summary.total_restored_light_traffic / totalRoads) * 100 : 0;
  const notRestoredRate = totalRoads > 0 ? (summary.total_not_restored_closed / totalRoads) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Roads Affected</p>
                <p className="text-2xl font-bold">{formatNumber(summary.total_effected_roads)}</p>
              </div>
                             <Footprints className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Fully Restored</p>
                <p className="text-2xl font-bold">{formatNumber(summary.total_restored_open_all)}</p>
                <p className="text-sm opacity-80">{fullyRestoredRate.toFixed(1)}%</p>
              </div>
              <CheckCircle className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Light Traffic</p>
                <p className="text-2xl font-bold">{formatNumber(summary.total_restored_light_traffic)}</p>
                <p className="text-sm opacity-80">{lightTrafficRate.toFixed(1)}%</p>
              </div>
              <AlertTriangle className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Not Restored</p>
                <p className="text-2xl font-bold">{formatNumber(summary.total_not_restored_closed)}</p>
                <p className="text-sm opacity-80">{notRestoredRate.toFixed(1)}%</p>
              </div>
              <XCircle className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Damage Length</p>
                <p className="text-2xl font-bold">{formatNumber(summary.total_damage_length_km)} km</p>
              </div>
              <MapPin className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Restoration Cost</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.total_restoration_cost_m * 1000000)}</p>
              </div>
              <DollarSign className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Rehabilitation Cost</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.total_rehabilitation_cost_m * 1000000)}</p>
              </div>
                             <Landmark className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* District-wise Roads Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                             <Footprints className="h-5 w-5" />
              District-wise Roads Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={districtRoadsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="district" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Legend />
                <Bar dataKey="effectedRoads" fill={CHART_COLORS.primary[0]} name="Effected Roads" />
                <Bar dataKey="restoredOpenAll" fill={CHART_COLORS.secondary[0]} name="Fully Restored" />
                <Line type="monotone" dataKey="damageLength" stroke={CHART_COLORS.danger[0]} strokeWidth={3} name="Damage Length (km)" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Restoration Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Restoration Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={restorationStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${formatNumber(value)}`}
                >
                  {restorationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cost Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Cost Analysis by District
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={costAnalysisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="district" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value) * 1000000)} />
              <Legend />
              <Bar dataKey="restorationCost" fill={CHART_COLORS.secondary[0]} name="Restoration Cost" />
              <Bar dataKey="rehabilitationCost" fill={CHART_COLORS.accent[0]} name="Rehabilitation Cost" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Damage Length vs Cost Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Damage Length vs Cost Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={costAnalysisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="district" angle={-45} textAnchor="end" height={80} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'damageLength' ? `${value} km` : formatCurrency(Number(value) * 1000000),
                  name === 'damageLength' ? 'Damage Length' : 'Total Cost'
                ]}
              />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="damageLength" 
                stroke={CHART_COLORS.primary[0]} 
                fill={CHART_COLORS.primary[0]} 
                fillOpacity={0.3}
                name="Damage Length (km)"
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="totalCost" 
                stroke={CHART_COLORS.danger[0]} 
                fill={CHART_COLORS.danger[0]} 
                fillOpacity={0.3}
                name="Total Cost"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Landmark className="h-5 w-5" />
              Roads & Bridges Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Total Districts Affected</span>
                <span className="text-xl font-bold text-blue-600">{summary.total_districts}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium">Total Damage Spots</span>
                <span className="text-xl font-bold text-green-600">{formatNumber(summary.total_damage_spots)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="font-medium">Total Length Affected</span>
                <span className="text-xl font-bold text-orange-600">{formatNumber(summary.total_length_km)} km</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium">Total Cost</span>
                <span className="text-xl font-bold text-purple-600">
                  {formatCurrency((summary.total_restoration_cost_m + summary.total_rehabilitation_cost_m) * 1000000)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Restoration Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Fully Restored</span>
                  <span>{fullyRestoredRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${fullyRestoredRate}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Light Traffic</span>
                  <span>{lightTrafficRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${lightTrafficRate}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Not Restored</span>
                  <span>{notRestoredRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${notRestoredRate}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 