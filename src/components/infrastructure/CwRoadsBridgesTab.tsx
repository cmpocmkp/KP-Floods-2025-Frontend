import { useMemo } from 'react';
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
  Legend
} from 'recharts';
import {
  Car,
  Building2,
  AlertTriangle,
  CheckCircle,
  Banknote
} from 'lucide-react';
import { KpiCard } from '@/components/ui/kpi-card';
import type { CwRoadsBridgesData } from '@/api/infrastructure';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

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

export default function CwRoadsBridgesTab({ data, summary }: CwRoadsBridgesTabProps): JSX.Element {
  const chartData = useMemo(() => {
    return data.map(district => ({
      name: district.district,
      effectedRoads: district.effected_roads,
      damageSpots: district.damage_spots,
      totalLength: district.total_length_km,
      damageLength: district.damage_length_km,
      restoredAll: district.restored_open_all,
      restoredLight: district.restored_light_traffic,
      notRestored: district.not_restored_closed
    }));
  }, [data]);

  const restorationStatusData = useMemo(() => [
    { name: 'Fully Restored', value: summary.total_restored_open_all, color: '#22c55e' },
    { name: 'Light Traffic Only', value: summary.total_restored_light_traffic, color: '#eab308' },
    { name: 'Not Restored', value: summary.total_not_restored_closed, color: '#ef4444' }
  ], [summary]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <KpiCard
          title="Affected Roads"
          value={summary.total_effected_roads.toLocaleString()}
          icon={Car}
          color="text-red-600"
        />
        <KpiCard
          title="Damage Spots"
          value={summary.total_damage_spots.toLocaleString()}
          icon={AlertTriangle}
          color="text-yellow-600"
        />
        <KpiCard
          title="Total Length (KM)"
          value={summary.total_length_km.toLocaleString()}
          icon={Building2}
          color="text-blue-600"
        />
        <KpiCard
          title="Restoration Cost (M)"
          value={summary.total_restoration_cost_m.toLocaleString()}
          icon={Banknote}
          color="text-green-600"
        />
        <KpiCard
          title="Rehabilitation Cost (M)"
          value={summary.total_rehabilitation_cost_m.toLocaleString()}
          icon={Banknote}
          color="text-purple-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Road Damage Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Road Damage by District
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData.slice(0, 8)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="effectedRoads" name="Affected Roads" fill="#3b82f6" />
                  <Bar dataKey="damageSpots" name="Damage Spots" fill="#ef4444" />
                  <Bar dataKey="damageLength" name="Damage Length (KM)" fill="#eab308" />
                </BarChart>
              </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Restoration Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Restoration Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <Pie
                    data={restorationStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={140}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {restorationStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* District-wise Roads & Bridges Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            District-wise Roads & Bridges Status
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
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((district, index) => {
                  const totalAffected = district.effected_roads;
                  const totalRestored = district.restored_open_all + district.restored_light_traffic;
                  const restorationProgress = (totalRestored / totalAffected) * 100;
                  
                  let statusColor = 'bg-red-500';
                  if (restorationProgress >= 75) statusColor = 'bg-green-500';
                  else if (restorationProgress >= 50) statusColor = 'bg-yellow-500';
                  else if (restorationProgress >= 25) statusColor = 'bg-orange-500';

                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{district.district}</TableCell>
                      <TableCell className="text-right">{district.effected_roads.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{district.damage_spots.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{district.total_length_km.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{district.damage_length_km.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-green-600">{district.restored_open_all.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-yellow-600">{district.restored_light_traffic.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-red-600">{district.not_restored_closed.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge className={statusColor}>
                          {restorationProgress.toFixed(1)}% Restored
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