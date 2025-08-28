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
  Legend,
  LabelList
} from 'recharts';
import {
  Banknote,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface CompensationFunnelProps {
  data: any; // Replace with proper type
  isLoading: boolean;
}

interface DistrictData {
  district: string;
  totalCompensation: number;
}

interface CategoryBreakdown {
  [key: string]: number;
}

interface CompensationData {
  districtBreakdown: DistrictData[];
  categoryBreakdown: CategoryBreakdown;
}

interface ProcessedData {
  totalCompensation: number;
  districtData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
}

const CHART_COLOR_ARRAY = [
  CHART_COLORS.primary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.danger,
  CHART_COLORS.info
];

export function CompensationFunnel({ data: compData, isLoading }: CompensationFunnelProps) {
  const processedData = useMemo(() => {
    if (!compData?.districtBreakdown) return null;

    // Calculate total compensation
    const totalCompensation = compData.districtBreakdown.reduce(
      (acc: number, district: DistrictData) => acc + district.totalCompensation,
      0
    );

    // Process district data
    const districtData = compData.districtBreakdown
      .sort((a: DistrictData, b: DistrictData) => b.totalCompensation - a.totalCompensation)
      .slice(0, 10)
      .map((district: DistrictData) => ({
        name: district.district,
        value: district.totalCompensation,
        percentage: ((district.totalCompensation / totalCompensation) * 100).toFixed(1)
      }));

    // Process category data
    const categoryData = Object.entries(compData.categoryBreakdown || {})
      .map(([category, amount]) => ({
        name: category,
        value: amount as number,
        percentage: ((amount as number / totalCompensation) * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value);

    return {
      totalCompensation,
      districtData,
      categoryData
    } as ProcessedData;
  }, [compData]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Loading compensation data...</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-pulse">Loading compensation and livelihood support data...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!processedData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Compensation & Livelihood Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Banknote className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Compensation Data</h3>
            <p>No compensation and livelihood support data available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <Banknote className="h-6 w-6 mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-green-600">
            {processedData.totalCompensation.toLocaleString()}
          </div>
          <div className="text-sm text-green-600">Total Compensation (PKR)</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compensation by Category */}
        <ChartWrapper
          title="Compensation by Category"
          icon={Banknote}
          height={DEFAULT_CHART_HEIGHT}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Compensation by Category</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info className="h-4 w-4" />
                <span>Breakdown of compensation disbursements</span>
              </div>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={DEFAULT_PIE_MARGIN}>
                  <Pie
                    data={processedData.categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    {...PIE_CONFIG}
                  >
                    {processedData.categoryData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLOR_ARRAY[index % CHART_COLOR_ARRAY.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={TOOLTIP_FORMATTERS.currency} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartWrapper>

        {/* Top Districts by Compensation */}
        <ChartWrapper
          title="Top Districts by Compensation"
          icon={Banknote}
          height={DEFAULT_CHART_HEIGHT}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Top Districts by Compensation</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info className="h-4 w-4" />
                <span>Districts receiving highest compensation amounts</span>
              </div>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={processedData.districtData}
                  margin={DEFAULT_MARGIN}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name"
                    {...AXIS_CONFIG.xAxis}
                    tick={<SmartTick />}
                  />
                  <YAxis 
                    {...AXIS_CONFIG.yAxis}
                    label={{ value: 'PKR', position: 'top', offset: 15 }}
                  />
                  <Tooltip formatter={TOOLTIP_FORMATTERS.currency} />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    name="Compensation Amount" 
                    fill={CHART_COLORS.success}
                  >
                    <LabelList 
                      dataKey="value" 
                      content={<SmartValueLabel />} 
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartWrapper>
      </div>

      {/* Additional Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600">
            <div>• Total compensation disbursed: {processedData.totalCompensation.toLocaleString()} PKR</div>
            <div>• {processedData.districtData.length} districts have received compensation</div>
            <div>• {processedData.categoryData.length} different compensation categories</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}