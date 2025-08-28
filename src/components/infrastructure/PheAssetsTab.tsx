import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KpiCard } from '@/components/ui/kpi-card';
import { Building2, Banknote, AlertTriangle } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface PheData {
  division: string;
  district: string;
  department: string;
  numberOfDamagedSchemes: number;
  tentativeCost: number;
}

interface PheAssetsTabProps {
  data: {
    data: PheData[];
    summary: {
      total_districts: number;
      total_damaged_schemes: number;
      total_tentative_cost: number;
      districts_with_damage: number;
    };
  };
}

export default function PheAssetsTab({ data }: PheAssetsTabProps) {
  if (!data || !Array.isArray(data.data)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>PHE Schemes Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div>No PHE Schemes data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group data by division
  const divisionData = useMemo(() => {
    const divisions = new Map<string, {
      name: string;
      districts: number;
      damagedSchemes: number;
      tentativeCost: number;
    }>();

    data.data.forEach(item => {
      const divName = item.division;
      const current = divisions.get(divName) || {
        name: divName,
        districts: 0,
        damagedSchemes: 0,
        tentativeCost: 0
      };

      divisions.set(divName, {
        ...current,
        districts: current.districts + 1,
        damagedSchemes: current.damagedSchemes + (item.numberOfDamagedSchemes || 0),
        tentativeCost: current.tentativeCost + (item.tentativeCost || 0)
      });
    });

    return Array.from(divisions.values())
      .filter(div => div.damagedSchemes > 0)
      .sort((a, b) => b.damagedSchemes - a.damagedSchemes);
  }, [data]);

  const chartData = divisionData.map(div => ({
    name: div.name,
    "Damaged Schemes": div.damagedSchemes,
    "Cost (M PKR)": Math.round(div.tentativeCost * 100) / 100
  }));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Districts"
          value={data.summary.total_districts.toString()}
          icon={Building2}
          color="text-blue-600"
        />
        <KpiCard
          title="Districts Affected"
          value={data.summary.districts_with_damage.toString()}
          icon={AlertTriangle}
          color="text-red-600"
        />
        <KpiCard
          title="Damaged Schemes"
          value={data.summary.total_damaged_schemes.toLocaleString()}
          icon={Building2}
          color="text-yellow-600"
        />
        <KpiCard
          title="Total Cost (M)"
          value={`PKR ${data.summary.total_tentative_cost.toLocaleString()}`}
          icon={Banknote}
          color="text-purple-600"
        />
      </div>

      {/* Charts Row */}
      <Card>
        <CardHeader>
          <CardTitle>Division-wise Damage Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#ef4444" />
                <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="Damaged Schemes" fill="#ef4444" />
                <Bar yAxisId="right" dataKey="Cost (M PKR)" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Division-wise Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Division-wise PHE Schemes Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Division</TableHead>
                <TableHead className="text-right">Districts</TableHead>
                <TableHead className="text-right">Damaged Schemes</TableHead>
                <TableHead className="text-right">Tentative Cost (M)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {divisionData.map((division, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{division.name}</TableCell>
                  <TableCell className="text-right">{division.districts}</TableCell>
                  <TableCell className="text-right text-red-600">
                    {division.damagedSchemes.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-purple-600">
                    {division.tentativeCost.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}