import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Info,
  Download,
  Target
} from 'lucide-react';
import { DSRAggregates, SeverityWeights } from '@/api/dsr';
import { VisualizeFilters } from '@/pages/VisualizePage';
import { getInfrastructureDamage } from '@/api/infrastructure';

interface SeverityMapProps {
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

interface DistrictData {
  district: string;
  severity: number;
  deaths: number;
  injured: number;
  housesFull: number;
  housesPartial: number;
  schools: number;
  other: number;
  cattle: number;
  infrastructureDamage: number;
  compensationAmount: number;
}

export function SeverityMap({ aggregates, filters, crossFilters, onCrossFilterChange }: SeverityMapProps) {
  // Fetch infrastructure damage data
  const { data: infraData, isLoading: isLoadingInfra } = useQuery({
    queryKey: ['infrastructure-damage'],
    queryFn: getInfrastructureDamage,
  });

  // Calculate severity scores for each district
  const districtData = useMemo(() => {
    if (!aggregates) return [];

    const severityWeights: SeverityWeights = {
      death: 1.0,
      inj: 0.25,
      full: 0.6,
      part: 0.25,
      school: 0.5,
      other: 0.1,
      cattle: 0.05
    };

    return aggregates.severityRecords.map(record => {
      const infraRecord = infraData?.data.find(d =>
        d.DistrictName && record.district &&
        d.DistrictName.toLowerCase() === record.district.toLowerCase()
      );

      const severity = record.deaths * severityWeights.death +
                      record.injured * severityWeights.inj +
                      record.housesFull * severityWeights.full +
                      record.housesPartial * severityWeights.part +
                      record.schools * severityWeights.school +
                      record.other * severityWeights.other +
                      record.cattle * severityWeights.cattle;

      return {
        district: record.district || 'Unknown District',
        severity: Math.round(severity * 100) / 100,
        deaths: record.deaths || 0,
        injured: record.injured || 0,
        housesFull: record.housesFull || 0,
        housesPartial: record.housesPartial || 0,
        schools: record.schools || 0,
        other: record.other || 0,
        cattle: record.cattle || 0,
        infrastructureDamage: infraRecord ? infraRecord.HousesFullyDamaged + infraRecord.HousesPartiallyDamaged : 0,
        compensationAmount: 0 // Will be calculated from compensation data
      };
    }).sort((a, b) => b.severity - a.severity);
  }, [aggregates, infraData]);

  // Get severity color based on score
  const getSeverityColor = useCallback((severity: number) => {
    if (severity >= 100) return 'text-red-600 bg-red-50';
    if (severity >= 50) return 'text-orange-600 bg-orange-50';
    if (severity >= 20) return 'text-yellow-600 bg-yellow-50';
    if (severity >= 5) return 'text-green-600 bg-green-50';
    return 'text-gray-600 bg-gray-50';
  }, []);

  // Handle district click for cross-filtering
  const handleDistrictClick = useCallback((districtName: string) => {
    const newSelectedDistricts = crossFilters.selectedDistricts.includes(districtName)
      ? crossFilters.selectedDistricts.filter(d => d !== districtName)
      : [...crossFilters.selectedDistricts, districtName];

    onCrossFilterChange({
      ...crossFilters,
      selectedDistricts: newSelectedDistricts
    });
  }, [crossFilters, onCrossFilterChange]);

  const handleExportCSV = () => {
    const headers = ['District', 'Severity Score', 'Deaths', 'Injured', 'Houses Full', 'Houses Partial', 'Schools', 'Cattle', 'Infrastructure Damage'];
    const csvContent = [
      headers.join(','),
      ...districtData.map(row => [
        `"${row.district}"`,
        row.severity,
        row.deaths,
        row.injured,
        row.housesFull,
        row.housesPartial,
        row.schools,
        row.cattle,
        row.infrastructureDamage
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'district_severity_map.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoadingInfra) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            District Severity Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-muted-foreground">Loading district data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!districtData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            District Severity Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No District Data</h3>
            <p>No district severity data available for visualization.</p>
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
            District Severity Map
            <Badge variant="outline" className="ml-2">
              {districtData.length} districts
            </Badge>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-1" />
            CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* District Severity Heatmap (Table-based) */}
          <div>
            <h3 className="text-lg font-semibold mb-4">District Severity Ranking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {districtData.slice(0, 12).map((district, index) => (
                <div
                  key={district.district}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    crossFilters.selectedDistricts.includes(district.district)
                      ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleDistrictClick(district.district)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{district.district}</span>
                    <Badge className={`${getSeverityColor(district.severity)} border-0 text-xs`}>
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Severity:</span>
                      <span className="font-semibold text-red-600">{district.severity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deaths:</span>
                      <span className="font-medium">{district.deaths}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Houses:</span>
                      <span className="font-medium">{district.housesFull + district.housesPartial}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Severity Scale */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Severity Scale</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { range: '≥100', label: 'Critical', color: 'bg-red-600' },
                { range: '50-99', label: 'High', color: 'bg-orange-600' },
                { range: '20-49', label: 'Medium', color: 'bg-yellow-600' },
                { range: '5-19', label: 'Low', color: 'bg-green-600' },
                { range: '<5', label: 'Minimal', color: 'bg-gray-600' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className={`w-full h-3 rounded ${item.color} mb-1`}></div>
                  <div className="text-xs font-medium text-gray-900" dangerouslySetInnerHTML={{ __html: item.range }}></div>
                  <div className="text-xs text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <Target className="h-6 w-6 mx-auto mb-2 text-red-600" />
              <div className="text-xl font-bold text-red-600">
                {districtData.filter(d => d.severity >= 100).length}
              </div>
              <div className="text-xs text-gray-600">Critical Districts</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-xl font-bold text-orange-600">
                {districtData.filter(d => d.severity >= 50 && d.severity < 100).length}
              </div>
              <div className="text-xs text-gray-600">High Impact</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">
                {Math.round(districtData.reduce((sum, d) => sum + d.severity, 0) / districtData.length * 100) / 100}
              </div>
              <div className="text-xs text-gray-600">Avg Severity</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">
                {districtData.filter(d => d.severity > 0).length}
              </div>
              <div className="text-xs text-gray-600">Affected Districts</div>
            </div>
          </div>

          {/* Active Filters */}
          {crossFilters.selectedDistricts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Filtered districts:</span>
              {crossFilters.selectedDistricts.map(district => (
                <Badge
                  key={district}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleDistrictClick(district)}
                >
                  {district} ×
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}