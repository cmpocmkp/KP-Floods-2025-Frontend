import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KpiCard } from '@/components/ui/kpi-card';
import { School, Building2, AlertTriangle, Banknote, GraduationCap } from 'lucide-react';
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

interface HigherEducationTabProps {
  data: {
    data: Array<{
      district: string;
      colleges_universities_damaged: number;
      approx_short_term_restoration_pkr: number;
      approx_complete_rehabilitation_pkr: number;
    }>;
    summary: {
      total_institutions_damaged: number;
      total_restoration_cost: number;
      total_rehabilitation_cost: number;
      districts_affected: number;
    };
  };
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

export default function HigherEducationTab({ data }: HigherEducationTabProps) {
  if (!data?.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Higher Education Infrastructure Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div>No higher education infrastructure data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.data.map(district => ({
    name: district.district,
    "Damaged Institutions": district.colleges_universities_damaged,
    "Restoration Cost (M)": district.approx_short_term_restoration_pkr / 1000000,
    "Rehabilitation Cost (M)": district.approx_complete_rehabilitation_pkr / 1000000
  }));

  const damageDistributionData = data.data.map(district => ({
    name: district.district,
    value: district.colleges_universities_damaged
  })).filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Institutions Damaged"
          value={data.summary.total_institutions_damaged.toLocaleString()}
          icon={GraduationCap}
          color="text-blue-600"
        />
        <KpiCard
          title="Districts Affected"
          value={data.summary.districts_affected.toLocaleString()}
          icon={Building2}
          color="text-yellow-600"
        />
        <KpiCard
          title="Restoration Cost (M)"
          value={`PKR ${(data.summary.total_restoration_cost / 1000000).toLocaleString()}`}
          icon={AlertTriangle}
          color="text-red-600"
        />
        <KpiCard
          title="Rehabilitation Cost (M)"
          value={`PKR ${(data.summary.total_rehabilitation_cost / 1000000).toLocaleString()}`}
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
                  <Bar dataKey="Damaged Institutions" fill="#ef4444" />
                  <Bar dataKey="Restoration Cost (M)" fill="#8b5cf6" />
                  <Bar dataKey="Rehabilitation Cost (M)" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Damage Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Institutions Damaged by District</CardTitle>
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
          <CardTitle>District-wise Higher Education Infrastructure Damage</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>District</TableHead>
                <TableHead className="text-right">Institutions Damaged</TableHead>
                <TableHead className="text-right">Restoration Cost (M PKR)</TableHead>
                <TableHead className="text-right">Rehabilitation Cost (M PKR)</TableHead>
                <TableHead className="text-right">Total Cost (M PKR)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((district, index) => {
                const totalCost = (district.approx_short_term_restoration_pkr + district.approx_complete_rehabilitation_pkr) / 1000000;
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{district.district}</TableCell>
                    <TableCell className="text-right text-red-600">
                      {district.colleges_universities_damaged.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-yellow-600">
                      {(district.approx_short_term_restoration_pkr / 1000000).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-purple-600">
                      {(district.approx_complete_rehabilitation_pkr / 1000000).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {totalCost.toLocaleString()}
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