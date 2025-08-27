import { useState, useMemo } from 'react';
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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  DollarSign,
  Download,
  Info,
  CheckCircle
} from 'lucide-react';
import { VisualizeFilters } from '@/pages/VisualizePage';
import { getCompensationSummary } from '@/api/compensation';

interface CompensationFunnelProps {
  compensationData?: any;
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

export function CompensationFunnel({ compensationData, filters, crossFilters, onCrossFilterChange }: CompensationFunnelProps) {
  const [selectedView, setSelectedView] = useState<'overview' | 'districts'>('overview');

  // Fetch compensation data
  const { data: compData, isLoading } = useQuery({
    queryKey: ['compensation-summary'],
    queryFn: getCompensationSummary,
  });

  // Process compensation data for charts
  const compensationOverview = useMemo(() => {
    if (!compData?.districtBreakdown) return null;

    // Aggregate by category across all districts
    const categoryTotals = compData.districtBreakdown.reduce((acc, district) => {
      acc.casualties += district.casualties.deathCompensation + district.casualties.injuryCompensation;
      acc.property += district.property.houseCompensation;
      acc.livestock += district.livestock.cattleCompensation;
      acc.business += district.business.businessCompensation;
      acc.agricultural += district.agricultural.cropsCompensation + district.agricultural.orchardsCompensation;
      acc.support += district.support.familyRationSupport;
      return acc;
    }, { casualties: 0, property: 0, livestock: 0, business: 0, agricultural: 0, support: 0 });

    return {
      categories: [
        { name: 'Casualties', value: categoryTotals.casualties, color: '#dc2626' },
        { name: 'Property', value: categoryTotals.property, color: '#2563eb' },
        { name: 'Business', value: categoryTotals.business, color: '#ea580c' },
        { name: 'Agricultural', value: categoryTotals.agricultural, color: '#16a34a' },
        { name: 'Livestock', value: categoryTotals.livestock, color: '#7c3aed' },
        { name: 'Support', value: categoryTotals.support, color: '#0891b2' }
      ].filter(cat => cat.value > 0),
      districtBreakdown: compData.districtBreakdown
        .sort((a, b) => b.totalCompensation - a.totalCompensation)
        .slice(0, 10)
        .map(district => ({
          district: district.district,
          totalCompensation: district.totalCompensation,
          casualties: district.casualties.deathCompensation + district.casualties.injuryCompensation,
          property: district.property.houseCompensation,
          business: district.business.businessCompensation,
          agricultural: district.agricultural.cropsCompensation + district.agricultural.orchardsCompensation,
          livestock: district.livestock.cattleCompensation,
          support: district.support.familyRationSupport
        }))
    };
  }, [compData]);

  // Handle CSV export
  const handleExportCSV = () => {
    if (!compensationOverview) return;

    const headers = ['Category', 'Compensation Amount (PKR)'];
    const csvContent = [
      headers.join(','),
      ...compensationOverview.categories.map(cat => [`"${cat.name}"`, cat.value].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'compensation_analysis.csv');
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
            <DollarSign className="h-5 w-5" />
            Compensation & Livelihood Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-muted-foreground">Loading compensation data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!compensationOverview || compensationOverview.categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Compensation & Livelihood Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <DollarSign className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Compensation Data</h3>
            <p>No compensation and livelihood support data available.</p>
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
            <DollarSign className="h-5 w-5" />
            Compensation & Livelihood Support
            <Badge variant="outline" className="ml-2">
              {compData?.districtBreakdown?.length || 0} districts
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
              variant={selectedView === 'districts' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('districts')}
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
          {/* Summary Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-xl font-bold text-green-600">
                {(compData?.totalCompensation || 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Total Compensation</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">
                {(compData?.totalDeaths || 0) + (compData?.totalInjured || 0)}
              </div>
              <div className="text-xs text-gray-600">Affected People</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">
                {compData?.totalHousesDamaged?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-gray-600">Houses Damaged</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-xl font-bold text-orange-600">
                {compData?.totalCattleLost?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-gray-600">Livestock Lost</div>
            </div>
          </div>

          {/* Compensation Category Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Compensation by Category</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info className="h-4 w-4" />
                <span>Breakdown of compensation disbursements</span>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={compensationOverview.categories}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {compensationOverview.categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} PKR`, 'Compensation']} />
                </PieChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={compensationOverview.categories} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} PKR`, 'Compensation']} />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Districts by Compensation */}
          {selectedView === 'districts' && compensationOverview.districtBreakdown.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Top Districts by Compensation</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Info className="h-4 w-4" />
                  <span>Districts receiving highest compensation amounts</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={compensationOverview.districtBreakdown} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="district"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} PKR`, 'Compensation']} />
                  <Bar
                    dataKey="totalCompensation"
                    fill="#10b981"
                    name="Total Compensation"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Compensation Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Compensation Processing Status</h4>
                <div className="text-sm text-blue-700">
                  <div>• Total compensation disbursed: {compData?.totalCompensation?.toLocaleString() || 0} PKR</div>
                  <div>• Beneficiaries covered: {(compData?.totalDeaths || 0) + (compData?.totalInjured || 0)} individuals</div>
                  <div>• Districts covered: {compData?.totalDistricts || 0}</div>
                  <div>• Processing completed for all eligible cases</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}