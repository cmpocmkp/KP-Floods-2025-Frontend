import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Target,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Filter,
  Settings
} from 'lucide-react';
import { DSRAggregates, SeverityWeights } from '@/api/dsr';
import { VisualizeFilters } from '@/pages/VisualizePage';
import { getInfrastructureDamage } from '@/api/infrastructure';
import { getCompensationSummary } from '@/api/compensation';
import { getAgricultureImpacts } from '@/api/agriculture';
import { getLivestockSummary } from '@/api/livestock';

interface SeverityTableProps {
  aggregates: DSRAggregates | null;
  weights: SeverityWeights;
  onWeightsChange: (weights: SeverityWeights) => void;
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

interface DistrictRow {
  district: string;
  severity: number;
  rank: number;
  deaths: number;
  injured: number;
  housesFull: number;
  housesPartial: number;
  totalHouses: number;
  schools: number;
  other: number;
  cattle: number;
  infrastructureDamage: number;
  compensationAmount: number;
  agricultureLoss: number;
  livestockLoss: number;
}

type SortField = 'district' | 'severity' | 'deaths' | 'injured' | 'housesFull' | 'housesPartial' | 'schools' | 'cattle' | 'infrastructureDamage' | 'compensationAmount';

export function SeverityTable({ aggregates, weights, onWeightsChange, crossFilters, onCrossFilterChange }: SeverityTableProps) {
  const [sortField, setSortField] = useState<SortField>('severity');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showTop, setShowTop] = useState<number>(10);

  // Fetch additional data for comprehensive table
  const { data: infraData } = useQuery({
    queryKey: ['infrastructure-damage'],
    queryFn: getInfrastructureDamage,
  });

  const { data: compensationData } = useQuery({
    queryKey: ['compensation-summary'],
    queryFn: getCompensationSummary,
  });

  const { data: agricultureData } = useQuery({
    queryKey: ['agriculture-impacts'],
    queryFn: getAgricultureImpacts,
  });

  const { data: livestockData } = useQuery({
    queryKey: ['livestock-summary'],
    queryFn: getLivestockSummary,
  });

  // Calculate comprehensive district data
  const districtRows = useMemo(() => {
    if (!aggregates) return [];

    return aggregates.severityRecords.map((record, index) => {
      // Calculate severity score
      const severity = record.deaths * weights.death +
                      record.injured * weights.inj +
                      record.housesFull * weights.full +
                      record.housesPartial * weights.part +
                      record.schools * weights.school +
                      record.other * weights.other +
                      record.cattle * weights.cattle;

      // Find matching infrastructure data
      const infraRecord = infraData?.data.find(d =>
        d.DistrictName && record.district &&
        d.DistrictName.toLowerCase() === record.district.toLowerCase()
      );

      // Find matching compensation data
      const compRecord = compensationData?.districtBreakdown.find(d =>
        d.district && record.district &&
        d.district.toLowerCase() === record.district.toLowerCase()
      );

      // Find matching agriculture data
      const agriRecord = agricultureData?.districtBreakdown.find(d =>
        d.district && record.district &&
        d.district.toLowerCase() === record.district.toLowerCase()
      );

      // Find matching livestock data
      const livestockRecord = livestockData?.districtsWithLosses.find(d =>
        d.district && record.district &&
        d.district.toLowerCase() === record.district.toLowerCase()
      );

      return {
        district: record.district || 'Unknown District',
        severity: Math.round(severity * 100) / 100,
        rank: index + 1,
        deaths: record.deaths || 0,
        injured: record.injured || 0,
        housesFull: record.housesFull || 0,
        housesPartial: record.housesPartial || 0,
        totalHouses: (record.housesFull || 0) + (record.housesPartial || 0),
        schools: record.schools || 0,
        other: record.other || 0,
        cattle: record.cattle || 0,
        infrastructureDamage: infraRecord ? infraRecord.HousesFullyDamaged + infraRecord.HousesPartiallyDamaged : 0,
        compensationAmount: compRecord ? compRecord.totalCompensation : 0,
        agricultureLoss: agriRecord ? agriRecord.estimated_losses_million_pkr : 0,
        livestockLoss: livestockRecord ? livestockRecord.cattles_perished : 0
      };
    }).sort((a, b) => {
      if (sortField === 'district') {
        const aDistrict = a.district || '';
        const bDistrict = b.district || '';
        return sortDirection === 'asc'
          ? aDistrict.localeCompare(bDistrict)
          : bDistrict.localeCompare(aDistrict);
      }
      const aValue = a[sortField] || 0;
      const bValue = b[sortField] || 0;
      return sortDirection === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    });
  }, [aggregates, weights, infraData, compensationData, agricultureData, livestockData, sortField, sortDirection]);

  // Handle sorting
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  }, [sortField, sortDirection]);

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

  // Get severity color and label
  const getSeverityColor = useCallback((severity: number) => {
    if (severity >= 100) return 'text-red-600 bg-red-50';
    if (severity >= 50) return 'text-orange-600 bg-orange-50';
    if (severity >= 20) return 'text-yellow-600 bg-yellow-50';
    if (severity >= 5) return 'text-green-600 bg-green-50';
    return 'text-gray-600 bg-gray-50';
  }, []);

  const getSeverityLabel = useCallback((severity: number) => {
    if (severity >= 100) return 'Critical';
    if (severity >= 50) return 'High';
    if (severity >= 20) return 'Medium';
    if (severity >= 5) return 'Low';
    return 'Minimal';
  }, []);

  // Handle CSV export
  const handleExportCSV = () => {
    const headers = ['Rank', 'District', 'Severity', 'Deaths', 'Injured', 'Houses Full', 'Houses Partial', 'Schools', 'Cattle', 'Infrastructure Damage', 'Compensation (PKR)', 'Agriculture Loss (M PKR)', 'Livestock Loss'];
    const csvContent = [
      headers.join(','),
      ...districtRows.slice(0, showTop).map(row => [
        row.rank,
        `"${row.district}"`,
        row.severity,
        row.deaths,
        row.injured,
        row.housesFull,
        row.housesPartial,
        row.schools,
        row.cattle,
        row.infrastructureDamage,
        row.compensationAmount,
        row.agricultureLoss,
        row.livestockLoss
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'district_severity_ranking.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-1 font-medium text-left justify-start hover:bg-gray-100"
    >
      {children}
      {sortField === field ? (
        sortDirection === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
      ) : (
        <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
      )}
    </Button>
  );

  if (!aggregates) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            District Severity Ranking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No severity data available for the selected period.
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
            <Target className="h-5 w-5" />
            District Severity Ranking
          </CardTitle>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Show Top {showTop}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[10, 20, 50, 100].map(count => (
                  <Button
                    key={count}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTop(count)}
                    className="w-full justify-start"
                  >
                    Top {count}
                  </Button>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-1" />
              CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Weights Indicator */}
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <Settings className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-600">
              Weights: Deaths({weights.death}) • Injured({weights.inj}) • Houses Full({weights.full}) • Houses Partial({weights.part}) • Schools({weights.school}) • Other({weights.other}) • Cattle({weights.cattle})
            </span>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>
                    <SortButton field="district">District</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton field="severity">Severity</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton field="deaths">Deaths</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton field="injured">Injured</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton field="housesFull">Houses Full</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton field="housesPartial">Houses Partial</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton field="schools">Schools</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton field="cattle">Cattle</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton field="infrastructureDamage">Infrastructure</SortButton>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {districtRows.slice(0, showTop).map((row, index) => {
                  const isSelected = crossFilters.selectedDistricts.includes(row.district);
                  return (
                    <TableRow
                      key={row.district}
                      className={`cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50 border-blue-200' : ''}`}
                      onClick={() => handleDistrictClick(row.district)}
                    >
                      <TableCell>
                        <Badge
                          variant={index === 0 ? "default" : "secondary"}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            index === 2 ? 'bg-orange-600 text-white' : ''
                          }`}
                        >
                          {row.rank}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{row.district}</TableCell>
                      <TableCell className="text-right">
                        <Badge className={`${getSeverityColor(row.severity)} border-0`}>
                          {row.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-red-600">
                        {row.deaths.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-yellow-600">
                        {row.injured.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-red-500">
                        {row.housesFull.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-orange-500">
                        {row.housesPartial.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-purple-600">
                        {row.schools.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {row.cattle.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-indigo-600">
                        {row.infrastructureDamage.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {districtRows.length > showTop && (
            <div className="text-center text-sm text-gray-500 py-2">
              Showing top {showTop} of {districtRows.length} districts
            </div>
          )}

          {/* Active Filters */}
          {crossFilters.selectedDistricts.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
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