import React, { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Home,
  ShoppingBag,
  GraduationCap,
  Heart,
  Building as OfficeBuilding,
  StretchHorizontal,
  Building2,
  Zap,
  Droplets,
  Flame,
  Phone,
  Signal,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { KpiCard } from '@/components/ui/kpi-card';
import { ServiceStatusCards } from '@/features/kpis';
import { PheAssetsTab } from '@/components/infrastructure/PheAssetsTab';
import {
  getInfrastructureDamage,
  getServicesStatus,
  getCombinedInfrastructureServices,
  type DistrictInfrastructureData,
  type DistrictServicesData
} from '@/api/infrastructure';

export default function InfrastructurePage() {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfrastructureData | null>(null);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [selectedServicesDistrict, setSelectedServicesDistrict] = useState<DistrictServicesData | null>(null);
  const [showServicesModal, setShowServicesModal] = useState(false);

  const { data: combinedData, isLoading, error } = useQuery({
    queryKey: ['combined-infrastructure-services'],
    queryFn: () => getCombinedInfrastructureServices(),
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });

  const handleViewDistrictDetails = (district: DistrictInfrastructureData) => {
    setSelectedDistrict(district);
    setShowDistrictModal(true);
  };

  const handleViewServicesDetails = (district: DistrictServicesData) => {
    setSelectedServicesDistrict(district);
    setShowServicesModal(true);
  };

  const handleCloseModals = () => {
    setShowDistrictModal(false);
    setShowServicesModal(false);
    setSelectedDistrict(null);
    setSelectedServicesDistrict(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Loading infrastructure data...</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-pulse">Loading enhanced infrastructure data...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-red-600">Error Loading Data</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-medium">Infrastructure Data Error:</h3>
                <p className="text-sm text-red-600">{error instanceof Error ? error.message : 'Failed to load infrastructure data'}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!combinedData || !combinedData.infrastructure?.data || !combinedData.services?.data) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">No Data Available</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center">
              <div>No infrastructure data available</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const infraData = combinedData.infrastructure.data;
  const servicesData = combinedData.services.data;

  // Prepare chart data for infrastructure damage by district
  const districtDamageChartData = infraData.map(district => ({
    district: district.DistrictName.length > 12 ? district.DistrictName.substring(0, 12) + '...' : district.DistrictName,
    fullDistrict: district.DistrictName,
    housesFullyDamaged: district.HousesFullyDamaged,
    housesPartiallyDamaged: district.HousesPartiallyDamaged,
    shopsDamaged: district.ShopsDamaged,
    educationFacilitiesDamaged: district.EducationFacilitiesDamaged,
    healthFacilitiesDamaged: district.HealthFacilitiesDamaged,
    govtOfficesDamaged: district.GovtOfficesDamaged,
    roadsDamaged: district.RoadsDamaged,
    bridgesDamaged: district.PermanentBridgesDamaged + district.PedestrianBridgesDamaged,
    totalDamage: district.HousesFullyDamaged + district.HousesPartiallyDamaged + district.ShopsDamaged +
                 district.EducationFacilitiesDamaged + district.HealthFacilitiesDamaged + district.GovtOfficesDamaged
  }));

  // Prepare chart data for services disruptions
  const servicesChartData = servicesData.map(district => ({
    district: district.DistrictName.length > 12 ? district.DistrictName.substring(0, 12) + '...' : district.DistrictName,
    fullDistrict: district.DistrictName,
    feedersDisconnections: district.TotalFeedersDisconnections,
    feedersRestored: district.TotalFeedersRestored,
    waterDisconnections: district.TotalWaterDisconnections,
    waterRestored: district.TotalWaterRestored,
    gasDisconnections: district.TotalGasDisconnections,
    gasRestored: district.TotalGasRestored,
    ptclDisconnections: district.TotalPTCLDisconnections,
    ptclRestored: district.TotalPTCLRestored,
    cellularDisconnections: district.TotalCellularDisconnections,
    cellularRestored: district.TotalCellularRestored,
    inaccessibleAreas: district.TotalInaccessibleAreas,
    reconnectedAreas: district.TotalReconnectedAreas
  }));

  // Infrastructure damage type distribution
  const damageTypeData = [
    { name: 'Houses Fully Damaged', value: combinedData.infrastructure.summary.total_houses_fully_damaged, color: '#ef4444' },
    { name: 'Houses Partially Damaged', value: combinedData.infrastructure.summary.total_houses_partially_damaged, color: '#f97316' },
    { name: 'Shops Damaged', value: combinedData.infrastructure.summary.total_shops_damaged, color: '#eab308' },
    { name: 'Education Facilities', value: combinedData.infrastructure.summary.total_education_facilities_damaged, color: '#3b82f6' },
    { name: 'Health Facilities', value: combinedData.infrastructure.summary.total_health_facilities_damaged, color: '#8b5cf6' },
    { name: 'Govt Offices', value: combinedData.infrastructure.summary.total_govt_offices_damaged, color: '#06b6d4' }
  ].filter(item => item.value > 0);

  // Services disruption type distribution
  const servicesTypeData = [
    { name: 'Electricity Disconnections', value: combinedData.services.summary.total_feeders_disconnections, color: '#eab308' },
    { name: 'Water Disconnections', value: combinedData.services.summary.total_water_disconnections, color: '#3b82f6' },
    { name: 'Gas Disconnections', value: combinedData.services.summary.total_gas_disconnections, color: '#ef4444' },
    { name: 'Phone Disconnections', value: combinedData.services.summary.total_ptcl_disconnections, color: '#8b5cf6' },
    { name: 'Cellular Disconnections', value: combinedData.services.summary.total_cellular_disconnections, color: '#06b6d4' }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Main Content Tabs */}
      <Tabs defaultValue="infrastructure" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="infrastructure">🏗️ Infrastructure Damage</TabsTrigger>
          <TabsTrigger value="services">⚡ Services Status</TabsTrigger>
          <TabsTrigger value="phe-assets">Public Health Schemes</TabsTrigger>
        </TabsList>

        {/* Infrastructure Damage Tab */}
        <TabsContent value="infrastructure" className="space-y-6">
          {/* Infrastructure Damage KPIs */}
          <div data-testid="infrastructure-kpi-cards">
           
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiCard
                title="Houses Fully Damaged"
                value={combinedData.infrastructure.summary.total_houses_fully_damaged.toLocaleString()}
                icon={Home}
                color="text-red-600"
              />
              <KpiCard
                title="Houses Partially Damaged"
                value={combinedData.infrastructure.summary.total_houses_partially_damaged.toLocaleString()}
                icon={Home}
                color="text-orange-600"
              />
              <KpiCard
                title="Shops Damaged"
                value={combinedData.infrastructure.summary.total_shops_damaged.toLocaleString()}
                icon={ShoppingBag}
                color="text-yellow-600"
              />
              <KpiCard
                title="Education Facilities Damaged"
                value={combinedData.infrastructure.summary.total_education_facilities_damaged.toLocaleString()}
                icon={GraduationCap}
                color="text-blue-600"
              />
              <KpiCard
                title="Health Facilities Damaged"
                value={combinedData.infrastructure.summary.total_health_facilities_damaged.toLocaleString()}
                icon={Heart}
                color="text-purple-600"
              />
              <KpiCard
                title="Govt Offices Damaged"
                value={combinedData.infrastructure.summary.total_govt_offices_damaged.toLocaleString()}
                icon={OfficeBuilding}
                color="text-indigo-600"
              />
              <KpiCard
                title="Roads Damaged"
                value={`${combinedData.infrastructure.summary.total_roads_damaged_length_km.toLocaleString()} km`}
                icon={StretchHorizontal}
                color="text-green-600"
              />
              <KpiCard
                title="Bridges Damaged"
                value={(combinedData.infrastructure.summary.total_permanent_bridges_damaged + combinedData.infrastructure.summary.total_pedestrian_bridges_damaged).toLocaleString()}
                icon={Building2}
                color="text-teal-600"
              />
            </div>
          </div>

          {/* Infrastructure Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* District-wise Infrastructure Damage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  District-wise Infrastructure Damage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={districtDamageChartData.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="district" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [value, name]}
                      labelFormatter={(label) => {
                        const item = districtDamageChartData.find(d => d.district === label);
                        return item ? item.fullDistrict : label;
                      }}
                    />
                    <Legend />
                    <Bar dataKey="housesFullyDamaged" fill="#ef4444" name="Houses Fully" />
                    <Bar dataKey="housesPartiallyDamaged" fill="#f97316" name="Houses Partial" />
                    <Bar dataKey="shopsDamaged" fill="#eab308" name="Shops" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Infrastructure Damage Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Damage Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={damageTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {damageTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value.toLocaleString(), 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Infrastructure Damage Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                District-wise Infrastructure Damage Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>District</TableHead>
                      <TableHead className="text-right">Houses Fully</TableHead>
                      <TableHead className="text-right">Houses Partial</TableHead>
                      <TableHead className="text-right">Shops</TableHead>
                      <TableHead className="text-right">Education</TableHead>
                      <TableHead className="text-right">Health</TableHead>
                      <TableHead className="text-right">Govt Offices</TableHead>
                      <TableHead className="text-right">Roads (KM)</TableHead>
                      <TableHead className="text-right">Bridges</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {infraData.map((district, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{district.DistrictName}</TableCell>
                        <TableCell className="text-right font-semibold text-red-600">
                          {district.HousesFullyDamaged.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-orange-600">
                          {district.HousesPartiallyDamaged.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-yellow-600">
                          {district.ShopsDamaged.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-blue-600">
                          {district.EducationFacilitiesDamaged.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-purple-600">
                          {district.HealthFacilitiesDamaged.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-indigo-600">
                          {district.GovtOfficesDamaged.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {district.RoadsDamagedLengthKM.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-teal-600">
                          {(district.PermanentBridgesDamaged + district.PedestrianBridgesDamaged).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDistrictDetails(district)}
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
        </TabsContent>

        {/* Services Status Tab */}
        <TabsContent value="services" className="space-y-6">
          {/* Services Status KPIs */}
          <ServiceStatusCards />

          {/* Services Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Services Disconnections Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Services Disconnections by District
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={servicesChartData.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="district" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [value, name]}
                      labelFormatter={(label) => {
                        const item = servicesChartData.find(d => d.district === label);
                        return item ? item.fullDistrict : label;
                      }}
                    />
                    <Legend />
                    <Bar dataKey="feedersDisconnections" fill="#eab308" name="Electricity" />
                    <Bar dataKey="waterDisconnections" fill="#3b82f6" name="Water" />
                    <Bar dataKey="gasDisconnections" fill="#ef4444" name="Gas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Services Disruption Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Signal className="h-5 w-5" />
                  Services Disruption Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={servicesTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {servicesTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value.toLocaleString(), 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Services Status Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                District-wise Services Status Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>District</TableHead>
                      <TableHead className="text-right">Electricity Disconn.</TableHead>
                      <TableHead className="text-right">Electricity Restored</TableHead>
                      <TableHead className="text-right">Water Disconn.</TableHead>
                      <TableHead className="text-right">Water Restored</TableHead>
                      <TableHead className="text-right">Gas Disconn.</TableHead>
                      <TableHead className="text-right">Gas Restored</TableHead>
                      <TableHead className="text-right">Phone Disconn.</TableHead>
                      <TableHead className="text-right">Phone Restored</TableHead>
                      <TableHead className="text-right">Inaccessible Areas</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servicesData.map((district, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{district.DistrictName}</TableCell>
                        <TableCell className="text-right font-semibold text-yellow-600">
                          {district.TotalFeedersDisconnections.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {district.TotalFeedersRestored.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-blue-600">
                          {district.TotalWaterDisconnections.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-cyan-600">
                          {district.TotalWaterRestored.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {district.TotalGasDisconnections.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-orange-600">
                          {district.TotalGasRestored.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-purple-600">
                          {district.TotalPTCLDisconnections.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-pink-600">
                          {district.TotalPTCLRestored.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-indigo-600">
                          {district.TotalInaccessibleAreas.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewServicesDetails(district)}
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
        </TabsContent>

        {/* PHE Assets Tab */}
        <TabsContent value="phe-assets" className="space-y-6">
          <PheAssetsTab />
        </TabsContent>
      </Tabs>

      {/* District Infrastructure Details Modal */}
      {showDistrictModal && selectedDistrict && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {selectedDistrict.DistrictName} - Infrastructure Damage Details
              </h3>
              <Button variant="outline" size="sm" onClick={handleCloseModals}>
                Close
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-red-50 rounded">
                <div className="text-2xl font-bold text-red-600">{selectedDistrict.HousesFullyDamaged}</div>
                <div className="text-sm text-gray-600">Houses Fully Damaged</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded">
                <div className="text-2xl font-bold text-orange-600">{selectedDistrict.HousesPartiallyDamaged}</div>
                <div className="text-sm text-gray-600">Houses Partially Damaged</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded">
                <div className="text-2xl font-bold text-yellow-600">{selectedDistrict.ShopsDamaged}</div>
                <div className="text-sm text-gray-600">Shops Damaged</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">{selectedDistrict.EducationFacilitiesDamaged}</div>
                <div className="text-sm text-gray-600">Education Facilities</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="text-2xl font-bold text-purple-600">{selectedDistrict.HealthFacilitiesDamaged}</div>
                <div className="text-sm text-gray-600">Health Facilities</div>
              </div>
              <div className="text-center p-3 bg-indigo-50 rounded">
                <div className="text-2xl font-bold text-indigo-600">{selectedDistrict.GovtOfficesDamaged}</div>
                <div className="text-sm text-gray-600">Govt Offices</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">{selectedDistrict.RoadsDamagedLengthKM} km</div>
                <div className="text-sm text-gray-600">Roads Damaged</div>
              </div>
              <div className="text-center p-3 bg-teal-50 rounded">
                <div className="text-2xl font-bold text-teal-600">{selectedDistrict.PermanentBridgesDamaged + selectedDistrict.PedestrianBridgesDamaged}</div>
                <div className="text-sm text-gray-600">Bridges Damaged</div>
              </div>
            </div>

            {selectedDistrict.Tehsil.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-3">Tehsil-wise Breakdown</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tehsil</TableHead>
                        <TableHead className="text-right">Houses Fully</TableHead>
                        <TableHead className="text-right">Houses Partial</TableHead>
                        <TableHead className="text-right">Shops</TableHead>
                        <TableHead className="text-right">Education</TableHead>
                        <TableHead className="text-right">Health</TableHead>
                        <TableHead className="text-right">Roads (KM)</TableHead>
                        <TableHead className="text-right">Bridges</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedDistrict.Tehsil.map((tehsil, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{tehsil.TehsilName}</TableCell>
                          <TableCell className="text-right">{tehsil.HousesFullyDamaged}</TableCell>
                          <TableCell className="text-right">{tehsil.HousesPartiallyDamaged}</TableCell>
                          <TableCell className="text-right">{tehsil.ShopsDamaged}</TableCell>
                          <TableCell className="text-right">{tehsil.EducationFacilitiesDamaged}</TableCell>
                          <TableCell className="text-right">{tehsil.HealthFacilitiesDamaged}</TableCell>
                          <TableCell className="text-right">{tehsil.RoadsDamagedLengthKM}</TableCell>
                          <TableCell className="text-right">{tehsil.PermanentBridgesDamaged + tehsil.PedestrianBridgesDamaged}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Services Status Details Modal */}
      {showServicesModal && selectedServicesDistrict && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {selectedServicesDistrict.DistrictName} - Services Status Details
              </h3>
              <Button variant="outline" size="sm" onClick={handleCloseModals}>
                Close
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-yellow-50 rounded">
                <div className="text-2xl font-bold text-yellow-600">{selectedServicesDistrict.TotalFeedersDisconnections}</div>
                <div className="text-sm text-gray-600">Electricity Disconnections</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">{selectedServicesDistrict.TotalFeedersRestored}</div>
                <div className="text-sm text-gray-600">Electricity Restored</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">{selectedServicesDistrict.TotalWaterDisconnections}</div>
                <div className="text-sm text-gray-600">Water Disconnections</div>
              </div>
              <div className="text-center p-3 bg-cyan-50 rounded">
                <div className="text-2xl font-bold text-cyan-600">{selectedServicesDistrict.TotalWaterRestored}</div>
                <div className="text-sm text-gray-600">Water Restored</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded">
                <div className="text-2xl font-bold text-red-600">{selectedServicesDistrict.TotalGasDisconnections}</div>
                <div className="text-sm text-gray-600">Gas Disconnections</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded">
                <div className="text-2xl font-bold text-orange-600">{selectedServicesDistrict.TotalGasRestored}</div>
                <div className="text-sm text-gray-600">Gas Restored</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="text-2xl font-bold text-purple-600">{selectedServicesDistrict.TotalPTCLDisconnections}</div>
                <div className="text-sm text-gray-600">Phone Disconnections</div>
              </div>
              <div className="text-center p-3 bg-pink-50 rounded">
                <div className="text-2xl font-bold text-pink-600">{selectedServicesDistrict.TotalPTCLRestored}</div>
                <div className="text-sm text-gray-600">Phone Restored</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-indigo-50 rounded">
                <div className="text-2xl font-bold text-indigo-600">{selectedServicesDistrict.TotalCellularDisconnections}</div>
                <div className="text-sm text-gray-600">Cellular Disconnections</div>
              </div>
              <div className="text-center p-3 bg-teal-50 rounded">
                <div className="text-2xl font-bold text-teal-600">{selectedServicesDistrict.TotalCellularRestored}</div>
                <div className="text-sm text-gray-600">Cellular Restored</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-2xl font-bold text-gray-600">{selectedServicesDistrict.TotalInaccessibleAreas}</div>
                <div className="text-sm text-gray-600">Inaccessible Areas</div>
              </div>
            </div>

            {selectedServicesDistrict.Tehsil.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-3">Tehsil-wise Services Breakdown</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tehsil</TableHead>
                        <TableHead className="text-right">Electricity Disconn.</TableHead>
                        <TableHead className="text-right">Electricity Restored</TableHead>
                        <TableHead className="text-right">Water Disconn.</TableHead>
                        <TableHead className="text-right">Water Restored</TableHead>
                        <TableHead className="text-right">Gas Disconn.</TableHead>
                        <TableHead className="text-right">Gas Restored</TableHead>
                        <TableHead className="text-right">Phone Disconn.</TableHead>
                        <TableHead className="text-right">Phone Restored</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedServicesDistrict.Tehsil.map((tehsil, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{tehsil.TehsilName}</TableCell>
                          <TableCell className="text-right">{tehsil.TotalFeedersDisconnections}</TableCell>
                          <TableCell className="text-right">{tehsil.TotalFeedersRestored}</TableCell>
                          <TableCell className="text-right">{tehsil.TotalWaterDisconnections}</TableCell>
                          <TableCell className="text-right">{tehsil.TotalWaterRestored}</TableCell>
                          <TableCell className="text-right">{tehsil.TotalGasDisconnections}</TableCell>
                          <TableCell className="text-right">{tehsil.TotalGasRestored}</TableCell>
                          <TableCell className="text-right">{tehsil.TotalPTCLDisconnections}</TableCell>
                          <TableCell className="text-right">{tehsil.TotalPTCLRestored}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}