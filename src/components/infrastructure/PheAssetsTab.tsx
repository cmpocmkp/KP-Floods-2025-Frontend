import { useMemo } from 'react';
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Building2,
  Download,
  AlertTriangle,
  DollarSign,
  Wrench
} from 'lucide-react';

interface PheAssetData {
  _id: string;
  report_date: string;
  division: {
    _id: string;
    name: string;
  };
  district: {
    _id: string;
    name: string;
  };
  department: string;
  tehsil?: string | null;
  uc?: string | null;
  type_of_scheme?: string | null;
  scheme_name?: string | null;
  nature_of_damage?: string | null;
  damage_status?: string | null;
  components_damaged?: string | null;
  minorly_damaged_no: number;
  partially_damaged_no: number;
  washed_away_no: number;
  total_schemes_no: number;
  estimated_cost_million_pkr: number;
  restoration_status?: string | null;
  notes?: string | null;
  source?: string | null;
  created_at: string;
  updated_at: string;
  __v: number;
}



export function PheAssetsTab() {
  // Fetch PHE assets data
  const { data: pheAssetsData, isLoading, error } = useQuery({
    queryKey: ['phe-assets-data'],
    queryFn: async (): Promise<PheAssetData[]> => {
      const response = await fetch('https://kp-floods-2025-mongo-backend-production.up.railway.app/floods/phe-assets');
      if (!response.ok) {
        throw new Error('Failed to fetch PHE assets data');
      }
      const result = await response.json();
      return result;
    },
  });

  // Process data for visualizations
  const processedData = useMemo(() => {
    if (!pheAssetsData) return null;

    // Summary statistics - only count districts with actual schemes
    const districtsWithSchemes = pheAssetsData.filter(item => item.total_schemes_no > 0);

    const totalSchemes = districtsWithSchemes.reduce((sum, item) => sum + item.total_schemes_no, 0);
    const damagedSchemes = districtsWithSchemes.reduce((sum, item) =>
      sum + item.minorly_damaged_no + item.partially_damaged_no + item.washed_away_no, 0);
    const totalCost = districtsWithSchemes.reduce((sum, item) => sum + item.estimated_cost_million_pkr, 0);



    // District-wise damage - using filtered districts with schemes
    const districtDamage = districtsWithSchemes
      .map(item => ({
        district: item.district.name,
        totalSchemes: item.total_schemes_no,
        minorlyDamaged: item.minorly_damaged_no,
        partiallyDamaged: item.partially_damaged_no,
        washedAway: item.washed_away_no,
        totalDamaged: item.minorly_damaged_no + item.partially_damaged_no + item.washed_away_no,
        estimatedCost: item.estimated_cost_million_pkr,
        damagePercentage: item.total_schemes_no > 0
          ? ((item.minorly_damaged_no + item.partially_damaged_no + item.washed_away_no) / item.total_schemes_no * 100).toFixed(1)
          : 0
      }))
      .sort((a, b) => b.totalDamaged - a.totalDamaged);



    // Division-wise summary - only include districts with schemes
    const divisionSummary = districtsWithSchemes.reduce((acc, item) => {
      const divisionName = item.division.name;
      if (!acc[divisionName]) {
        acc[divisionName] = {
          name: divisionName,
          totalSchemes: 0,
          totalDamaged: 0,
          totalCost: 0,
          districts: new Set()
        };
      }
      acc[divisionName].totalSchemes += item.total_schemes_no;
      acc[divisionName].totalDamaged += item.minorly_damaged_no + item.partially_damaged_no + item.washed_away_no;
      acc[divisionName].totalCost += item.estimated_cost_million_pkr;
      acc[divisionName].districts.add(item.district.name);
      return acc;
    }, {} as Record<string, any>);

    const divisionData = Object.values(divisionSummary)
      .map((division: any) => ({
        division: division.name,
        totalSchemes: division.totalSchemes,
        totalDamaged: division.totalDamaged,
        totalCost: division.totalCost,
        districtCount: division.districts.size,
        damagePercentage: division.totalSchemes > 0
          ? ((division.totalDamaged / division.totalSchemes) * 100).toFixed(1)
          : 0
      }))
      .sort((a, b) => b.totalDamaged - a.totalDamaged);

    // Cost impact analysis
    const costImpactData = districtDamage
      .filter(item => item.estimatedCost > 0)
      .sort((a, b) => b.estimatedCost - a.estimatedCost)
      .slice(0, 10);

    return {
      summary: {
        totalSchemes,
        damagedSchemes,
        totalCost,
        damagePercentage: totalSchemes > 0 ? ((damagedSchemes / totalSchemes) * 100).toFixed(1) : 0
      },
      districtDamage,
      divisionData,
      costImpactData,
      rawData: pheAssetsData
    };
  }, [pheAssetsData]);

  const handleExportCSV = () => {
    if (!processedData) return;

    const csvContent = [
      'PHE Assets Damage Analysis',
      '',
      'Summary Statistics:',
      `Total Schemes,${processedData.summary.totalSchemes}`,
      `Total Estimated Cost (Million PKR),${processedData.summary.totalCost.toFixed(2)}`,
      '',
      'District-wise Damage:',
      'District,Total Schemes,Minor Damage,Partial Damage,Washed Away,Total Damaged,Estimated Cost (M PKR)',
      ...processedData.districtDamage.map(item =>
        `${item.district},${item.totalSchemes},${item.minorlyDamaged === 0 ? 'NA' : item.minorlyDamaged},${item.partiallyDamaged === 0 ? 'NA' : item.partiallyDamaged},${item.washedAway === 0 ? 'NA' : item.washedAway},${item.totalDamaged === 0 ? 'NA' : item.totalDamaged},${item.estimatedCost.toFixed(2)}`
      ),
      '',
      'Division Summary:',
      'Division,Total Schemes,Districts,Total Cost (M PKR)',
      ...processedData.divisionData.map(item =>
        `${item.division},${item.totalSchemes},${item.districtCount},${item.totalCost.toFixed(2)}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'phe_assets_damage_analysis.csv');
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
            <Building2 className="h-5 w-5" />
            PHE Assets Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-muted-foreground">Loading PHE assets data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            PHE Assets Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-red-600">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Error Loading Data</h3>
            <p>{error instanceof Error ? error.message : 'Failed to load PHE assets data'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!processedData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            PHE Assets Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No PHE Assets Data</h3>
            <p>No Public Health Engineering assets data available for analysis.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{processedData.summary.totalSchemes.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Schemes</div>
              </div>
            </div>
          </CardContent>
        </Card>



        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{processedData.summary.totalCost.toFixed(1)}M</div>
                <div className="text-sm text-muted-foreground">Est. Cost (PKR)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Impact Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Cost Impact by District
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processedData.costImpactData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="district" angle={-45} textAnchor="end" height={80} fontSize={12} />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${Number(value).toFixed(2)}M PKR`, 'Estimated Cost']}
                  labelFormatter={(label) => label}
                />
                <Bar dataKey="estimatedCost" fill="#16a34a" name="Cost (Million PKR)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Division Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Division-wise Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processedData.divisionData.map((division, index) => (
                <div key={division.division} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{division.division}</h4>
                    <Badge variant="secondary">
                      NA
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Total Schemes</div>
                      <div className="font-semibold">{division.totalSchemes}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Damaged</div>
                      <div className="font-semibold text-gray-500">NA</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Districts</div>
                      <div className="font-semibold">{division.districtCount}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Est. Cost</div>
                      <div className="font-semibold text-green-600">{division.totalCost.toFixed(1)}M</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Detailed Scheme Damage Report
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>District</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead className="text-right">Total Schemes</TableHead>
                  <TableHead className="text-right">Minor Damage</TableHead>
                  <TableHead className="text-right">Partial Damage</TableHead>
                  <TableHead className="text-right">Washed Away</TableHead>
                  <TableHead className="text-right">Total Damaged</TableHead>
                  <TableHead className="text-right">Est. Cost (M PKR)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedData.districtDamage.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.district}</TableCell>
                    <TableCell>
                      {processedData.rawData.find(d => d.district.name === item.district)?.division.name || 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">{item.totalSchemes}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {item.minorlyDamaged === 0 ? 'NA' : item.minorlyDamaged}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        {item.partiallyDamaged === 0 ? 'NA' : item.partiallyDamaged}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive">
                        {item.washedAway === 0 ? 'NA' : item.washedAway}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-red-600">
                      {item.totalDamaged === 0 ? 'NA' : item.totalDamaged}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-blue-600">
                      {item.estimatedCost.toFixed(2)}M
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}