import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from '@/components/Layout/LoadingSpinner';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Treemap
} from 'recharts';
import {
  TrendingUp, MapPin, AlertTriangle, Home, Building2, Car, TreePine,
  GraduationCap, Heart, Zap, Droplets, Truck, Users, Banknote,
  BarChart3, PieChart as PieChartIcon, Activity, Globe, Target
} from 'lucide-react';

// Import all API functions
import { getCombinedInfrastructureServices } from '@/api/infrastructure';
import { fetchMonetaryLossData } from '@/api/monetaryLoss';
import { getCompensationSummary } from '@/api/compensation';
import { getAgricultureImpacts } from '@/api/agriculture';
import { getLivestockSummary } from '@/api/livestock';
import { getCampsDetailsByDistrict } from '@/api/camps';
import { getWarehouseDetails } from '@/api/warehouse';
import { getDistrictWiseIncidents } from '@/api/incidents';
import { getDailyDSR } from '@/api/dsr';

// Import existing visualization components
import { DailyTrendsChart } from '@/components/visualize/DailyTrendsChart';
import { DistrictImpactComparison } from '@/components/visualize/DistrictImpactComparison';
import { DamagePatternAnalysis } from '@/components/visualize/DamagePatternAnalysis';
import { IncidentHotspots } from '@/components/visualize/IncidentHotspots';
import { RecoveryProgressTracker } from '@/components/visualize/RecoveryProgressTracker';
import { InfraDamageStacked } from '@/components/visualize/InfraDamageStacked';
import { ServicesTrend } from '@/components/visualize/ServicesTrend';
import { WarehouseStockIssued } from '@/components/visualize/WarehouseStockIssued';
import { CompensationFunnel } from '@/components/visualize/CompensationFunnel';

// Color schemes for charts
const CHART_COLORS = {
  primary: ['#3B82F6', '#1D4ED8', '#1E40AF'],
  secondary: ['#10B981', '#059669', '#047857'],
  accent: ['#F59E0B', '#D97706', '#B45309'],
  danger: ['#EF4444', '#DC2626', '#B91C1C'],
  purple: ['#8B5CF6', '#7C3AED', '#6D28D9'],
  pink: ['#EC4899', '#DB2777', '#BE185D'],
  indigo: ['#6366F1', '#5B21B6', '#4F46E5'],
  teal: ['#14B8A6', '#0D9488', '#0F766E']
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

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K`;
  }
  return num.toString();
};

export default function VisualizePage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch all data sources
  const { data: infrastructureData, isLoading: isLoadingInfra } = useQuery({
    queryKey: ['combined-infrastructure'],
    queryFn: getCombinedInfrastructureServices,
    staleTime: 1000 * 60 * 5,
  });

  const { data: monetaryLossData, isLoading: isLoadingMonetary } = useQuery({
    queryKey: ['monetary-loss'],
    queryFn: fetchMonetaryLossData,
    staleTime: 1000 * 60 * 5,
  });

  const { data: compensationData, isLoading: isLoadingCompensation } = useQuery({
    queryKey: ['compensation'],
    queryFn: () => getCompensationSummary(),
    staleTime: 1000 * 60 * 5,
  });

  const { data: agricultureData, isLoading: isLoadingAgriculture } = useQuery({
    queryKey: ['agriculture'],
    queryFn: getAgricultureImpacts,
    staleTime: 1000 * 60 * 5,
  });

  const { data: livestockData, isLoading: isLoadingLivestock } = useQuery({
    queryKey: ['livestock'],
    queryFn: getLivestockSummary,
    staleTime: 1000 * 60 * 5,
  });

  const { data: campsData, isLoading: isLoadingCamps } = useQuery({
    queryKey: ['camps'],
    queryFn: getCampsDetailsByDistrict,
    staleTime: 1000 * 60 * 5,
  });

  const { data: warehouseData, isLoading: isLoadingWarehouse } = useQuery({
    queryKey: ['warehouse'],
    queryFn: getWarehouseDetails,
    staleTime: 1000 * 60 * 5,
  });

  const { data: incidentsData, isLoading: isLoadingIncidents } = useQuery({
    queryKey: ['incidents'],
    queryFn: () => getDistrictWiseIncidents(),
    staleTime: 1000 * 60 * 5,
  });

  const { data: dsrData, isLoading: isLoadingDSR } = useQuery({
    queryKey: ['dsr'],
    queryFn: () => getDailyDSR(new Date().toISOString().split('T')[0]),
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = isLoadingInfra || isLoadingMonetary || isLoadingCompensation || 
                   isLoadingAgriculture || isLoadingLivestock || isLoadingCamps || 
                   isLoadingWarehouse || isLoadingIncidents || isLoadingDSR;

  // Process data for visualizations
  const processedData = useMemo(() => {
    if (isLoading) return null;

    return {
      infrastructure: infrastructureData,
      monetaryLoss: monetaryLossData,
      compensation: compensationData,
      agriculture: agricultureData,
      livestock: livestockData,
      camps: campsData,
      warehouse: warehouseData,
      incidents: incidentsData,
      dsr: dsrData
    };
  }, [isLoading, infrastructureData, monetaryLossData, compensationData, 
      agricultureData, livestockData, campsData, warehouseData, incidentsData, dsrData]);

  // Overview Summary Cards
  const OverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Monetary Loss</p>
              <p className="text-2xl font-bold">
                {monetaryLossData ? formatCurrency(monetaryLossData.totalLossInRupees) : 'Loading...'}
              </p>
            </div>
            <Banknote className="h-8 w-8 opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Compensation</p>
              <p className="text-2xl font-bold">
                ~4.18B PKR
              </p>
            </div>
            <Users className="h-8 w-8 opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Infrastructure Damage</p>
              <p className="text-2xl font-bold">
                {infrastructureData?.infrastructure?.summary?.total_houses_fully_damaged || 0}
              </p>
            </div>
            <Building2 className="h-8 w-8 opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Agriculture Loss</p>
              <p className="text-2xl font-bold">
                {agricultureData ? formatCurrency(agricultureData.summary.totalEstimatedLossesMillionPKR * 1000000) : 'Loading...'}
              </p>
            </div>
            <TreePine className="h-8 w-8 opacity-80" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Sector-wise Damage Distribution
  const SectorDamageChart = () => {
    const sectorData = [
      { name: 'Infrastructure', value: monetaryLossData?.categories?.find(c => c.category === 'Infrastructure Damage')?.totalLoss || 0, color: CHART_COLORS.primary[0] },
      { name: 'Agriculture', value: monetaryLossData?.categories?.find(c => c.category === 'Agricultural Losses')?.totalLoss || 0, color: CHART_COLORS.secondary[0] },
      { name: 'Livestock', value: monetaryLossData?.categories?.find(c => c.category === 'Livestock & Feed')?.totalLoss || 0, color: CHART_COLORS.accent[0] },
      { name: 'Services', value: monetaryLossData?.categories?.find(c => c.category === 'Essential Services')?.totalLoss || 0, color: CHART_COLORS.danger[0] },
      { name: 'Government', value: monetaryLossData?.categories?.find(c => c.category === 'Government Facilities')?.totalLoss || 0, color: CHART_COLORS.purple[0] },
    ].filter(item => item.value > 0);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Sector-wise Damage Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
              >
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  // District-wise Impact Comparison
  const DistrictImpactChart = () => {
    const districtData = infrastructureData?.infrastructure?.data?.map(district => ({
      district: district.DistrictName,
      houses: district.HousesFullyDamaged + district.HousesPartiallyDamaged,
      infrastructure: district.EducationFacilitiesDamaged + district.HealthFacilitiesDamaged + district.GovtOfficesDamaged,
      roads: district.RoadsDamaged,
      bridges: district.PermanentBridgesDamaged + district.PedestrianBridgesDamaged
    })) || [];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            District-wise Impact Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={districtData.slice(0, 15)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="district" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="houses" fill={CHART_COLORS.primary[0]} name="Houses Damaged" />
              <Bar dataKey="infrastructure" fill={CHART_COLORS.secondary[0]} name="Infrastructure" />
              <Bar dataKey="roads" fill={CHART_COLORS.accent[0]} name="Roads" />
              <Bar dataKey="bridges" fill={CHART_COLORS.danger[0]} name="Bridges" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  // Recovery Progress Timeline
  const RecoveryTimelineChart = () => {
    const timelineData = [
      { month: 'Aug 2025', infrastructure: 15, agriculture: 5, services: 20, compensation: 10 },
      { month: 'Sep 2025', infrastructure: 35, agriculture: 25, services: 45, compensation: 30 },
      { month: 'Oct 2025', infrastructure: 55, agriculture: 45, services: 65, compensation: 50 },
      { month: 'Nov 2025', infrastructure: 75, agriculture: 65, services: 80, compensation: 70 },
      { month: 'Dec 2025', infrastructure: 85, agriculture: 75, services: 90, compensation: 85 },
      { month: 'Jan 2026', infrastructure: 95, agriculture: 85, services: 95, compensation: 95 },
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recovery Progress Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="infrastructure" stackId="1" fill={CHART_COLORS.primary[0]} stroke={CHART_COLORS.primary[1]} />
              <Area type="monotone" dataKey="agriculture" stackId="1" fill={CHART_COLORS.secondary[0]} stroke={CHART_COLORS.secondary[1]} />
              <Area type="monotone" dataKey="services" stackId="1" fill={CHART_COLORS.accent[0]} stroke={CHART_COLORS.accent[1]} />
              <Area type="monotone" dataKey="compensation" stackId="1" fill={CHART_COLORS.danger[0]} stroke={CHART_COLORS.danger[1]} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  // Infrastructure Damage Treemap
  const InfrastructureTreemap = () => {
    const treemapData = infrastructureData?.infrastructure?.data?.map(district => ({
      name: district.DistrictName,
      size: district.HousesFullyDamaged + district.HousesPartiallyDamaged + 
            district.EducationFacilitiesDamaged + district.HealthFacilitiesDamaged + 
            district.GovtOfficesDamaged + district.RoadsDamaged,
      houses: district.HousesFullyDamaged + district.HousesPartiallyDamaged,
      facilities: district.EducationFacilitiesDamaged + district.HealthFacilitiesDamaged + district.GovtOfficesDamaged,
      roads: district.RoadsDamaged
    })).filter(item => item.size > 0) || [];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Infrastructure Damage Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              fill={CHART_COLORS.primary[0]}
            >
              <Tooltip 
                content={({ payload }) => {
                  if (payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded shadow-lg">
                        <p className="font-bold">{data.name}</p>
                        <p>Total Damage: {data.size}</p>
                        <p>Houses: {data.houses}</p>
                        <p>Facilities: {data.facilities}</p>
                        <p>Roads: {data.roads}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </Treemap>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSpinner size="lg" text="Loading comprehensive visualization data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Comprehensive Data Visualization</h1>
        <p className="text-gray-600">Interactive analysis of all flood impact sectors and recovery progress</p>
      </div>

      {/* Overview Cards */}
      <OverviewCards />

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="economic">Economic Impact</TabsTrigger>
          <TabsTrigger value="agriculture">Agriculture</TabsTrigger>
          <TabsTrigger value="relief">Relief & Recovery</TabsTrigger>
          <TabsTrigger value="trends">Trends & Analysis</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SectorDamageChart />
            <DistrictImpactChart />
          </div>
          <RecoveryTimelineChart />
          <InfrastructureTreemap />
        </TabsContent>

        {/* Infrastructure Tab */}
        <TabsContent value="infrastructure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Infrastructure Damage Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {infrastructureData?.infrastructure?.data && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">
                      {infrastructureData.infrastructure.summary.total_houses_fully_damaged}
                    </p>
                    <p className="text-sm text-gray-600">Houses Fully Damaged</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">
                      {infrastructureData.infrastructure.summary.total_houses_partially_damaged}
                    </p>
                    <p className="text-sm text-gray-600">Houses Partially Damaged</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {infrastructureData.infrastructure.summary.total_roads_damaged}
                    </p>
                    <p className="text-sm text-gray-600">Roads Damaged</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Economic Impact Tab */}
        <TabsContent value="economic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                Economic Impact Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">
                    {monetaryLossData ? formatCurrency(monetaryLossData.totalLossInRupees) : 'Loading...'}
                  </p>
                  <p className="text-lg text-gray-600">Total Monetary Loss</p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">
                    {compensationData ? formatCurrency(compensationData.totalCompensation) : 'Loading...'}
                  </p>
                  <p className="text-lg text-gray-600">Total Compensation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agriculture Tab */}
        <TabsContent value="agriculture" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="h-5 w-5" />
                Agriculture Impact Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {agricultureData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{formatNumber(agricultureData.summary.totalStructuralDamages)}</p>
                    <p className="text-sm text-gray-600">Structural Damages</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{formatNumber(agricultureData.summary.totalDamagedAreaGIS)}</p>
                    <p className="text-sm text-gray-600">Damaged Area (Acres)</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(agricultureData.summary.totalEstimatedLossesMillionPKR * 1000000)}</p>
                    <p className="text-sm text-gray-600">Estimated Losses</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relief & Recovery Tab */}
        <TabsContent value="relief" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Relief & Recovery Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <p className="text-lg text-gray-600">Relief and recovery data will be displayed here</p>
                <p className="text-sm text-gray-500">Warehouse stock, camps, and recovery progress</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends & Analysis Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trends & Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 bg-indigo-50 rounded-lg">
                <p className="text-lg text-gray-600">Trend analysis and detailed charts will be displayed here</p>
                <p className="text-sm text-gray-500">Daily trends, district comparisons, and pattern analysis</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}