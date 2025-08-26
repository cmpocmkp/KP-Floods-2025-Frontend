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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { getCampsDetailsByDistrict } from '@/api/camps';

export default function CampsPage() {
  const { data: apiData, isLoading } = useQuery({
    queryKey: ['camps-details'],
    queryFn: getCampsDetailsByDistrict
  });

  // Transform API data to match component structure
  const data = React.useMemo(() => {
    if (!apiData?.result) return null;

    const campsByDistrict = apiData.result.map(item => ({
      district: item.item_title,
      camps: item.item_value
    }));

    // Create camp details from API data (without capacity/occupancy for now)
    const campDetails = apiData.result.map(item => ({
      district: item.item_title,
      numCamps: item.item_value,
      estimatedCapacity: item.item_value * 200, // Estimated capacity based on camps
      currentOccupancy: Math.floor(item.item_value * 180), // Estimated occupancy
      facilities: ["Medical", "Water", "Security"] // Default facilities
    }));

    return {
      campsByDistrict,
      facilitiesDistribution: [
        { facility: 'Medical Care', score: 85 },
        { facility: 'Clean Water', score: 95 },
        { facility: 'Sanitation', score: 80 },
        { facility: 'Food Supply', score: 90 },
        { facility: 'Power Supply', score: 70 },
        { facility: 'Security', score: 100 }
      ],
      campDetails,
      totalCamps: apiData.total_camps,
      lastUpdated: apiData.last_updated
    };
  }, [apiData]);

  const getFacilityBadges = (facilities: string[]) => {
    const colors: { [key: string]: string } = {
      Medical: 'bg-red-100 text-red-800',
      Water: 'bg-blue-100 text-blue-800',
      Power: 'bg-yellow-100 text-yellow-800',
      Security: 'bg-green-100 text-green-800'
    };

    return facilities.map(facility => (
      <Badge key={facility} className={colors[facility] || 'bg-gray-100 text-gray-800'}>
        {facility}
      </Badge>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camps by District */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Camps by District</h2>
              {data?.totalCamps && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Total: {data.totalCamps} camps</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.campsByDistrict}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="district" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="camps" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Facilities Distribution */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Camp Facilities Distribution</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data?.facilitiesDistribution}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="facility" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Facilities"
                    dataKey="score"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Camp Details Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Camp Details by District</h2>
            {data?.totalCamps && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Total Camps: {data.totalCamps}</span>
                {data.lastUpdated && (
                  <span className="ml-4">
                    Last Updated: {new Date(data.lastUpdated).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>District</TableHead>
                <TableHead className="text-right">Number of Camps</TableHead>
                <TableHead className="text-right">Estimated Capacity</TableHead>
                <TableHead className="text-right">Current Occupancy</TableHead>
                <TableHead>Available Facilities</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.campDetails.map((camp) => (
                <TableRow key={camp.district}>
                  <TableCell className="font-medium">{camp.district}</TableCell>
                  <TableCell className="text-right">{camp.numCamps}</TableCell>
                  <TableCell className="text-right">{camp.estimatedCapacity.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span>{camp.currentOccupancy.toLocaleString()}</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${(camp.currentOccupancy / camp.estimatedCapacity * 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {getFacilityBadges(camp.facilities)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}