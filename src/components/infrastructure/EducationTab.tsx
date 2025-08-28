import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KpiCard } from '@/components/ui/kpi-card';
import { School, Building2, AlertTriangle, Banknote } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface EducationTabProps {
  data: {
    data: Array<{
      district: string;
      schools_fully_damaged: number;
      schools_partially_damaged: number;
    }>;
    summary: {
      total_schools_fully_damaged: number;
      total_schools_partially_damaged: number;
      total_schools_damaged: number;
      districts_affected: number;
    };
  };
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

export default function EducationTab({ data }: EducationTabProps) {
  if (!data?.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Education Infrastructure Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div>No education infrastructure data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalSchoolsDamaged = useMemo(() => ({
    fully: data.summary.total_schools_fully_damaged,
    partially: data.summary.total_schools_partially_damaged
  }), [data]);

  const chartData = data.data.map(district => ({
    name: district.district,
    "Fully Damaged": district.schools_fully_damaged,
    "Partially Damaged": district.schools_partially_damaged,
    "Total": district.schools_fully_damaged + district.schools_partially_damaged
  }));

  const damageDistributionData = [
    { name: 'Fully Damaged Schools', value: totalSchoolsDamaged.fully },
    { name: 'Partially Damaged Schools', value: totalSchoolsDamaged.partially }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Schools Damaged"
          value={data.summary.total_schools_damaged.toLocaleString()}
          icon={School}
          color="text-blue-600"
        />
        <KpiCard
          title="Schools Fully Damaged"
          value={totalSchoolsDamaged.fully.toLocaleString()}
          icon={AlertTriangle}
          color="text-red-600"
        />
        <KpiCard
          title="Schools Partially Damaged"
          value={totalSchoolsDamaged.partially.toLocaleString()}
          icon={Building2}
          color="text-yellow-600"
        />
        <KpiCard
          title="Districts Affected"
          value={data.summary.districts_affected.toLocaleString()}
          icon={Banknote}
          color="text-purple-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* District-wise Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>District-wise Damage Distribution</CardTitle>
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
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Fully Damaged" fill="#ef4444" />
                  <Bar dataKey="Partially Damaged" fill="#f97316" />
                  <Bar dataKey="Total" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Damage Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Damage Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={damageDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {damageDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* District-wise Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>District-wise Education Infrastructure Damage</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>District</TableHead>
                <TableHead className="text-right">Schools Fully Damaged</TableHead>
                <TableHead className="text-right">Schools Partially Damaged</TableHead>
                <TableHead className="text-right">Total Schools Damaged</TableHead>
                <TableHead className="text-right">% of Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((district, index) => {
                const totalDamaged = district.schools_fully_damaged + district.schools_partially_damaged;
                const percentageOfTotal = (totalDamaged / data.summary.total_schools_damaged) * 100;

                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{district.district}</TableCell>
                    <TableCell className="text-right text-red-600">
                      {district.schools_fully_damaged.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-yellow-600">
                      {district.schools_partially_damaged.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-purple-600">
                      {totalDamaged.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {percentageOfTotal.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}