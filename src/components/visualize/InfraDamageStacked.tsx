import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Home,
  Building2,
  School,
  Route,
  Download,
  Filter,
  Info
} from 'lucide-react';
import { DSRAggregates } from '@/api/dsr';
import { VisualizeFilters } from '@/pages/VisualizePage';
import { getInfrastructureDamage } from '@/api/infrastructure';

interface InfraDamageStackedProps {
  aggregates: DSRAggregates | null;
  filters: VisualizeFilters;
  crossFilters: {
    selectedDistricts: string[];
    selectedDivisions: string[];
    selectedCategories: string[];
  };
  onCrossFilterChange: (filters: {
    selectedDistricts: string[];
    selectedDivisions: string[];
    selectedCategories: string[];
  }) => void;
}

interface DistrictDamageData {
  district: string;
  housesFullyDamaged: number;
  housesPartiallyDamaged: number;
  shopsDamaged: number;
  educationFacilitiesDamaged: number;
  healthFacilitiesDamaged: number;
  govtOfficesDamaged: number;
  roadsDamaged: number;
  roadsDamagedLengthKM: number;
  permanentBridgesDamaged: number;
  pedestrianBridgesDamaged: number;
  totalDamage: number;
}

export function InfraDamageStacked({ aggregates, filters, crossFilters, onCrossFilterChange }: InfraDamageStackedProps) {
  const [selectedMetric, setSelectedMetric] = useState<'houses' | 'all'>('houses');
  const [showTop, setShowTop] = useState<number>(15);

  // Fetch infrastructure damage data
  const { data: infraData, isLoading } = useQuery({
    queryKey: ['infrastructure-damage'],
    queryFn: getInfrastructureDamage,
  });

  // Process infrastructure damage data
  const damageData = useMemo(() => {
    if (!infraData?.data) return [];

    return infraData.data.map(district => ({
      district: district.DistrictName,
      housesFullyDamaged: district.HousesFullyDamaged,
      housesPartiallyDamaged: district.HousesPartiallyDamaged,
      shopsDamaged: district.ShopsDamaged,
      educationFacilitiesDamaged: district.EducationFacilitiesDamaged,
      healthFacilitiesDamaged: district.HealthFacilitiesDamaged,
      govtOfficesDamaged: district.GovtOfficesDamaged,
      roadsDamaged: district.RoadsDamaged,
      roadsDamagedLengthKM: district.RoadsDamagedLengthKM,
      permanentBridgesDamaged: district.PermanentBridgesDamaged,
      pedestrianBridgesDamaged: district.PedestrianBridgesDamaged,
      totalDamage: district.HousesFullyDamaged + district.HousesPartiallyDamaged +
                   district.ShopsDamaged + district.EducationFacilitiesDamaged +
                   district.HealthFacilitiesDamaged + district.GovtOfficesDamaged +
                   district.RoadsDamaged + district.PermanentBridgesDamaged +
                   district.PedestrianBridgesDamaged
    })).filter(d => d.totalDamage > 0)
      .sort((a, b) => b.totalDamage - a.totalDamage);
  }, [infraData]);

  // Calculate asset mix data for pie chart
  const assetMixData = useMemo(() => {
    if (!infraData?.summary) return [];

    const summary = infraData.summary;
    return [
      { name: 'Houses Fully', value: summary.total_houses_fully_damaged, color: '#dc2626' },
      { name: 'Houses Partially', value: summary.total_houses_partially_damaged, color: '#ea580c' },
      { name: 'Shops', value: summary.total_shops_damaged, color: '#ca8a04' },
      { name: 'Education', value: summary.total_education_facilities_damaged, color: '#16a34a' },
      { name: 'Health', value: summary.total_health_facilities_damaged, color: '#0891b2' },
      { name: 'Govt Offices', value: summary.total_govt_offices_damaged, color: '#7c3aed' },
      { name: 'Roads', value: summary.total_roads_damaged, color: '#c2410c' },
      { name: 'Permanent Bridges', value: summary.total_permanent_bridges_damaged, color: '#b91c1c' },
      { name: 'Pedestrian Bridges', value: summary.total_pedestrian_bridges_damaged, color: '#92400e' }
    ].filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [infraData]);

  // Apply cross-filters
  const filteredData = useMemo(() => {
    let data = damageData;

    if (crossFilters.selectedDistricts.length > 0) {
      data = data.filter(d => crossFilters.selectedDistricts.includes(d.district));
    }

    return data.slice(0, showTop);
  }, [damageData, crossFilters.selectedDistricts, showTop]);

  // Handle district click for cross-filtering
  const handleDistrictClick = useCallback((districtName: string) => {
    const newSelectedDistricts = crossFilters.selectedDistricts.includes(districtName)
      ? crossFilters.selectedDistricts.filter(d => d !== districtName)
      : [...crossFilters.selectedDistricts, districtName];

    onCrossFilterChange({
      ...crossFilters,
      selectedDistricts: newSelectedDistricts
    });
  }, [crossFilters, onCrossFilterChange]);

  // Handle CSV export
  const handleExportCSV = () => {
    const headers = ['District', 'Houses Fully', 'Houses Partially', 'Shops', 'Education', 'Health', 'Govt Offices', 'Roads', 'Roads KM', 'Permanent Bridges', 'Pedestrian Bridges', 'Total Damage'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => [
        `"${row.district}"`,
        row.housesFullyDamaged,
        row.housesPartiallyDamaged,
        row.shopsDamaged,
        row.educationFacilitiesDamaged,
        row.healthFacilitiesDamaged,
        row.govtOfficesDamaged,
        row.roadsDamaged,
        row.roadsDamagedLengthKM,
        row.permanentBridgesDamaged,
        row.pedestrianBridgesDamaged,
        row.totalDamage
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'infrastructure_damage_analysis.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Infrastructure Damage Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-muted-foreground">Loading infrastructure data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!damageData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Infrastructure Damage Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Home className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Infrastructure Damage Data</h3>
            <p>No infrastructure damage data available for the selected period.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Infrastructure Damage Analysis
            <Badge variant="outline" className="ml-2">
              {filteredData.length} districts
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedMetric === 'houses' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMetric('houses')}
            >
              Housing
            </Button>
            <Button
              variant={selectedMetric === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMetric('all')}
            >
              All Assets
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-1" />
              CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-xl font-bold text-red-600">
                {infraData?.summary.total_houses_fully_damaged.toLocaleString() || 0}
              </div>
              <div className="text-xs text-gray-600">Houses Fully Damaged</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-xl font-bold text-orange-600">
                {infraData?.summary.total_houses_partially_damaged.toLocaleString() || 0}
              </div>
              <div className="text-xs text-gray-600">Houses Partially Damaged</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">
                {infraData?.summary.total_roads_damaged.toLocaleString() || 0}
              </div>
              <div className="text-xs text-gray-600">Roads Damaged</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">
                {infraData?.summary.total_education_facilities_damaged.toLocaleString() || 0}
              </div>
              <div className="text-xs text-gray-600">Education Facilities</div>
            </div>
          </div>

          {/* Stacked Bar Chart */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {selectedMetric === 'houses' ? 'Housing Damage by District' : 'Infrastructure Damage by District'}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info className="h-4 w-4" />
                <span>Click bars to filter by district</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="district"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  labelFormatter={(label) => `District: ${label}`}
                />
                <Legend />
                {selectedMetric === 'houses' ? (
                  <>
                    <Bar
                      dataKey="housesFullyDamaged"
                      stackId="a"
                      fill="#dc2626"
                      name="Houses Fully Damaged"
                      onClick={(data) => handleDistrictClick(data.district)}
                      cursor="pointer"
                    />
                    <Bar
                      dataKey="housesPartiallyDamaged"
                      stackId="a"
                      fill="#ea580c"
                      name="Houses Partially Damaged"
                      onClick={(data) => handleDistrictClick(data.district)}
                      cursor="pointer"
                    />
                  </>
                ) : (
                  <>
                    <Bar
                      dataKey="housesFullyDamaged"
                      stackId="a"
                      fill="#dc2626"
                      name="Houses Fully"
                      onClick={(data) => handleDistrictClick(data.district)}
                      cursor="pointer"
                    />
                    <Bar
                      dataKey="housesPartiallyDamaged"
                      stackId="a"
                      fill="#ea580c"
                      name="Houses Partial"
                      onClick={(data) => handleDistrictClick(data.district)}
                      cursor="pointer"
                    />
                    <Bar
                      dataKey="shopsDamaged"
                      stackId="a"
                      fill="#ca8a04"
                      name="Shops"
                      onClick={(data) => handleDistrictClick(data.district)}
                      cursor="pointer"
                    />
                    <Bar
                      dataKey="educationFacilitiesDamaged"
                      stackId="a"
                      fill="#16a34a"
                      name="Education"
                      onClick={(data) => handleDistrictClick(data.district)}
                      cursor="pointer"
                    />
                    <Bar
                      dataKey="healthFacilitiesDamaged"
                      stackId="a"
                      fill="#0891b2"
                      name="Health"
                      onClick={(data) => handleDistrictClick(data.district)}
                      cursor="pointer"
                    />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Asset Mix Pie Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Asset Damage Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetMixData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {assetMixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Damaged Assets']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Active Filters */}
          {crossFilters.selectedDistricts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Filtered districts:</span>
              {crossFilters.selectedDistricts.map(district => (
                <Badge
                  key={district}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleDistrictClick(district)}
                >
                  {district} ×
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}