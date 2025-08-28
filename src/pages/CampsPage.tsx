import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter, ZAxis,
  AreaChart, Area, ComposedChart
} from 'recharts';
import { 
  Tent, Users, Building, MapPin, Activity, TrendingUp, 
  AlertTriangle, CheckCircle, Clock, Target, Award, Shield
} from 'lucide-react';
import { getReliefOperationsOverview } from '@/api/camps';
import KpiCard from '@/components/shared/KpiCard';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function CampsPage() {
  const { data: reliefData, isLoading, error } = useQuery({
    queryKey: ['relief-operations'],
    queryFn: getReliefOperationsOverview
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-96 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !reliefData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600">Failed to load relief operations data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const { summary, kpi_cards, charts, district_data } = reliefData;

  // Calculate percentages for KPIs
  const getPercentage = (paid: number, reported: number) => 
    reported > 0 ? ((paid / reported) * 100).toFixed(1) : '0.0';

  // Transform data for charts
  const compensationProgressData = [
    { category: 'Death Compensation', reported: summary.total_death_comp_reported, paid: summary.total_death_comp_paid, percentage: getPercentage(summary.total_death_comp_paid, summary.total_death_comp_reported) },
    { category: 'Injury Compensation', reported: summary.total_injury_comp_reported, paid: summary.total_injury_comp_paid, percentage: getPercentage(summary.total_injury_comp_paid, summary.total_injury_comp_reported) },
    { category: 'House Damage', reported: summary.total_house_damage_reported, paid: summary.total_house_damage_paid, percentage: getPercentage(summary.total_house_damage_paid, summary.total_house_damage_reported) },
    { category: 'Livestock', reported: summary.total_livestock_comp_reported, paid: summary.total_livestock_comp_paid, percentage: getPercentage(summary.total_livestock_comp_paid, summary.total_livestock_comp_reported) },
    { category: 'Agriculture', reported: summary.total_agriculture_comp_reported, paid: summary.total_agriculture_comp_paid, percentage: getPercentage(summary.total_agriculture_comp_paid, summary.total_agriculture_comp_reported) },
  ];

  const reliefDistributionData = [
    { category: 'Shelter', demanded: summary.total_shelter_demanded, distributed: summary.total_shelter_distributed, percentage: getPercentage(summary.total_shelter_distributed, summary.total_shelter_demanded) },
    { category: 'NFIs', demanded: summary.total_nfis_demanded, distributed: summary.total_nfis_distributed, percentage: getPercentage(summary.total_nfis_distributed, summary.total_nfis_demanded) },
    { category: 'Dewatering', required: summary.total_dewatering_required, done: summary.total_dewatering_done, percentage: getPercentage(summary.total_dewatering_done, summary.total_dewatering_required) },
    { category: 'Desilting', required: summary.total_desilting_required, done: summary.total_desilting_done, percentage: getPercentage(summary.total_desilting_done, summary.total_desilting_required) },
  ];

  // Transform data for Relief Operations Progress chart
  const reliefOperationsProgressData = [
    { 
      category: 'Compensation Processing', 
      reported: summary.total_death_comp_reported + summary.total_injury_comp_reported + summary.total_house_damage_reported + summary.total_livestock_comp_reported + summary.total_agriculture_comp_reported,
      processed: summary.total_death_comp_paid + summary.total_injury_comp_paid + summary.total_house_damage_paid + summary.total_livestock_comp_paid + summary.total_agriculture_comp_paid,
      percentage: getPercentage(
        summary.total_death_comp_paid + summary.total_injury_comp_paid + summary.total_house_damage_paid + summary.total_livestock_comp_paid + summary.total_agriculture_comp_paid,
        summary.total_death_comp_reported + summary.total_injury_comp_reported + summary.total_house_damage_reported + summary.total_livestock_comp_reported + summary.total_agriculture_comp_reported
      )
    },
    { 
      category: 'Relief Distribution', 
      reported: summary.total_shelter_demanded + summary.total_nfis_demanded,
      processed: summary.total_shelter_distributed + summary.total_nfis_distributed,
      percentage: getPercentage(
        summary.total_shelter_distributed + summary.total_nfis_distributed,
        summary.total_shelter_demanded + summary.total_nfis_demanded
      )
    },
    { 
      category: 'Infrastructure Work', 
      reported: summary.total_dewatering_required + summary.total_desilting_required,
      processed: summary.total_dewatering_done + summary.total_desilting_done,
      percentage: getPercentage(
        summary.total_dewatering_done + summary.total_desilting_done,
        summary.total_dewatering_required + summary.total_desilting_required
      )
    },
    { 
      category: 'Food Distribution', 
      reported: summary.total_people_cooked_food,
      processed: summary.total_ration_bags,
      percentage: getPercentage(summary.total_ration_bags, summary.total_people_cooked_food)
    }
  ];

  // Create district comparison data for better visualization
  const districtComparisonData = district_data
    .filter(district => 
      district.active_relief_camps > 0 || 
      district.people_cooked_food > 0 || 
      (district.death_comp_paid + district.injury_comp_paid + district.house_damage_paid + district.livestock_comp_paid + district.agriculture_comp_paid) > 0
    )
    .map(district => ({
      district: district.district,
      activeCamps: district.active_relief_camps,
      peopleInCamps: district.people_in_relief_camps,
      compensationPaid: district.death_comp_paid + district.injury_comp_paid + district.house_damage_paid + district.livestock_comp_paid + district.agriculture_comp_paid,
      reliefDistributed: district.shelter_distributed + district.nfis_distributed,
      peopleFed: district.people_cooked_food,
      rationBags: district.ration_bags_distributed
    }))
    .sort((a, b) => b.activeCamps - a.activeCamps || b.compensationPaid - a.compensationPaid);

  return (
    <div className="space-y-6">
      {/* Header with Summary Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relief Operations Dashboard</h1>
            <p className="text-gray-600">Comprehensive overview of flood relief operations across {summary.affected_districts} districts</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Last Updated</div>
            <div className="text-sm font-medium">{new Date(reliefData.metadata.last_updated).toLocaleString()}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{summary.total_active_camps}</div>
            <div className="text-sm text-gray-600">Active Camps</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{summary.total_people_in_camps.toLocaleString()}</div>
            <div className="text-sm text-gray-600">People Sheltered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{summary.total_people_cooked_food.toLocaleString()}</div>
            <div className="text-sm text-gray-600">People Fed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{summary.total_ration_bags.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Ration Bags</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpi_cards.map((kpi, index) => (
          <KpiCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            subtitle={kpi.subtitle}
            icon={getIconComponent(kpi.icon)}
            color={kpi.color as 'red' | 'orange' | 'blue' | 'green'}
          />
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compensation Progress Chart */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Compensation Processing Status</h2>
            <p className="text-sm text-gray-600">Progress of compensation claims processing</p>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={compensationProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value.toLocaleString(), name]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar dataKey="reported" fill="#94A3B8" name="Reported" />
                  <Bar dataKey="paid" fill="#3B82F6" name="Paid" />
                  <Line type="monotone" dataKey="percentage" stroke="#EF4444" strokeWidth={2} name="Completion %" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Relief Distribution Chart */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Relief Distribution Progress</h2>
            <p className="text-sm text-gray-600">Distribution of relief items and services</p>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={reliefDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value.toLocaleString(), name]}
                  />
                  <Bar dataKey="demanded" fill="#F59E0B" name="Demanded/Required" />
                  <Bar dataKey="distributed" fill="#10B981" name="Distributed/Done" />
                  <Line type="monotone" dataKey="percentage" stroke="#8B5CF6" strokeWidth={2} name="Completion %" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Districts by Compensation */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">{charts.bar_chart.title}</h2>
            <p className="text-sm text-gray-600">Districts with highest compensation disbursements</p>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.bar_chart.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value) => [value.toLocaleString(), 'Compensation Paid']} />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Compensation Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">{charts.pie_chart.title}</h2>
            <p className="text-sm text-gray-600">Breakdown of total compensation paid by category</p>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.pie_chart.data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {charts.pie_chart.data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value.toLocaleString(), 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Relief Operations Progress */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Relief Operations Progress Overview</h2>
          <p className="text-sm text-gray-600">Overall progress across different relief operation categories</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {reliefOperationsProgressData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{item.category}</h3>
                  <div className="text-sm text-gray-600">
                    {item.processed.toLocaleString()} / {item.reported.toLocaleString()} 
                    <span className="ml-2 text-blue-600 font-medium">
                      ({item.percentage}% complete)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>{item.reported.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* District-wise Relief Summary Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">District-wise Relief Operations Summary</h2>
          <p className="text-sm text-gray-600">Comprehensive breakdown of relief operations by district</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>District</TableHead>
                  <TableHead className="text-right">Active Camps</TableHead>
                  <TableHead className="text-right">People in Camps</TableHead>
                  <TableHead className="text-right">Compensation Paid</TableHead>
                  <TableHead className="text-right">Relief Distributed</TableHead>
                  <TableHead className="text-right">People Fed</TableHead>
                  <TableHead className="text-right">Ration Bags</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {district_data.map((district) => (
                  <TableRow key={district.district}>
                    <TableCell className="font-medium">{district.district}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span>{district.active_relief_camps}</span>
                        {district.active_relief_camps > 0 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{district.people_in_relief_camps.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {(district.death_comp_paid + district.injury_comp_paid + district.house_damage_paid + district.livestock_comp_paid + district.agriculture_comp_paid).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {(district.shelter_distributed + district.nfis_distributed).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">{district.people_cooked_food.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{district.ration_bags_distributed.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getDistrictStatusBadge(district)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* District Relief Operations Comparison */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">District Relief Operations Comparison</h2>
          <p className="text-sm text-gray-600">Multi-dimensional comparison of relief operations across active districts</p>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={districtComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="district" angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [value.toLocaleString(), name]}
                  labelFormatter={(label) => `District: ${label}`}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="activeCamps" fill="#3B82F6" name="Active Camps" />
                <Bar yAxisId="left" dataKey="peopleInCamps" fill="#10B981" name="People in Camps" />
                <Line yAxisId="right" type="monotone" dataKey="compensationPaid" stroke="#EF4444" strokeWidth={2} name="Compensation Paid" />
                <Line yAxisId="right" type="monotone" dataKey="reliefDistributed" stroke="#F59E0B" strokeWidth={2} name="Relief Distributed" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Relief Operations Heat Map */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Relief Operations Intensity Heat Map</h2>
          <p className="text-sm text-gray-600">Geographic distribution of relief operations intensity by district</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {charts.heat_map.data.map((item) => (
              <div key={item.district} className="relative">
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm text-gray-900">{item.district}</h3>
                    <Badge 
                      variant="secondary" 
                      className={`${
                        item.normalized_intensity > 0.7 ? 'bg-red-100 text-red-800' :
                        item.normalized_intensity > 0.4 ? 'bg-orange-100 text-orange-800' :
                        item.normalized_intensity > 0.1 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.normalized_intensity > 0.7 ? 'High' :
                       item.normalized_intensity > 0.4 ? 'Medium' :
                       item.normalized_intensity > 0.1 ? 'Low' : 'Minimal'}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${item.normalized_intensity * 100}%`,
                        backgroundColor: item.normalized_intensity > 0.7 ? '#EF4444' :
                                        item.normalized_intensity > 0.4 ? '#F59E0B' :
                                        item.normalized_intensity > 0.1 ? '#EAB308' : '#6B7280'
                      }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    Intensity: {item.intensity.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions
function getIconComponent(iconName: string) {
  const iconMap: { [key: string]: any } = {
    compensation: Award,
    medical: Shield,
    house: Building,
    camp: Tent,
    users: Users,
    activity: Activity,
    trending: TrendingUp,
    target: Target,
    clock: Clock,
    check: CheckCircle,
    alert: AlertTriangle
  };
  
  return iconMap[iconName] || Activity;
}

function getDistrictStatusBadge(district: any) {
  const totalCompensation = district.death_comp_paid + district.injury_comp_paid + district.house_damage_paid + district.livestock_comp_paid + district.agriculture_comp_paid;
  const totalRelief = district.shelter_distributed + district.nfis_distributed;
  
  if (district.active_relief_camps > 0) {
    return <Badge className="bg-green-100 text-green-800">Active Camps</Badge>;
  } else if (totalCompensation > 50) {
    return <Badge className="bg-blue-100 text-blue-800">High Compensation</Badge>;
  } else if (totalRelief > 1000) {
    return <Badge className="bg-orange-100 text-orange-800">High Relief</Badge>;
  } else if (district.people_cooked_food > 1000) {
    return <Badge className="bg-purple-100 text-purple-800">Food Distribution</Badge>;
  } else {
    return <Badge variant="outline" className="text-gray-600">Limited Activity</Badge>;
  }
}