import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from '@/components/Layout/LoadingSpinner';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Treemap
} from 'recharts';
import {
  MapPin, Building2,
  BarChart3, PieChart as PieChartIcon
} from 'lucide-react';
import { DataCoveragePeriod } from '@/components/shared/DataCoveragePeriod';

// Import API functions
import { getCombinedInfrastructureServices } from '@/api/infrastructure';



// Import new infrastructure analysis components
import { InfrastructureDamageAnalysis } from '@/components/visualize/InfrastructureDamageAnalysis';
import { ServicesStatusAnalysis } from '@/components/visualize/ServicesStatusAnalysis';
import { RoadsBridgesAnalysis } from '@/components/visualize/RoadsBridgesAnalysis';

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
    return `${(amount / 1_000_000_000).toFixed(2)} B PKR`;
  } else if (amount >= 1_000_000) {
    return `Rs ${(amount / 1_000_000).toFixed(2)}M`;
  } else if (amount >= 1_000) {
    return `Rs ${(amount / 1_000).toFixed(2)}K`;
  }
  return `Rs ${amount.toFixed(2)}`;
};


export default function VisualizePage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch all data sources
  const { data: infrastructureData, isLoading: isLoadingInfra } = useQuery({
    queryKey: ['combined-infrastructure'],
    queryFn: getCombinedInfrastructureServices,
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = isLoadingInfra;



  // Overview Summary Cards
  const OverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Infrastructure Damage</p>
              <p className="text-2xl font-bold">
                {(infrastructureData?.infrastructure?.summary?.total_houses_fully_damaged || 0) + (infrastructureData?.infrastructure?.summary?.total_houses_partially_damaged || 0)}
              </p>
              <p className="text-sm opacity-80">Total Houses</p>
            </div>
            <Building2 className="h-8 w-8 opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Services Disruption</p>
              <p className="text-2xl font-bold">
                {(infrastructureData?.services?.summary?.total_water_disconnections || 0) + (infrastructureData?.services?.summary?.total_gas_disconnections || 0) + (infrastructureData?.services?.summary?.total_ptcl_disconnections || 0)}
              </p>
              <p className="text-sm opacity-80">Total Disconnections</p>
            </div>
            <MapPin className="h-8 w-8 opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Roads & Bridges</p>
              <p className="text-2xl font-bold">
                {infrastructureData?.cw_roads_bridges?.summary?.total_effected_roads || 0}
              </p>
              <p className="text-sm opacity-80">Total Affected</p>
            </div>
            <Building2 className="h-8 w-8 opacity-80" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Sector-wise Damage Distribution
  const SectorDamageChart = () => {
    const sectorData = [
      { name: 'Houses', value: (infrastructureData?.infrastructure?.summary?.total_houses_fully_damaged || 0) + (infrastructureData?.infrastructure?.summary?.total_houses_partially_damaged || 0), color: CHART_COLORS.primary[0] },
      { name: 'Education', value: infrastructureData?.infrastructure?.summary?.total_education_facilities_damaged || 0, color: CHART_COLORS.secondary[0] },
      { name: 'Health', value: infrastructureData?.infrastructure?.summary?.total_health_facilities_damaged || 0, color: CHART_COLORS.accent[0] },
      { name: 'Roads', value: infrastructureData?.infrastructure?.summary?.total_roads_damaged || 0, color: CHART_COLORS.danger[0] },
      { name: 'Bridges', value: (infrastructureData?.infrastructure?.summary?.total_permanent_bridges_damaged || 0) + (infrastructureData?.infrastructure?.summary?.total_pedestrian_bridges_damaged || 0), color: CHART_COLORS.purple[0] },
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
      <DataCoveragePeriod />
      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-gray-600">Interactive analysis of all flood impact sectors and recovery progress</p>
      </div>

      {/* Overview Cards */}
      <OverviewCards />

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SectorDamageChart />
            <DistrictImpactChart />
          </div>
   
          <InfrastructureTreemap />
        </TabsContent>

        {/* Infrastructure Tab */}
        <TabsContent value="infrastructure" className="space-y-6">
          {/* Infrastructure Damage Analysis */}
          <InfrastructureDamageAnalysis data={infrastructureData} />
          
          {/* Roads and Bridges Analysis */}
          <RoadsBridgesAnalysis data={infrastructureData} />
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <ServicesStatusAnalysis data={infrastructureData} />
        </TabsContent>


      </Tabs>
    </div>
  );
}