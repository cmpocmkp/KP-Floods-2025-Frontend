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
  ComposedChart,
  Line,
  Legend,
  Brush,
  LabelList
} from 'recharts';
import {
  Building2,
  Banknote,
  AlertTriangle,
  CheckCircle,
  Users
} from 'lucide-react';
import { KpiCard } from '@/components/ui/kpi-card';
import type { LocalGovtData } from '@/api/infrastructure';
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
import ChartWrapper from '@/components/charts/ChartWrapper';
import SmartTick from '@/components/charts/SmartTick';
import SmartValueLabel from '@/components/charts/SmartValueLabel';
import { 
  DEFAULT_CHART_HEIGHT, 
  DEFAULT_MARGIN, 
  DEFAULT_PIE_MARGIN,
  AXIS_CONFIG,
  PIE_CONFIG,
  TOOLTIP_FORMATTERS,
  CHART_COLORS
} from '@/components/charts/chartConfig';

interface LocalGovtTabProps {
  data: LocalGovtData[];
  summary: {
    total_districts: number;
    total_records: number;
    total_damaged_area_sqm: number;
    total_restoration_cost_m: number;
    total_rehabilitation_cost_m: number;
    total_fully_restored: number;
    total_partially_restored: number;
    total_not_restored: number;
    total_washed_away: number;
  };
}

export function LocalGovtTab({ data, summary }: LocalGovtTabProps) {
  // Process data for visualizations
  const processedData = useMemo(() => {
    if (!data) return null;

    // Top districts by damage area
    const topDamagedDistricts = [...data]
      .sort((a, b) => b.total_damaged_area_sqm - a.total_damaged_area_sqm)
      .slice(0, 10);

    // Restoration status data
    const restorationStatusData = [
      { name: 'Fully Restored', value: summary.total_fully_restored, color: CHART_COLORS.success },
      { name: 'Partially Restored', value: summary.total_partially_restored, color: CHART_COLORS.warning },
      { name: 'Not Restored', value: summary.total_not_restored, color: CHART_COLORS.danger },
      { name: 'Washed Away', value: summary.total_washed_away, color: CHART_COLORS.info }
    ];

    // Cost analysis data
    const costAnalysisData = data
      .filter(item => item.total_restoration_cost_m > 0 || item.total_rehabilitation_cost_m > 0)
      .map(item => ({
        district: item.district,
        restoration_cost: item.total_restoration_cost_m,
        rehabilitation_cost: item.total_rehabilitation_cost_m,
        total_cost: item.total_restoration_cost_m + item.total_rehabilitation_cost_m,
        damaged_area: item.total_damaged_area_sqm
      }))
      .sort((a, b) => b.total_cost - a.total_cost)
      .slice(0, 10);

    // Infrastructure types analysis
    const infrastructureTypesData = data.reduce((acc, item) => {
      Object.entries(item.infrastructure_types).forEach(([type, count]) => {
        acc[type] = (acc[type] || 0) + count;
      });
      return acc;
    }, {} as Record<string, number>);

    const infrastructureTypesChartData = Object.entries(infrastructureTypesData)
      .map(([type, count]) => ({ name: type, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    return {
      topDamagedDistricts,
      restorationStatusData,
      costAnalysisData,
      infrastructureTypesChartData
    };
  }, [data, summary]);

  if (!processedData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Loading Local Government data...</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-pulse">Loading local government infrastructure data...</div>
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
          title="Total Districts"
          value={summary.total_districts}
          icon={Building2}
          color="blue"
        />
        <KpiCard
          title="Total Records"
          value={summary.total_records}
          icon={AlertTriangle}
          color="orange"
        />
        <KpiCard
          title="Damaged Area (sqm)"
          value={summary.total_damaged_area_sqm}
          icon={AlertTriangle}
          color="red"
        />
        <KpiCard
          title="Total Cost (M PKR)"
          value={summary.total_restoration_cost_m + summary.total_rehabilitation_cost_m}
          icon={Banknote}
          color="green"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Districts by Damage Area */}
        <ChartWrapper
          title="Top Districts by Damaged Area"
          icon={AlertTriangle}
          height={DEFAULT_CHART_HEIGHT}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={processedData.topDamagedDistricts}
              margin={DEFAULT_MARGIN}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="district"
                {...AXIS_CONFIG.xAxis}
                tick={<SmartTick />}
              />
              <YAxis 
                {...AXIS_CONFIG.yAxis}
                label={{ value: 'sqm', position: 'top', offset: 15 }}
              />
              <Tooltip formatter={TOOLTIP_FORMATTERS.number} />
              <Legend />
              <Bar 
                dataKey="total_damaged_area_sqm" 
                name="Damaged Area (sqm)" 
                fill={CHART_COLORS.danger}
              >
                <LabelList 
                  dataKey="total_damaged_area_sqm" 
                  content={<SmartValueLabel />} 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Restoration Status */}
        <ChartWrapper
          title="Infrastructure Restoration Status"
          icon={CheckCircle}
          height={DEFAULT_CHART_HEIGHT}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={DEFAULT_PIE_MARGIN}>
              <Pie
                data={processedData.restorationStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                {...PIE_CONFIG}
              >
                {processedData.restorationStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={TOOLTIP_FORMATTERS.number} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Cost Analysis */}
        <ChartWrapper
          title="Restoration Cost Analysis"
          icon={Banknote}
          height={DEFAULT_CHART_HEIGHT}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart 
              data={processedData.costAnalysisData}
              margin={DEFAULT_MARGIN}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="district"
                {...AXIS_CONFIG.xAxis}
                tick={<SmartTick />}
              />
              <YAxis 
                {...AXIS_CONFIG.yAxis}
                label={{ value: 'M PKR', position: 'top', offset: 15 }}
              />
              <Tooltip formatter={TOOLTIP_FORMATTERS.currency} />
              <Legend />
              <Bar 
                dataKey="restoration_cost" 
                fill={CHART_COLORS.primary} 
                name="Restoration Cost"
              >
                <LabelList 
                  dataKey="restoration_cost" 
                  content={<SmartValueLabel />} 
                />
              </Bar>
              <Bar 
                dataKey="rehabilitation_cost" 
                fill={CHART_COLORS.success} 
                name="Rehabilitation Cost"
              >
                <LabelList 
                  dataKey="rehabilitation_cost" 
                  content={<SmartValueLabel />} 
                />
              </Bar>
              <Line 
                type="monotone" 
                dataKey="total_cost" 
                stroke={CHART_COLORS.danger} 
                strokeWidth={2} 
                name="Total Cost" 
              />
              {processedData.costAnalysisData.length > 8 && (
                <Brush dataKey="district" height={30} stroke={CHART_COLORS.info} />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Infrastructure Types */}
        <ChartWrapper
          title="Infrastructure Types Affected"
          icon={Building2}
          height={DEFAULT_CHART_HEIGHT}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={processedData.infrastructureTypesChartData}
              margin={DEFAULT_MARGIN}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" {...AXIS_CONFIG.yAxis} />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={150}
                tick={<SmartTick max={20} angle={0} textAnchor="end" />}
              />
              <Tooltip formatter={TOOLTIP_FORMATTERS.number} />
              <Legend />
              <Bar 
                dataKey="value" 
                name="Infrastructure Count" 
                fill={CHART_COLORS.info}
              >
                <LabelList 
                  dataKey="value" 
                  content={<SmartValueLabel position="right" />} 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Local Government Infrastructure Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>District</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead className="text-right">Total Records</TableHead>
                  <TableHead className="text-right">Damaged Area (sqm)</TableHead>
                  <TableHead className="text-right">Restoration Cost (M PKR)</TableHead>
                  <TableHead className="text-right">Rehabilitation Cost (M PKR)</TableHead>
                  <TableHead className="text-right">Fully Restored</TableHead>
                  <TableHead className="text-right">Partially Restored</TableHead>
                  <TableHead className="text-right">Not Restored</TableHead>
                  <TableHead className="text-right">Washed Away</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => {
                  const totalRestored = item.restoration_status.fully_restored + item.restoration_status.partially_restored;
                  const restorationPercentage = item.total_records > 0 
                    ? (totalRestored / item.total_records * 100).toFixed(1)
                    : 0;
                  
                  return (
                    <TableRow key={item.district}>
                      <TableCell className="font-medium">{item.district}</TableCell>
                      <TableCell>{item.division}</TableCell>
                      <TableCell className="text-right">{item.total_records}</TableCell>
                      <TableCell className="text-right">{item.total_damaged_area_sqm.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.total_restoration_cost_m.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.total_rehabilitation_cost_m.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.restoration_status.fully_restored}</TableCell>
                      <TableCell className="text-right">{item.restoration_status.partially_restored}</TableCell>
                      <TableCell className="text-right">{item.restoration_status.not_restored}</TableCell>
                      <TableCell className="text-right">{item.restoration_status.washed_away}</TableCell>
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