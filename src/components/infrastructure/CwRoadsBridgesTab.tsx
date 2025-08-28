import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ComposedChart,
  Area,
  Legend
} from 'recharts';
import {
  Car,
  Building2,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { KpiCard } from '@/components/ui/kpi-card';
import type { CwRoadsBridgesData } from '@/api/infrastructure';

interface CwRoadsBridgesTabProps {
  data: CwRoadsBridgesData[];
  summary: {
    total_districts: number;
    total_effected_roads: number;
    total_damage_spots: number;
    total_length_km: number;
    total_damage_length_km: number;
    total_restored_open_all: number;
    total_restored_light_traffic: number;
    total_not_restored_closed: number;
    total_restoration_cost_m: number;
    total_rehabilitation_cost_m: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function CwRoadsBridgesTab({ data, summary }: CwRoadsBridgesTabProps) {
  // Process data for visualizations
  const processedData = useMemo(() => {
    if (!data) return null;

    // Top districts by damage
    const topDamagedDistricts = [...data]
      .sort((a, b) => b.damage_length_km - a.damage_length_km)
      .slice(0, 10);

    // Restoration status data
    const restorationStatusData = [
      { name: 'Fully Restored', value: summary.total_restored_open_all, color: '#10B981' },
      { name: 'Light Traffic', value: summary.total_restored_light_traffic, color: '#F59E0B' },
      { name: 'Not Restored', value: summary.total_not_restored_closed, color: '#EF4444' }
    ];

    // Cost analysis data
    const costAnalysisData = data
      .filter(item => item.restoration_cost_m > 0 || item.rehabilitation_cost_m > 0)
      .map(item => ({
        district: item.district,
        restoration_cost: item.restoration_cost_m,
        rehabilitation_cost: item.rehabilitation_cost_m,
        total_cost: item.restoration_cost_m + item.rehabilitation_cost_m,
        damage_length: item.damage_length_km
      }))
      .sort((a, b) => b.total_cost - a.total_cost)
      .slice(0, 10);

    // Progress tracking data
    const progressData = data.map(item => ({
      district: item.district,
      total_roads: item.effected_roads,
      restored_roads: item.restored_open_all + item.restored_light_traffic,
      restoration_percentage: item.effected_roads > 0 
        ? ((item.restored_open_all + item.restored_light_traffic) / item.effected_roads * 100).toFixed(1)
        : 0
    }));

    return {
      topDamagedDistricts,
      restorationStatusData,
      costAnalysisData,
      progressData
    };
  }, [data, summary]);

  if (!processedData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Loading C&W Roads & Bridges data...</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-pulse">Loading road and bridge damage data...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Affected Roads"
          value={summary.total_effected_roads}
          icon={Car}
          color="red"
        />
        <KpiCard
          title="Total Damage Spots"
          value={summary.total_damage_spots}
          icon={AlertTriangle}
          color="orange"
        />
        <KpiCard
          title="Damage Length (KM)"
          value={summary.total_damage_length_km}
          icon={MapPin}
          color="blue"
        />
        <KpiCard
          title="Total Cost (M PKR)"
          value={summary.total_restoration_cost_m + summary.total_rehabilitation_cost_m}
          icon={DollarSign}
          color="green"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Districts by Damage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Top Districts by Road Damage Length
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processedData.topDamagedDistricts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="district" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value} km`, 
                      name === 'damage_length_km' ? 'Damage Length' : name
                    ]}
                  />
                  <Bar dataKey="damage_length_km" fill="#EF4444" name="Damage Length (KM)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Restoration Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Road Restoration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processedData.restorationStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {processedData.restorationStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} roads`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cost Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Restoration Cost Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={processedData.costAnalysisData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="district" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${Number(value).toFixed(2)} M PKR`, 
                      name === 'restoration_cost' ? 'Restoration Cost' : 
                      name === 'rehabilitation_cost' ? 'Rehabilitation Cost' : 'Total Cost'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="restoration_cost" fill="#3B82F6" name="Restoration Cost" />
                  <Bar dataKey="rehabilitation_cost" fill="#10B981" name="Rehabilitation Cost" />
                  <Line type="monotone" dataKey="total_cost" stroke="#EF4444" strokeWidth={2} name="Total Cost" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Restoration Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Restoration Progress by District
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processedData.progressData.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="district" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'total_roads' ? value : 
                      name === 'restored_roads' ? value : 
                      `${value}%`, 
                      name === 'total_roads' ? 'Total Roads' : 
                      name === 'restored_roads' ? 'Restored Roads' : 'Restoration %'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="total_roads" fill="#94A3B8" name="Total Affected Roads" />
                  <Bar dataKey="restored_roads" fill="#10B981" name="Restored Roads" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            C&W Roads & Bridges Damage Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>District</TableHead>
                  <TableHead className="text-right">Affected Roads</TableHead>
                  <TableHead className="text-right">Damage Spots</TableHead>
                  <TableHead className="text-right">Total Length (KM)</TableHead>
                  <TableHead className="text-right">Damage Length (KM)</TableHead>
                  <TableHead className="text-right">Fully Restored</TableHead>
                  <TableHead className="text-right">Light Traffic</TableHead>
                  <TableHead className="text-right">Not Restored</TableHead>
                  <TableHead className="text-right">Restoration Cost (M PKR)</TableHead>
                  <TableHead className="text-right">Rehabilitation Cost (M PKR)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => {
                  const totalRestored = item.restored_open_all + item.restored_light_traffic;
                  const restorationPercentage = item.effected_roads > 0 
                    ? (totalRestored / item.effected_roads * 100).toFixed(1)
                    : 0;
                  
                  return (
                    <TableRow key={item.district}>
                      <TableCell className="font-medium">{item.district}</TableCell>
                      <TableCell className="text-right">{item.effected_roads}</TableCell>
                      <TableCell className="text-right">{item.damage_spots}</TableCell>
                      <TableCell className="text-right">{item.total_length_km.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.damage_length_km.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.restored_open_all}</TableCell>
                      <TableCell className="text-right">{item.restored_light_traffic}</TableCell>
                      <TableCell className="text-right">{item.not_restored_closed}</TableCell>
                      <TableCell className="text-right">{item.restoration_cost_m.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.rehabilitation_cost_m.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={`${
                            Number(restorationPercentage) >= 80 ? 'bg-green-100 text-green-800' :
                            Number(restorationPercentage) >= 50 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {restorationPercentage}% Complete
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 