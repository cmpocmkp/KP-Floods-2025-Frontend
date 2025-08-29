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
  Droplets,
  Building2,
  AlertTriangle,
  Banknote,
  Map as MapIcon
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

interface IrrigationTabProps {
  data: {
    data: {
      division: string;
      schemes: number;
      restoration_million: number;
      rehabilitation_million: number;
      combined_from: string[];
      total_cost_million: number;
      percentage_of_total_schemes: number;
    }[];
    summary: {
      total_schemes: number;
      total_restoration_cost: number;
      total_rehabilitation_cost: number;
    };
  };
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

export default function IrrigationTab({ data }: IrrigationTabProps) {
  const divisionData = useMemo(() => {
    // Create a map to merge divisions
    const mergedDivisionsMap = new Map();
    
    // Process each division and merge as needed
    data.data.forEach(division => {
      let targetDivision = division.division;
      
      // Determine target division for merging
      if (division.division === 'Manshera') {
        targetDivision = 'Hazara';
      } else if (division.division === 'Charsada' || division.division === 'Bajur') {
        targetDivision = 'Peshawar';
      }
      
      // Add or update the target division with merged data
      if (mergedDivisionsMap.has(targetDivision)) {
        const existing = mergedDivisionsMap.get(targetDivision);
        mergedDivisionsMap.set(targetDivision, {
          name: targetDivision,
          schemes: existing.schemes + division.schemes,
          restorationCost: existing.restorationCost + division.restoration_million,
          rehabilitationCost: existing.rehabilitationCost + division.rehabilitation_million,
          totalCost: existing.totalCost + division.total_cost_million,
          percentage: existing.percentage + division.percentage_of_total_schemes
        });
      } else {
        mergedDivisionsMap.set(targetDivision, {
          name: targetDivision,
          schemes: division.schemes,
          restorationCost: division.restoration_million,
          rehabilitationCost: division.rehabilitation_million,
          totalCost: division.total_cost_million,
          percentage: division.percentage_of_total_schemes
        });
      }
    });
    
    // Return only the merged divisions, sorted by total cost
    return Array.from(mergedDivisionsMap.values()).sort((a, b) => b.totalCost - a.totalCost);
  }, [data]);

  const costDistributionData = useMemo(() => {
    return [
      { name: 'Restoration Cost', value: data.summary.total_restoration_cost },
      { name: 'Rehabilitation Cost', value: data.summary.total_rehabilitation_cost }
    ];
  }, [data]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Schemes"
          value={data.summary.total_schemes.toLocaleString()}
          icon={Droplets}
          color="text-blue-600"
        />
        <KpiCard
          title="Total Divisions"
          value="6"
          icon={MapIcon}
          color="text-green-600"
        />
        <KpiCard
          title="Restoration Cost (M)"
          value={data.summary.total_restoration_cost.toLocaleString()}
          icon={AlertTriangle}
          color="text-yellow-600"
        />
        <KpiCard
          title="Rehabilitation Cost (M)"
          value={data.summary.total_rehabilitation_cost.toLocaleString()}
          icon={Banknote}
          color="text-purple-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Division-wise Cost Distribution Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Division-wise Cost Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={divisionData}
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
                  <Bar dataKey="restorationCost" name="Restoration Cost (M)" fill="#ef4444" />
                  <Bar dataKey="rehabilitationCost" name="Rehabilitation Cost (M)" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cost Type Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {costDistributionData.map((entry, index) => (
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

      {/* Division-wise Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Division-wise Irrigation Infrastructure Damage</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Division</TableHead>
                <TableHead>Schemes</TableHead>
                <TableHead>Restoration Cost (M)</TableHead>
                <TableHead>Rehabilitation Cost (M)</TableHead>
                <TableHead>Total Cost (M)</TableHead>
                <TableHead>% of Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {divisionData.map((division, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{division.name}</TableCell>
                  <TableCell>{division.schemes}</TableCell>
                  <TableCell>{division.restorationCost.toLocaleString()}</TableCell>
                  <TableCell>{division.rehabilitationCost.toLocaleString()}</TableCell>
                  <TableCell>{division.totalCost.toLocaleString()}</TableCell>
                  <TableCell>{division.percentage.toFixed(2)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}