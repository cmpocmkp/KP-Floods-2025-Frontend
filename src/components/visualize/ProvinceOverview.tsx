import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Skull,
  Activity,
  Home,
  School,
  Route,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import { DSRAggregates } from '@/api/dsr';
import { VisualizeFilters } from '@/pages/VisualizePage';

interface ProvinceOverviewProps {
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

export function ProvinceOverview({ aggregates, filters, crossFilters, onCrossFilterChange }: ProvinceOverviewProps) {
  if (!aggregates) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Province Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No data available for the selected period.
          </div>
        </CardContent>
      </Card>
    );
  }

  const { totals } = aggregates;

  // Prepare KPI data
  const kpiData = [
    {
      title: "Total Deaths",
      value: totals.deaths,
      icon: Skull,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Total Injured",
      value: totals.injured,
      icon: Activity,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Houses Damaged",
      value: totals.housesTotal,
      icon: Home,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      subtitle: `${totals.housesFull} fully, ${totals.housesPartial} partially`
    },
    {
      title: "Schools Affected",
      value: totals.schoolsTotal,
      icon: School,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Roads Blocked",
      value: totals.roadsBlocked,
      icon: Route,
      color: "text-gray-600",
      bgColor: "bg-gray-50"
    },
    {
      title: "Districts Affected",
      value: totals.districtsReporting,
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ];

  // Mock time series data (in real implementation, this would come from multiple dates)
  const timeSeriesData = [
    { date: '2025-08-01', deaths: 45, injured: 23, housesFull: 120, housesPartial: 89 },
    { date: '2025-08-02', deaths: 52, injured: 31, housesFull: 145, housesPartial: 102 },
    { date: '2025-08-03', deaths: 38, injured: 19, housesFull: 98, housesPartial: 76 },
    { date: '2025-08-04', deaths: 67, injured: 45, housesFull: 178, housesPartial: 134 },
    { date: '2025-08-05', deaths: 43, injured: 28, housesFull: 112, housesPartial: 87 },
    { date: '2025-08-06', deaths: 71, injured: 52, housesFull: 203, housesPartial: 156 },
    { date: '2025-08-07', deaths: 59, injured: 38, housesFull: 167, housesPartial: 123 },
    { date: '2025-08-08', deaths: 48, injured: 33, housesFull: 134, housesPartial: 98 },
    { date: '2025-08-09', deaths: 55, injured: 41, housesFull: 156, housesPartial: 112 },
    { date: '2025-08-10', deaths: 62, injured: 47, housesFull: 189, housesPartial: 145 },
    { date: '2025-08-11', deaths: 49, injured: 35, housesFull: 142, housesPartial: 108 },
    { date: '2025-08-12', deaths: 73, injured: 58, housesFull: 221, housesPartial: 167 },
    { date: '2025-08-13', deaths: 56, injured: 42, housesFull: 165, housesPartial: 125 },
    { date: '2025-08-14', deaths: 68, injured: 51, housesFull: 198, housesPartial: 152 },
    { date: '2025-08-15', deaths: totals.deaths, injured: totals.injured, housesFull: totals.housesFull, housesPartial: totals.housesPartial }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
              <div className="space-y-1">
                <div className={`text-2xl font-bold ${kpi.color}`}>
                  {kpi.value.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {kpi.title}
                </div>
                {kpi.subtitle && (
                  <div className="text-xs text-muted-foreground">
                    {kpi.subtitle}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Time Series Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Deaths & Injuries Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Casualties Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value, name) => [value, name === 'deaths' ? 'Deaths' : 'Injured']}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="deaths"
                  stackId="1"
                  stroke="#dc2626"
                  fill="#dc2626"
                  fillOpacity={0.6}
                  name="Deaths"
                />
                <Area
                  type="monotone"
                  dataKey="injured"
                  stackId="2"
                  stroke="#ea580c"
                  fill="#ea580c"
                  fillOpacity={0.6}
                  name="Injured"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* House Damage Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Housing Impact Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value, name) => [value, name === 'housesFull' ? 'Fully Damaged' : 'Partially Damaged']}
                />
                <Legend />
                <Bar
                  dataKey="housesFull"
                  fill="#2563eb"
                  name="Fully Damaged"
                />
                <Bar
                  dataKey="housesPartial"
                  fill="#60a5fa"
                  name="Partially Damaged"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Impact Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {((totals.deaths / totals.districtsReporting) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-700">
                Average Impact per District
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Based on {totals.districtsReporting} reporting districts
              </div>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {totals.incidents > 0 ? Math.round(totals.deaths / totals.incidents * 100) : 0}%
              </div>
              <div className="text-sm text-gray-700">
                Fatality Rate per Incident
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Deaths as percentage of total incidents
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {totals.roadsBlocked > 0 ? Math.round(totals.roadsBlocked / totals.districtsReporting) : 0}
              </div>
              <div className="text-sm text-gray-700">
                Blocked Roads per District
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Average infrastructure disruption
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}