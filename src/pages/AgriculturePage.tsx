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
  Activity,
  Sprout,
  Eye,
  Building2,
  Ruler,
  Tractor,
  AlertTriangle
} from 'lucide-react';
import { KpiCard } from '@/components/ui/kpi-card';
import { getAgricultureImpacts, type ProcessedAgricultureData } from '@/api/agriculture';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '@/components/Layout/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
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

interface DivisionData {
  name: string;
  totalLoss: number;
}

interface SeverityData {
  name: string;
  value: number;
  color: string;
}

interface ProcessedData {
  divisionData: DivisionData[];
  districtData: ProcessedAgricultureData['districtBreakdown'];
  severityData: SeverityData[];
}

export default function AgriculturePage() {
  // Fetch agriculture data
  const { data: agricultureData, isLoading: isLoadingAgriculture } = useQuery<ProcessedAgricultureData>({
    queryKey: ['agriculture-impacts'],
    queryFn: getAgricultureImpacts
  });

  // Process data for visualizations
  const processedData = useMemo(() => {
    if (!agricultureData) return null;

    // Division-wise analysis
    const divisionData = agricultureData.divisionBreakdown
      .map(division => ({
        name: division.division,
        totalLoss: division.total_estimated_losses_million_pkr
      }))
      .sort((a, b) => b.totalLoss - a.totalLoss);

    // District-wise analysis
    const districtData = agricultureData.districtBreakdown
      .sort((a, b) => b.estimated_losses_million_pkr - a.estimated_losses_million_pkr)
      .slice(0, 10);

    // Impact severity distribution
    const severityData = [
      { name: 'High Impact (>100M PKR)', value: agricultureData.impactSeverity.highImpact, color: CHART_COLORS.danger },
      { name: 'Medium Impact (10-100M PKR)', value: agricultureData.impactSeverity.mediumImpact, color: CHART_COLORS.warning },
      { name: 'Low Impact (<10M PKR)', value: agricultureData.impactSeverity.lowImpact, color: CHART_COLORS.success },
      { name: 'No Impact', value: agricultureData.impactSeverity.noImpact, color: CHART_COLORS.info }
    ];

    return {
      divisionData,
      districtData,
      severityData
    } as ProcessedData;
  }, [agricultureData]);

  if (isLoadingAgriculture || !processedData) {
    return (
      <div className="space-y-6">
        <LoadingSpinner size="lg" text="Loading agriculture impact data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Structural Damages"
          value={agricultureData?.summary.totalStructuralDamages.toLocaleString() ?? '0'}
          icon={Building2}
          color="text-red-600"
        />
        <KpiCard
          title="Total Crop Area"
          value={`${(agricultureData?.summary.totalCropMaskAcre ?? 0).toFixed(2)} acres`}
          icon={Tractor}
          color="text-green-600"
        />
        <KpiCard
          title="Damaged Area (GIS)"
          value={`${(agricultureData?.summary.totalDamagedAreaGIS ?? 0).toFixed(2)} acres`}
          icon={AlertTriangle}
          color="text-yellow-600"
        />
        <KpiCard
          title="Estimated Losses"
          value={`PKR ${(agricultureData?.summary.totalEstimatedLossesMillionPKR ?? 0).toFixed(2)}M`}
          icon={Banknote}
          color="text-purple-600"
        />
      </div>

      {/* Additional KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Verified Area"
          value={`${(agricultureData?.summary.totalOngroundVerified ?? 0).toFixed(2)} acres`}
          icon={Ruler}
          color="text-blue-600"
        />
        <KpiCard
          title="Affected Districts"
          value={agricultureData?.summary.affectedDistricts.toLocaleString() ?? '0'}
          icon={Activity}
          color="text-orange-600"
        />
        <KpiCard
          title="High Impact Districts"
          value={agricultureData?.impactSeverity.highImpact.toLocaleString() ?? '0'}
          icon={AlertTriangle}
          color="text-red-600"
        />
        <KpiCard
          title="Medium Impact Districts"
          value={agricultureData?.impactSeverity.mediumImpact.toLocaleString() ?? '0'}
          icon={AlertTriangle}
          color="text-yellow-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Division-wise Economic Loss */}
        <ChartWrapper
          title="Division-wise Economic Loss"
          icon={Banknote}
          height={DEFAULT_CHART_HEIGHT}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={processedData.divisionData}
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
                label={{ value: 'M PKR', position: 'top', offset: 15 }}
              />
              <Tooltip formatter={TOOLTIP_FORMATTERS.currency} />
              <Legend />
              <Bar 
                dataKey="totalLoss" 
                name="Economic Loss (M PKR)" 
                fill={CHART_COLORS.danger}
              >
                <LabelList 
                  dataKey="totalLoss" 
                  content={<SmartValueLabel />} 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Impact Severity Distribution */}
        <ChartWrapper
          title="Impact Severity Distribution"
          icon={Activity}
          height={DEFAULT_CHART_HEIGHT}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={DEFAULT_PIE_MARGIN}>
              <Pie
                data={processedData.severityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                {...PIE_CONFIG}
              >
                {processedData.severityData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={processedData.severityData[index].color} />
                ))}
              </Pie>
              <Tooltip formatter={TOOLTIP_FORMATTERS.number} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="h-5 w-5" />
            District-wise Agriculture Impact Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>District</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead className="text-right">Crop Area (Acres)</TableHead>
                  <TableHead className="text-right">Estimated Loss (M PKR)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agricultureData?.districtBreakdown
                  .sort((a, b) => b.estimated_losses_million_pkr - a.estimated_losses_million_pkr)
                  .map((record) => (
                    <TableRow key={record.district}>
                      <TableCell className="font-medium">{record.district}</TableCell>
                      <TableCell>{record.division}</TableCell>
                      <TableCell className="text-right">{record.crop_mask_acre.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        PKR {record.estimated_losses_million_pkr.toLocaleString()}M
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            // Handle view details
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Selected District Details Modal */}
      {/* Add modal component for district details */}
    </div>
  );
}