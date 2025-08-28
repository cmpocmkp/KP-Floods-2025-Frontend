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
  Zap,
  AlertTriangle,
  CheckCircle,
  Bolt,
  Banknote
} from 'lucide-react';
import { KpiCard } from '@/components/ui/kpi-card';
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

interface EnergyPowerAsset {
  district: {
    name: string;
  };
  minorly_damaged_no: number;
  partially_damaged_no: number;
  washed_away_no: number;
  total_projects_no: number;
  total_capacity_kw: number;
  below_200kw: number;
  kw_200_and_above: number;
  estimated_cost_rehab_protection_million_pkr: number;
}

interface EnergyPowerTabProps {
  data: EnergyPowerAsset[];
}

export default function EnergyPowerTab({ data }: EnergyPowerTabProps): JSX.Element {
  // Calculate totals and summaries
  const summary = useMemo(() => {
    return data.reduce((acc, curr) => ({
      total_projects: acc.total_projects + curr.total_projects_no,
      total_capacity: acc.total_capacity + curr.total_capacity_kw,
      total_damaged: acc.total_damaged + curr.minorly_damaged_no + curr.partially_damaged_no + curr.washed_away_no,
      total_cost: acc.total_cost + curr.estimated_cost_rehab_protection_million_pkr,
      below_200kw: acc.below_200kw + curr.below_200kw,
      above_200kw: acc.above_200kw + curr.kw_200_and_above
    }), {
      total_projects: 0,
      total_capacity: 0,
      total_damaged: 0,
      total_cost: 0,
      below_200kw: 0,
      above_200kw: 0
    });
  }, [data]);

  // Prepare chart data
  const damageDistributionData = useMemo(() => {
    return data
      .filter(d => d.total_projects_no > 0)
      .map(d => ({
        name: d.district.name,
        minorDamage: d.minorly_damaged_no,
        partialDamage: d.partially_damaged_no,
        washedAway: d.washed_away_no,
        totalCapacity: d.total_capacity_kw
      }));
  }, [data]);

  const capacityDistributionData = useMemo(() => [
    { name: 'Below 200KW', value: summary.below_200kw, color: '#3b82f6' },
    { name: '200KW and Above', value: summary.above_200kw, color: '#ef4444' }
  ], [summary]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <KpiCard
          title="Total Projects"
          value={summary.total_projects.toLocaleString()}
          icon={Bolt}
          color="text-blue-600"
        />
        <KpiCard
          title="Total Capacity (KW)"
          value={summary.total_capacity.toLocaleString()}
          icon={Zap}
          color="text-yellow-600"
        />
        <KpiCard
          title="Damaged Projects"
          value={summary.total_damaged.toLocaleString()}
          icon={AlertTriangle}
          color="text-red-600"
        />
        <KpiCard
          title="Below 200KW"
          value={summary.below_200kw.toLocaleString()}
          icon={Bolt}
          color="text-green-600"
        />
        <KpiCard
          title="Rehabilitation Cost (M)"
          value={summary.total_cost.toLocaleString()}
          icon={Banknote}
          color="text-purple-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Damage Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Project Damage by District
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={damageDistributionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="minorDamage" name="Minor Damage" fill="#3b82f6" />
                <Bar dataKey="partialDamage" name="Partial Damage" fill="#eab308" />
                <Bar dataKey="washedAway" name="Washed Away" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Capacity Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Project Capacity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <Pie
                  data={capacityDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={140}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {capacityDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* District-wise Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bolt className="h-5 w-5" />
            District-wise Energy & Power Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>District</TableHead>
                  <TableHead className="text-right">Total Projects</TableHead>
                  <TableHead className="text-right">Total Capacity (KW)</TableHead>
                  <TableHead className="text-right">Minor Damage</TableHead>
                  <TableHead className="text-right">Partial Damage</TableHead>
                  <TableHead className="text-right">Washed Away</TableHead>
                  <TableHead className="text-right">Below 200KW</TableHead>
                  <TableHead className="text-right">200KW+</TableHead>
                  <TableHead className="text-right">Cost (M)</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((district, index) => {
                  const totalDamaged = district.minorly_damaged_no + district.partially_damaged_no + district.washed_away_no;
                  const damagePercent = district.total_projects_no > 0 ? (totalDamaged / district.total_projects_no) * 100 : 0;
                  
                  let statusColor = 'bg-green-500';
                  if (damagePercent >= 75) statusColor = 'bg-red-500';
                  else if (damagePercent >= 50) statusColor = 'bg-orange-500';
                  else if (damagePercent >= 25) statusColor = 'bg-yellow-500';

                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{district.district.name}</TableCell>
                      <TableCell className="text-right">{district.total_projects_no.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{district.total_capacity_kw.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-blue-600">{district.minorly_damaged_no.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-yellow-600">{district.partially_damaged_no.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-red-600">{district.washed_away_no.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{district.below_200kw.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{district.kw_200_and_above.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{district.estimated_cost_rehab_protection_million_pkr.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge className={statusColor}>
                          {damagePercent.toFixed(1)}% Damaged
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