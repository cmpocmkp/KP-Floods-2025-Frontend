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
  Cell
} from 'recharts';
import {
  Beef,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { getLivestockLosses, getLivestockSummary, type LivestockLossRecord } from '@/api/livestock';
import { useState } from 'react';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

export default function LivestockPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<LivestockLossRecord | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data: livestockData, isLoading: isLoadingData, error: dataError } = useQuery({
    queryKey: ['livestock-losses'],
    queryFn: () => getLivestockLosses(),
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });

  const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['livestock-summary'],
    queryFn: () => getLivestockSummary(),
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });

  const handleViewDetails = (record: LivestockLossRecord) => {
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
            <h2 className="text-lg font-semibold">Livestock Losses</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-pulse">Loading livestock data...</div>
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
            <h2 className="text-lg font-semibold">Livestock Losses</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center text-red-500">
              <div>
                <div className="font-semibold">Error loading livestock data</div>
                <div className="text-sm mt-1">{dataError.message}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!livestockData || !summaryData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Livestock Losses</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center">
              <div>No data available</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare chart data
  const districtChartData = summaryData.districtsWithLosses.slice(0, 10).map(district => ({
    district: district.district.length > 10 ? district.district.substring(0, 10) + '...' : district.district,
    fullDistrict: district.district,
    cattles_perished: district.cattles_perished,
    shelters_damaged: district.shelters_damaged,
    fodder_roughages_ton: district.fodder_roughages_ton,
  }));

  const cattleTypeData = [
    { name: 'Big Cattle', value: summaryData.totalBigCattles, color: '#8884d8' },
    { name: 'Small Cattle', value: summaryData.totalSmallCattles, color: '#82ca9d' },
    { name: 'Other', value: summaryData.totalOther, color: '#ffc658' },
  ].filter(item => item.value > 0);

  const divisionData = livestockData.reduce((acc, record) => {
    const division = record.division.name;
    if (!acc[division]) {
      acc[division] = { division, cattles_perished: 0, shelters_damaged: 0 };
    }
    acc[division].cattles_perished += record.cattles_perished;
    acc[division].shelters_damaged += record.shelters_damaged;
    return acc;
  }, {} as Record<string, { division: string; cattles_perished: number; shelters_damaged: number }>);

  const divisionChartData = Object.values(divisionData).filter(d => d.cattles_perished > 0);

  return (
    <div className="space-y-6">
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* District-wise Cattle Losses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top 10 Districts - Cattle Losses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={districtChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="district" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [value, name === 'cattles_perished' ? 'Cattle Lost' : name]}
                  labelFormatter={(label) => {
                    const item = districtChartData.find(d => d.district === label);
                    return item ? item.fullDistrict : label;
                  }}
                />
                <Legend />
                <Bar dataKey="cattles_perished" fill="#8884d8" name="Cattle Lost" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cattle Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beef className="h-5 w-5" />
              Cattle Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cattleTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cattleTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value.toLocaleString(), 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Division-wise Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Division-wise Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={divisionChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="division" />
              <YAxis />
              <Tooltip formatter={(value, name) => [value, name === 'cattles_perished' ? 'Cattle Lost' : 'Shelters Damaged']} />
              <Legend />
              <Bar dataKey="cattles_perished" fill="#8884d8" name="Cattle Lost" />
              <Bar dataKey="shelters_damaged" fill="#82ca9d" name="Shelters Damaged" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* District-wise Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            District-wise Livestock Losses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>District</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead className="text-right">Cattle Lost</TableHead>
                  <TableHead className="text-right">Big Cattle</TableHead>
                  <TableHead className="text-right">Small Cattle</TableHead>
                  <TableHead className="text-right">Other</TableHead>
                  <TableHead className="text-right">Fodder (Tons)</TableHead>
                  <TableHead className="text-right">Shelters Damaged</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaryData.districtsWithLosses.map((district, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{district.district}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{district.division}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-red-600">
                      {district.cattles_perished.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">{district.big_cattles.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{district.small_cattles.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{district.other.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{district.fodder_roughages_ton.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{district.shelters_damaged.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const record = livestockData.find(r => r.district.name === district.district && r.division.name === district.division);
                          if (record) handleViewDetails(record);
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

      {/* Detail Modal */}
      {showModal && selectedDistrict && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {selectedDistrict.district.name} - {selectedDistrict.division.name}
              </h3>
              <Button variant="outline" size="sm" onClick={handleCloseModal}>
                Close
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-red-50 rounded">
                <div className="text-2xl font-bold text-red-600">{selectedDistrict.cattles_perished}</div>
                <div className="text-sm text-gray-600">Total Lost</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">{selectedDistrict.big_cattles}</div>
                <div className="text-sm text-gray-600">Big Cattle</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">{selectedDistrict.small_cattles}</div>
                <div className="text-sm text-gray-600">Small Cattle</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded">
                <div className="text-2xl font-bold text-yellow-600">{selectedDistrict.other}</div>
                <div className="text-sm text-gray-600">Other</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-orange-50 rounded">
                <div className="text-xl font-bold text-orange-600">{selectedDistrict.shelters_damaged}</div>
                <div className="text-sm text-gray-600">Shelters Damaged</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="text-xl font-bold text-purple-600">{selectedDistrict.fodder_roughages_ton}T</div>
                <div className="text-sm text-gray-600">Fodder Roughages</div>
              </div>
              <div className="text-center p-3 bg-indigo-50 rounded">
                <div className="text-xl font-bold text-indigo-600">{selectedDistrict.fodder_concentrates_kg}kg</div>
                <div className="text-sm text-gray-600">Fodder Concentrates</div>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <div>Report Date: {new Date(selectedDistrict.report_date).toLocaleDateString()}</div>
              {selectedDistrict.notes && <div>Notes: {selectedDistrict.notes}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}