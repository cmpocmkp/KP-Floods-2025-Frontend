import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart
} from 'recharts';
import {
  Zap,
  Home,
  Wifi,
  Phone,
  Flame,
  Download,
  Info,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { DSRAggregates } from '@/api/dsr';
import { VisualizeFilters } from '@/pages/VisualizePage';
import { getServicesStatus } from '@/api/infrastructure';

interface ServicesTrendProps {
  aggregates: DSRAggregates | null;
  filters: VisualizeFilters;
  crossFilters: {
    selectedDistricts: string[];
    selectedDivisions: string[];
    selectedCategories: string[];
  };
  onCrossFilterChange: (filters: {
    selectedDistricts: string[];
    selectedDivisions: string[];
    selectedCategories: string[];
  }) => void;
}

interface ServiceData {
  service: string;
  disconnections: number;
  restorations: number;
  netDisconnects: number;
  restorationRate: number;
  icon: React.ComponentType<any>;
  color: string;
}

export function ServicesTrend({ aggregates, filters, crossFilters, onCrossFilterChange }: ServicesTrendProps) {
  const [selectedView, setSelectedView] = useState<'overview' | 'detailed'>('overview');

  // Fetch services status data
  const { data: servicesData, isLoading } = useQuery({
    queryKey: ['services-status'],
    queryFn: getServicesStatus,
  });

  // Process services data
  const servicesOverview = useMemo(() => {
    if (!servicesData?.data) return [];

    // Aggregate by service type
    const services: ServiceData[] = [
      {
        service: 'Electricity',
        disconnections: servicesData.summary.total_feeders_disconnections,
        restorations: servicesData.summary.total_feeders_restored,
        netDisconnects: servicesData.summary.total_feeders_disconnections - servicesData.summary.total_feeders_restored,
        restorationRate: servicesData.summary.total_feeders_disconnections > 0
          ? (servicesData.summary.total_feeders_restored / servicesData.summary.total_feeders_disconnections) * 100
          : 0,
        icon: Zap,
        color: '#f59e0b'
      },
      {
        service: 'Water Supply',
        disconnections: servicesData.summary.total_water_disconnections,
        restorations: servicesData.summary.total_water_restored,
        netDisconnects: servicesData.summary.total_water_disconnections - servicesData.summary.total_water_restored,
        restorationRate: servicesData.summary.total_water_disconnections > 0
          ? (servicesData.summary.total_water_restored / servicesData.summary.total_water_disconnections) * 100
          : 0,
        icon: Home,
        color: '#3b82f6'
      },
      {
        service: 'Gas Supply',
        disconnections: servicesData.summary.total_gas_disconnections,
        restorations: servicesData.summary.total_gas_restored,
        netDisconnects: servicesData.summary.total_gas_disconnections - servicesData.summary.total_gas_restored,
        restorationRate: servicesData.summary.total_gas_disconnections > 0
          ? (servicesData.summary.total_gas_restored / servicesData.summary.total_gas_disconnections) * 100
          : 0,
        icon: Flame,
        color: '#ef4444'
      },
      {
        service: 'PTCL Landline',
        disconnections: servicesData.summary.total_ptcl_disconnections,
        restorations: servicesData.summary.total_ptcl_restored,
        netDisconnects: servicesData.summary.total_ptcl_disconnections - servicesData.summary.total_ptcl_restored,
        restorationRate: servicesData.summary.total_ptcl_disconnections > 0
          ? (servicesData.summary.total_ptcl_restored / servicesData.summary.total_ptcl_disconnections) * 100
          : 0,
        icon: Phone,
        color: '#8b5cf6'
      },
      {
        service: 'Cellular',
        disconnections: servicesData.summary.total_cellular_disconnections,
        restorations: servicesData.summary.total_cellular_restored,
        netDisconnects: servicesData.summary.total_cellular_disconnections - servicesData.summary.total_cellular_restored,
        restorationRate: servicesData.summary.total_cellular_disconnections > 0
          ? (servicesData.summary.total_cellular_restored / servicesData.summary.total_cellular_disconnections) * 100
          : 0,
        icon: Wifi,
        color: '#10b981'
      }
    ];

    return services.filter(service => service.disconnections > 0 || service.restorations > 0);
  }, [servicesData]);

  // Process district-wise data for detailed view
  const districtServicesData = useMemo(() => {
    if (!servicesData?.data) return [];

    return servicesData.data.map(district => ({
      district: district.DistrictName,
      electricityDisconnections: district.TotalFeedersDisconnections,
      electricityRestorations: district.TotalFeedersRestored,
      waterDisconnections: district.TotalWaterDisconnections,
      waterRestorations: district.TotalWaterRestored,
      gasDisconnections: district.TotalGasDisconnections,
      gasRestorations: district.TotalGasRestored,
      ptclDisconnections: district.TotalPTCLDisconnections,
      ptclRestorations: district.TotalPTCLRestored,
      cellularDisconnections: district.TotalCellularDisconnections,
      cellularRestorations: district.TotalCellularRestored,
      totalDisconnections: district.TotalFeedersDisconnections + district.TotalWaterDisconnections +
                          district.TotalGasDisconnections + district.TotalPTCLDisconnections +
                          district.TotalCellularDisconnections,
      totalRestorations: district.TotalFeedersRestored + district.TotalWaterRestored +
                        district.TotalGasRestored + district.TotalPTCLRestored +
                        district.TotalCellularRestored
    })).filter(d => d.totalDisconnections > 0)
      .sort((a, b) => b.totalDisconnections - a.totalDisconnections)
      .slice(0, 10);
  }, [servicesData]);

  // Handle CSV export
  const handleExportCSV = () => {
    const headers = ['Service', 'Disconnections', 'Restorations', 'Net Disconnects', 'Restoration Rate (%)'];
    const csvContent = [
      headers.join(','),
      ...servicesOverview.map(service => [
        `"${service.service}"`,
        service.disconnections,
        service.restorations,
        service.netDisconnects,
        service.restorationRate.toFixed(1)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'services_reliability_analysis.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Services Reliability Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-muted-foreground">Loading services data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!servicesOverview.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Services Reliability Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Zap className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Services Data</h3>
            <p>No essential services disruption data available for the selected period.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Services Reliability Trends
            <Badge variant="outline" className="ml-2">
              {servicesOverview.length} services
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedView === 'overview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('overview')}
            >
              Overview
            </Button>
            <Button
              variant={selectedView === 'detailed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('detailed')}
            >
              By District
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-1" />
              CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Service Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {servicesOverview.map((service, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <service.icon className="h-6 w-6 mx-auto mb-2" style={{ color: service.color }} />
                <div className="text-sm font-medium text-gray-900 mb-1">{service.service}</div>
                <div className="text-lg font-bold" style={{ color: service.color }}>
                  {service.netDisconnects.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">
                  {service.restorationRate.toFixed(0)}% restored
                </div>
              </div>
            ))}
          </div>

          {selectedView === 'overview' ? (
            <>
              {/* Disconnections vs Restorations Chart */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Service Disruptions Overview</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Info className="h-4 w-4" />
                    <span>Disconnections vs Restorations by Service</span>
                  </div>
                </div>
                {servicesOverview.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart data={servicesOverview} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="service" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value, name) => [value, name]}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Legend />
                      <Bar
                        dataKey="disconnections"
                        fill="#ef4444"
                        name="Disconnections"
                        radius={[2, 2, 0, 0]}
                        yAxisId="left"
                      />
                      <Bar
                        dataKey="restorations"
                        fill="#22c55e"
                        name="Restorations"
                        radius={[2, 2, 0, 0]}
                        yAxisId="left"
                      />
                      <Line
                        type="monotone"
                        dataKey="restorationRate"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        name="Restoration Rate (%)"
                        yAxisId="right"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[350px] text-gray-500">
                    <div className="text-center">
                      <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No services data available</p>
                      <p className="text-sm">Services disruptions will appear here when data is available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Critical Services Alert */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-2">Critical Services Status</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-orange-700">Electricity: </span>
                        <span className="font-medium">
                          {servicesOverview.find(s => s.service === 'Electricity')?.netDisconnects.toLocaleString() || 0} feeders still disconnected
                        </span>
                      </div>
                      <div>
                        <span className="text-orange-700">Water Supply: </span>
                        <span className="font-medium">
                          {servicesOverview.find(s => s.service === 'Water Supply')?.netDisconnects.toLocaleString() || 0} connections affected
                        </span>
                      </div>
                      <div>
                        <span className="text-orange-700">Communication: </span>
                        <span className="font-medium">
                          {((servicesOverview.find(s => s.service === 'PTCL Landline')?.netDisconnects || 0) +
                            (servicesOverview.find(s => s.service === 'Cellular')?.netDisconnects || 0)).toLocaleString()} lines disconnected
                        </span>
                      </div>
                      <div>
                        <span className="text-orange-700">Gas Supply: </span>
                        <span className="font-medium">
                          {servicesOverview.find(s => s.service === 'Gas Supply')?.netDisconnects.toLocaleString() || 0} connections disrupted
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* District-wise Detailed View */
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">District-wise Service Disruptions</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Info className="h-4 w-4" />
                  <span>Top 10 districts by total disconnections</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={districtServicesData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="district"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label) => `District: ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="electricityDisconnections"
                    stackId="disconnections"
                    fill="#f59e0b"
                    name="Electricity Feeder Disconnections"
                  />
                  <Bar
                    dataKey="waterDisconnections"
                    stackId="disconnections"
                    fill="#3b82f6"
                    name="Water Disconnections"
                  />
                  <Bar
                    dataKey="gasDisconnections"
                    stackId="disconnections"
                    fill="#ef4444"
                    name="Gas Disconnections"
                  />
                  <Bar
                    dataKey="ptclDisconnections"
                    stackId="disconnections"
                    fill="#8b5cf6"
                    name="PTCL Disconnections"
                  />
                  <Bar
                    dataKey="cellularDisconnections"
                    stackId="disconnections"
                    fill="#10b981"
                    name="Cellular Disconnections"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Service Reliability Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600 mb-1">
                {Math.round(servicesOverview.reduce((sum, s) => sum + s.restorationRate, 0) / servicesOverview.length)}%
              </div>
              <div className="text-sm text-gray-700">Average Restoration Rate</div>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {servicesOverview.reduce((sum, s) => sum + s.netDisconnects, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-700">Total Outstanding Disconnects</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {servicesOverview.filter(s => s.restorationRate > 50).length}
              </div>
              <div className="text-sm text-gray-700">Services with &gt;50% Restoration</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}