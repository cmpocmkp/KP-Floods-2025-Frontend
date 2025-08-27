import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Download, BarChart3, Target } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell
} from 'recharts';

interface DistrictImpactComparisonProps {
  aggregates: any;
}

export function DistrictImpactComparison({ aggregates }: DistrictImpactComparisonProps) {
  // Process district comparison data
  const districtComparisonData = useMemo(() => {
    if (!aggregates?.severityRecords) return [];

    return aggregates.severityRecords
      .filter(record => record.district && record.district !== 'Unknown District')
      .slice(0, 8) // Top 8 districts
      .map(record => ({
        district: record.district,
        deaths: record.deaths || 0,
        injured: record.injured || 0,
        housesFull: record.housesFull || 0,
        housesPartial: record.housesPartial || 0,
        schools: record.schools || 0,
        cattle: record.cattle || 0,
        severity: record.severity || 0,
        totalCasualties: (record.deaths || 0) + (record.injured || 0),
        totalDamage: (record.housesFull || 0) + (record.housesPartial || 0)
      }))
      .sort((a, b) => b.severity - a.severity);
  }, [aggregates]);

  const radarData = useMemo(() => {
    if (!districtComparisonData.length) return [];

    return districtComparisonData.slice(0, 5).map(district => ({
      district: district.district.length > 10
        ? district.district.substring(0, 10) + '...'
        : district.district,
      deaths: district.deaths || 0,
      injured: district.injured || 0,
      houses: district.totalDamage || 0,
      schools: district.schools || 0,
      cattle: district.cattle || 0
    }));
  }, [districtComparisonData]);

  const handleExportCSV = () => {
    const headers = ['District', 'Deaths', 'Injured', 'Houses Full', 'Houses Partial', 'Schools', 'Cattle', 'Severity', 'Total Casualties', 'Total Damage'];
    const csvContent = [
      headers.join(','),
      ...districtComparisonData.map(row => [
        `"${row.district}"`,
        row.deaths,
        row.injured,
        row.housesFull,
        row.housesPartial,
        row.schools,
        row.cattle,
        row.severity.toFixed(2),
        row.totalCasualties,
        row.totalDamage
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'district_comparison_analysis.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!districtComparisonData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            District Impact Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No District Data</h3>
            <p>District comparison analysis will appear here when data is available.</p>
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
            <MapPin className="h-5 w-5" />
            District Impact Comparison
            <Badge variant="outline" className="ml-2">
              {districtComparisonData.length} districts
            </Badge>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-1" />
            CSV
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Compare disaster impact across districts with multi-dimensional analysis
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Casualty Comparison */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Casualty Distribution by District</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={districtComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                <Bar dataKey="deaths" fill="#dc2626" name="Deaths" radius={[2, 2, 0, 0]} />
                <Bar dataKey="injured" fill="#ea580c" name="Injured" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Housing Damage Comparison */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Housing Damage by District</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={districtComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                <Bar dataKey="housesFull" fill="#2563eb" name="Fully Damaged" radius={[2, 2, 0, 0]} />
                <Bar dataKey="housesPartial" fill="#60a5fa" name="Partially Damaged" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Multi-dimensional Radar Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Impact Profile Comparison (Top 5 Districts)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="district" />
                <PolarRadiusAxis angle={90} domain={[0, 'dataMax']} />
                <Radar
                  name="Deaths"
                  dataKey="deaths"
                  stroke="#dc2626"
                  fill="#dc2626"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Houses"
                  dataKey="houses"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Radar
                  name="Cattle"
                  dataKey="cattle"
                  stroke="#16a34a"
                  fill="#16a34a"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* District Impact Summary Cards */}
          <div>
            <h3 className="text-lg font-semibold mb-4">District Impact Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {districtComparisonData.slice(0, 6).map((district, index) => (
                <div key={district.district} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{district.district}</h4>
                    <Badge
                      variant={index === 0 ? "destructive" : index < 3 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Casualties:</span>
                      <span className="font-medium text-red-600">{district.totalCasualties}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Housing Damage:</span>
                      <span className="font-medium text-blue-600">{district.totalDamage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Schools Affected:</span>
                      <span className="font-medium text-purple-600">{district.schools}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Livestock Lost:</span>
                      <span className="font-medium text-green-600">{district.cattle}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between font-semibold">
                        <span>Severity Score:</span>
                        <span className="text-orange-600">{district.severity.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}