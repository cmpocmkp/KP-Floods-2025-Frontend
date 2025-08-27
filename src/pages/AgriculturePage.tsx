import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  Sprout,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Eye,
  Building,
  DollarSign,
  Activity,
  Target
} from 'lucide-react';
import { getAgricultureImpacts, getAgricultureSummary, type AgricultureImpactRecord } from '@/api/agriculture';
import { useState } from 'react';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

// Helper function to format large numbers
const formatLargeNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
};

export default function AgriculturePage() {
  const [selectedDistrict, setSelectedDistrict] = useState<AgricultureImpactRecord | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data: agricultureData, isLoading: isLoadingData, error: dataError } = useQuery({
    queryKey: ['agriculture-impacts'],
    queryFn: () => getAgricultureImpacts(),
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });

  const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['agriculture-summary'],
    queryFn: () => getAgricultureSummary(),
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });

  const handleViewDetails = (record: AgricultureImpactRecord) => {
    setSelectedDistrict(record);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDistrict(null);
  };

  if (isLoadingData || isLoadingSummary) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Agriculture Impacts</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-pulse">Loading agriculture data...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Agriculture Impacts</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center text-red-500">
              <div>
                <div className="font-semibold">Error loading agriculture data</div>
                <div className="text-sm mt-1">{dataError.message}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!agricultureData || !summaryData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">No Agriculture Data Available</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center">
              <div>No agriculture impact data available</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare chart data for top impacted districts
  const topDistrictsChartData = summaryData.topImpactedDistricts.map(district => ({
    district: district.district.length > 12 ? district.district.substring(0, 12) + '...' : district.district,
    fullDistrict: district.district,
    division: district.division,
    loss: district.total_loss,
    structuralDamages: district.structural_damages,
    areaAffected: district.area_affected
  }));

  // Prepare division-wise comparison data
  const divisionComparisonData = summaryData.divisionWiseImpact.map(division => ({
    division: division.division,
    districts: division.districts_count,
    structuralDamages: division.total_structural_damages,
    cropMaskArea: division.total_crop_mask_acre,
    gisDamagedArea: division.total_damaged_area_gis_acre,
    verifiedArea: division.total_onground_verified_acre,
    totalLoss: division.total_estimated_losses_million_pkr
  }));

  return (
    <div className="space-y-6">
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Impacted Districts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Top 10 Impacted Districts by Loss
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topDistrictsChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="district" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    typeof value === 'number' ? value.toLocaleString() : value,
                    name === 'loss' ? 'Loss (M PKR)' : name
                  ]}
                  labelFormatter={(label) => {
                    const item = topDistrictsChartData.find(d => d.district === label);
                    return item ? item.fullDistrict : label;
                  }}
                />
                <Legend />
                <Bar dataKey="loss" fill="#ef4444" name="Economic Loss (M PKR)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Impact Severity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Impact Severity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={summaryData.impactSeverityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {summaryData.impactSeverityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Districts']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loss Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Loss Distribution by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={summaryData.lossDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {summaryData.lossDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [typeof value === 'number' ? value.toLocaleString() : value, 'Count/Value']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Division-wise Impact Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Division-wise Impact Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={divisionComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="division" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    typeof value === 'number' ? value.toLocaleString() : value,
                    name === 'totalLoss' ? 'Loss (M PKR)' :
                    name === 'districts' ? 'Districts' :
                    name === 'structuralDamages' ? 'Structural Damages' : name
                  ]}
                />
                <Legend />
                <Bar dataKey="totalLoss" fill="#ef4444" name="Economic Loss (M PKR)" />
                <Bar dataKey="structuralDamages" fill="#f97316" name="Structural Damages" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Agriculture Impacts Data Table */}
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
                  <TableHead className="text-right">Structural Damages</TableHead>
                  <TableHead className="text-right">Crop Mask Area</TableHead>
                  <TableHead className="text-right">GIS Damaged Area</TableHead>
                  <TableHead className="text-right">On-ground Verified</TableHead>
                  <TableHead className="text-right">Estimated Loss (M PKR)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agricultureData
                  .filter(record => record.structural_damages_no > 0 || record.crop_mask_acre > 0)
                  .sort((a, b) => b.estimated_losses_million_pkr - a.estimated_losses_million_pkr)
                  .map((record, index) => (
                    <TableRow key={record._id}>
                      <TableCell className="font-medium">{record.district.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.division.name}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-red-600">
                        {record.structural_damages_no.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatLargeNumber(record.crop_mask_acre)} acres
                      </TableCell>
                      <TableCell className="text-right text-orange-600">
                        {record.damaged_area_gis_acre.toLocaleString()} acres
                      </TableCell>
                      <TableCell className="text-right text-blue-600">
                        {record.onground_verified_acre.toLocaleString()} acres
                      </TableCell>
                      <TableCell className="text-right font-bold text-purple-600">
                        PKR {record.estimated_losses_million_pkr.toLocaleString()}M
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(record)}
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

      {/* District Details Modal */}
      {showModal && selectedDistrict && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {selectedDistrict.district.name} - Agriculture Impact Details
              </h3>
              <Button variant="outline" size="sm" onClick={handleCloseModal}>
                Close
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-red-50 rounded">
                <div className="text-2xl font-bold text-red-600">{selectedDistrict.structural_damages_no}</div>
                <div className="text-sm text-gray-600">Structural Damages</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">{formatLargeNumber(selectedDistrict.crop_mask_acre)}</div>
                <div className="text-sm text-gray-600">Crop Mask Area (acres)</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded">
                <div className="text-2xl font-bold text-orange-600">{selectedDistrict.damaged_area_gis_acre.toLocaleString()}</div>
                <div className="text-sm text-gray-600">GIS Damaged Area (acres)</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">{selectedDistrict.onground_verified_acre.toLocaleString()}</div>
                <div className="text-sm text-gray-600">On-ground Verified (acres)</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="text-center p-4 bg-purple-50 rounded">
                <div className="text-3xl font-bold text-purple-600">PKR {selectedDistrict.estimated_losses_million_pkr.toLocaleString()}M</div>
                <div className="text-sm text-gray-600">Estimated Economic Loss</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded">
                <div className="text-xl font-semibold text-gray-700">{selectedDistrict.division.name}</div>
                <div className="text-sm text-gray-600">Division</div>
              </div>
            </div>

            {(selectedDistrict.notes || selectedDistrict.source) && (
              <div className="space-y-4">
                {selectedDistrict.notes && (
                  <div>
                    <h4 className="text-md font-semibold mb-2">Notes</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedDistrict.notes}</p>
                  </div>
                )}
                {selectedDistrict.source && (
                  <div>
                    <h4 className="text-md font-semibold mb-2">Source</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedDistrict.source}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}