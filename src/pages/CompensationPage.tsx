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
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getCompensationSummary, COMPENSATION_RATES } from '@/api/compensation';

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#F97316'];

export default function CompensationPage() {
  const { data: compensationData, isLoading, error } = useQuery({
    queryKey: ['compensation-summary'],
    queryFn: () => getCompensationSummary()
  }) as { data: any; isLoading: boolean; error: any };

  // Prepare chart data
  const compensationByDistrict = React.useMemo(() => {
    if (!compensationData?.districtBreakdown) return [];
    return compensationData.districtBreakdown.map((district: any) => ({
      district: district.district,
      compensation: district.totalCompensation,
      deaths: district.casualties.deaths,
      injured: district.casualties.injured
    }));
  }, [compensationData]);

  const compensationByCategory = React.useMemo(() => {
    if (!compensationData?.districtBreakdown) return [];

    const categories = {
      'Casualties': 0,
      'Property': 0,
      'Livestock': 0,
      'Business': 0,
      'Vehicles': 0,
      'Agricultural': 0,
      'Support': 0
    };

    compensationData.districtBreakdown.forEach((district: any) => {
      categories.Casualties += district.casualties.deathCompensation + district.casualties.injuryCompensation;
      categories.Property += district.property.houseCompensation;
      categories.Livestock += district.livestock.cattleCompensation;
      categories.Business += district.business.businessCompensation;
      categories.Vehicles += district.vehicles.vehicleCompensation;
      categories.Agricultural += district.agricultural.cropsCompensation + district.agricultural.orchardsCompensation + district.agricultural.treesCompensation;
      categories.Support += district.support.familyRationSupport;
    });

    return Object.entries(categories).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    }));
  }, [compensationData]);

  const getCategoryBadge = (category: string) => {
    const colors: { [key: string]: string } = {
      casualties: 'bg-red-100 text-red-800',
      property: 'bg-blue-100 text-blue-800',
      agricultural: 'bg-green-100 text-green-800',
      business: 'bg-yellow-100 text-yellow-800',
      vehicle: 'bg-purple-100 text-purple-800',
      livestock: 'bg-orange-100 text-orange-800',
      support: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading compensation data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">
          Error loading compensation data: {error.message}
        </div>
      </div>
    );
  }

  // Show KPI cards even if data is not available
  const totalCompensation = compensationData?.totalCompensation || 0;
  const totalDeaths = compensationData?.totalDeaths || 0;
  const totalInjured = compensationData?.totalInjured || 0;
  const totalHousesDamaged = compensationData?.totalHousesDamaged || 0;
  const totalDistricts = compensationData?.totalDistricts || 0;

  return (
    <div className="space-y-6">
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compensation by District */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Compensation by District</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compensationByDistrict}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="district" />
                  <YAxis
                    tickFormatter={(value) =>
                      `${(value / 1000000000).toFixed(1)} B PKR`
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Total Compensation"
                    ]}
                  />
                  <Bar dataKey="compensation" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Compensation by Category */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Compensation by Category</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={compensationByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {compensationByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compensation Policy Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Compensation Policy Rates</h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Compensation Type</TableHead>
                <TableHead className="text-right">Amount (PKR)</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMPENSATION_RATES.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell className="font-medium">{rate.id}</TableCell>
                  <TableCell>{rate.type}</TableCell>
                  <TableCell className="text-right font-mono">
                    {rate.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryBadge(rate.category)}>
                      {rate.category}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* District-wise Detailed Breakdown */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">District-wise Compensation Breakdown</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>District</TableHead>
                  <TableHead className="text-right">Deaths</TableHead>
                  <TableHead className="text-right">Injured</TableHead>
                  <TableHead className="text-right">Houses Damaged</TableHead>
                  <TableHead className="text-right">Cattle Lost</TableHead>
                  <TableHead className="text-right">Total Compensation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {compensationData?.districtBreakdown.map((district: any) => (
                  <TableRow key={district.district}>
                    <TableCell className="font-medium">{district.district}</TableCell>
                    <TableCell className="text-right">{district.casualties.deaths}</TableCell>
                    <TableCell className="text-right">{district.casualties.injured}</TableCell>
                    <TableCell className="text-right">
                      {district.property.housesFullyDamaged + district.property.housesPartiallyDamaged}
                    </TableCell>
                    <TableCell className="text-right">{district.livestock.cattlePerished}</TableCell>
                    <TableCell className="text-right font-mono font-bold">
                      {formatCurrency(district.totalCompensation)}
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