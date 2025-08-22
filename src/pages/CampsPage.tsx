import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CampsKpis } from '@/features/kpis';
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

interface CampData {
  district: string;
  numCamps: number;
  estimatedCapacity: number;
  currentOccupancy: number;
  facilities: string[];
}

export default function CampsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['camps-overview'],
    queryFn: () => Promise.resolve({
      totalCamps: 86,
      districtsWithCamps: 12,
      totalOccupants: 12450,
      capacityUtilization: 78,
      campsByDistrict: [
        { district: 'Peshawar', camps: 18 },
        { district: 'Charsadda', camps: 15 },
        { district: 'Nowshera', camps: 12 },
        { district: 'Swat', camps: 10 },
        { district: 'Dir Lower', camps: 8 },
        { district: 'Chitral', camps: 7 },
        { district: 'Others', camps: 16 }
      ],
      facilitiesDistribution: [
        { facility: 'Medical Care', score: 85 },
        { facility: 'Clean Water', score: 95 },
        { facility: 'Sanitation', score: 80 },
        { facility: 'Food Supply', score: 90 },
        { facility: 'Power Supply', score: 70 },
        { facility: 'Security', score: 100 }
      ],
      campDetails: [
        {
          district: "Peshawar",
          numCamps: 18,
          estimatedCapacity: 3600,
          currentOccupancy: 3200,
          facilities: ["Medical", "Water", "Power", "Security"]
        },
        {
          district: "Charsadda",
          numCamps: 15,
          estimatedCapacity: 3000,
          currentOccupancy: 2800,
          facilities: ["Medical", "Water", "Security"]
        },
        {
          district: "Nowshera",
          numCamps: 12,
          estimatedCapacity: 2400,
          currentOccupancy: 2100,
          facilities: ["Medical", "Water", "Power", "Security"]
        }
      ]
    })
  });

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
      <CampsKpis data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camps by District */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Camps by District</h2>
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
          <h2 className="text-lg font-semibold">Camp Details by District</h2>
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
              {data?.campDetails.map((camp: CampData) => (
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