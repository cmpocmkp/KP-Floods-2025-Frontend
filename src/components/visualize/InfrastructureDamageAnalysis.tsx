import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Treemap, ComposedChart
} from 'recharts';
import { Building2, Home, Footprints, GraduationCap, Heart, AlertTriangle } from 'lucide-react';

interface InfrastructureDamageAnalysisProps {
  data: any;
}

const CHART_COLORS = {
  primary: ['#3B82F6', '#1D4ED8', '#1E40AF'],
  secondary: ['#10B981', '#059669', '#047857'],
  accent: ['#F59E0B', '#D97706', '#B45309'],
  danger: ['#EF4444', '#DC2626', '#B91C1C'],
  purple: ['#8B5CF6', '#7C3AED', '#6D28D9'],
  pink: ['#EC4899', '#DB2777', '#BE185D'],
  indigo: ['#6366F1', '#4F46E5', '#4338CA'],
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

export const InfrastructureDamageAnalysis: React.FC<InfrastructureDamageAnalysisProps> = ({ data }) => {
  if (!data?.infrastructure?.data) return null;

  const infrastructureData = data?.infrastructure?.data || [];
  const summary = data?.infrastructure?.summary || {
    total_districts: 0,
    total_houses_fully_damaged: 0,
    total_houses_partially_damaged: 0,
    total_shops_damaged: 0,
    total_education_facilities_damaged: 0,
    total_health_facilities_damaged: 0,
    total_govt_offices_damaged: 0,
    total_roads_damaged: 0,
    total_roads_damaged_length_km: 0,
    total_permanent_bridges_damaged: 0,
    total_pedestrian_bridges_damaged: 0
  };

  // Prepare data for district-wise damage comparison
  const districtDamageData = (infrastructureData || []).map(district => ({
    district: district.DistrictName,
    housesFully: district.HousesFullyDamaged,
    housesPartially: district.HousesPartiallyDamaged,
    totalHouses: district.HousesFullyDamaged + district.HousesPartiallyDamaged,
    education: district.EducationFacilitiesDamaged,
    health: district.HealthFacilitiesDamaged,
    govtOffices: district.GovtOfficesDamaged,
    roads: district.RoadsDamaged,
    bridges: district.PermanentBridgesDamaged + district.PedestrianBridgesDamaged,
    shops: district.ShopsDamaged
  })).sort((a, b) => b.totalHouses - a.totalHouses).slice(0, 15);

  // Prepare data for damage type distribution
  const damageTypeData = [
    { name: 'Houses Fully Damaged', value: summary.total_houses_fully_damaged, color: CHART_COLORS.danger[0] },
    { name: 'Houses Partially Damaged', value: summary.total_houses_partially_damaged, color: CHART_COLORS.accent[0] },
    { name: 'Education Facilities', value: summary.total_education_facilities_damaged, color: CHART_COLORS.primary[0] },
    { name: 'Health Facilities', value: summary.total_health_facilities_damaged, color: CHART_COLORS.secondary[0] },
    { name: 'Government Offices', value: summary.total_govt_offices_damaged, color: CHART_COLORS.purple[0] },
    { name: 'Roads Damaged', value: summary.total_roads_damaged, color: CHART_COLORS.pink[0] },
    { name: 'Bridges Damaged', value: summary.total_permanent_bridges_damaged + summary.total_pedestrian_bridges_damaged, color: CHART_COLORS.indigo[0] }
  ].filter(item => item.value > 0);

  // Prepare data for infrastructure damage treemap
  const treemapData = (infrastructureData || []).map(district => ({
    name: district.DistrictName,
    size: district.HousesFullyDamaged + district.HousesPartiallyDamaged + 
          district.EducationFacilitiesDamaged + district.HealthFacilitiesDamaged + 
          district.GovtOfficesDamaged + district.RoadsDamaged,
    houses: district.HousesFullyDamaged + district.HousesPartiallyDamaged,
    facilities: district.EducationFacilitiesDamaged + district.HealthFacilitiesDamaged + district.GovtOfficesDamaged,
    roads: district.RoadsDamaged,
    bridges: district.PermanentBridgesDamaged + district.PedestrianBridgesDamaged
  })).filter(item => item.size > 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Houses Fully Damaged</p>
                <p className="text-2xl font-bold">{formatNumber(summary.total_houses_fully_damaged)}</p>
              </div>
              <Home className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Houses Partially Damaged</p>
                <p className="text-2xl font-bold">{formatNumber(summary.total_houses_partially_damaged)}</p>
              </div>
              <Building2 className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Education Facilities</p>
                <p className="text-2xl font-bold">{formatNumber(summary.total_education_facilities_damaged)}</p>
              </div>
              <GraduationCap className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Roads Damaged</p>
                <p className="text-2xl font-bold">{formatNumber(summary.total_roads_damaged)}</p>
              </div>
              <Footprints className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* District-wise Damage Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              District-wise Infrastructure Damage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={districtDamageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="district" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Legend />
                <Bar dataKey="housesFully" fill={CHART_COLORS.danger[0]} name="Houses Fully Damaged" />
                <Bar dataKey="housesPartially" fill={CHART_COLORS.accent[0]} name="Houses Partially Damaged" />
                <Line type="monotone" dataKey="roads" stroke={CHART_COLORS.primary[0]} strokeWidth={3} name="Roads Damaged" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Damage Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Damage Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={damageTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${formatNumber(value)}`}
                >
                  {damageTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Infrastructure Damage Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Infrastructure Damage Heatmap by District
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
                        <p>Total Damage: {formatNumber(data.size)}</p>
                        <p>Houses: {formatNumber(data.houses)}</p>
                        <p>Facilities: {formatNumber(data.facilities)}</p>
                        <p>Roads: {formatNumber(data.roads)}</p>
                        <p>Bridges: {formatNumber(data.bridges)}</p>
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
    </div>
  );
}; 