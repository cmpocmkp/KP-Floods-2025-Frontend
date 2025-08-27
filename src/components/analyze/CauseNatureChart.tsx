import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  AlertTriangle,
  Zap,
  Home,
  Droplets
} from 'lucide-react';
import { DSRAggregates } from '@/api/dsr';

interface CauseNatureChartProps {
  aggregates: DSRAggregates;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0', '#87ceeb', '#dda0dd'];

export function CauseNatureChart({ aggregates }: CauseNatureChartProps) {
  const { causeCounts, natureCounts } = aggregates;

  // Prepare cause data for visualization
  const causeData = Object.entries(causeCounts)
    .map(([cause, count]) => ({
      name: cause,
      value: count,
      percentage: ((count / Object.values(causeCounts).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Show top 8 causes

  // Prepare nature data for visualization
  const natureData = Object.entries(natureCounts)
    .map(([nature, count]) => ({
      name: nature,
      value: count,
      percentage: ((count / Object.values(natureCounts).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6); // Show top 6 natures

  // Prepare combined data for stacked bar
  const combinedData = causeData.map(cause => ({
    cause: cause.name.length > 15 ? cause.name.substring(0, 15) + '...' : cause.name,
    fullCause: cause.name,
    incidents: cause.value,
    percentage: cause.percentage
  }));

  const renderTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
      const data = props.payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{data.fullCause || data.name}</p>
          <p className="text-blue-600">Incidents: {data.incidents || data.value}</p>
          {data.percentage && <p className="text-gray-600">Share: {data.percentage}%</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Incident Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="causes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="causes" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Causes
            </TabsTrigger>
            <TabsTrigger value="nature" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Nature
            </TabsTrigger>
          </TabsList>

          <TabsContent value="causes" className="mt-6">
            <div className="space-y-6">
              {/* Bar Chart */}
              <div>
                <h4 className="text-sm font-medium mb-4">Causes Breakdown (Bar Chart)</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={combinedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="cause" />
                    <YAxis />
                    <Tooltip content={renderTooltip} />
                    <Legend />
                    <Bar dataKey="incidents" fill="#8884d8" name="Incidents" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div>
                <h4 className="text-sm font-medium mb-4">Causes Distribution (Pie Chart)</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={causeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {causeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Incidents']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="nature" className="mt-6">
            <div className="space-y-6">
              {/* Bar Chart */}
              <div>
                <h4 className="text-sm font-medium mb-4">Nature of Incidents (Bar Chart)</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={natureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [value, 'Incidents']}
                      labelFormatter={(label) => label}
                    />
                    <Legend />
                    <Bar dataKey="value" fill="#82ca9d" name="Incidents" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div>
                <h4 className="text-sm font-medium mb-4">Nature Distribution (Pie Chart)</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={natureData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {natureData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Incidents']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Summary Statistics */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{Object.keys(causeCounts).length}</div>
              <div className="text-sm text-muted-foreground">Unique Causes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{Object.keys(natureCounts).length}</div>
              <div className="text-sm text-muted-foreground">Unique Nature Types</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {causeData.length > 0 ? causeData[0].name : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Top Cause</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {natureData.length > 0 ? natureData[0].name : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Top Nature</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}