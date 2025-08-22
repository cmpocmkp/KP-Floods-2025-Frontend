import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { InfrastructureKpis } from '@/features/kpis';
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

interface InfrastructureData {
  district: string;
  roadsDamaged: number;
  bridgesDamaged: number;
  culvertsDamaged: number;
  totalLength: number;
  restorationProgress: number;
}

interface RoadSituation {
  id: number;
  title: string;
  date: string;
  description: string;
  status: 'In Progress' | 'Completed' | 'Pending';
}

export default function InfrastructurePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['infrastructure-overview'],
    queryFn: () => Promise.resolve({
      roadsDamaged: 342,
      bridgesDamaged: 28,
      culvertsDamaged: 156,
      avgRestorationDays: 45,
      districtData: [
        {
          district: "Peshawar",
          roadsDamaged: 45,
          bridgesDamaged: 5,
          culvertsDamaged: 23,
          totalLength: 78.5,
          restorationProgress: 65
        },
        {
          district: "Charsadda",
          roadsDamaged: 38,
          bridgesDamaged: 3,
          culvertsDamaged: 18,
          totalLength: 52.3,
          restorationProgress: 45
        },
        // Add more districts as needed
      ],
      restorationStatus: [
        {
          name: 'Roads',
          'Fully Restored': 120,
          'Partially Restored': 150,
          'Not Restored': 72
        },
        {
          name: 'Bridges',
          'Fully Restored': 8,
          'Partially Restored': 12,
          'Not Restored': 8
        },
        {
          name: 'Culverts',
          'Fully Restored': 45,
          'Partially Restored': 68,
          'Not Restored': 43
        }
      ],
      roadSituations: [
        {
          id: 1,
          title: "N-35 Highway Damage",
          date: "2025-08-19",
          description: "Major landslide damage on Karakoram Highway near Battagram. Emergency repairs underway.",
          status: "In Progress"
        },
        {
          id: 2,
          title: "Swat Bridge Collapse",
          date: "2025-08-18",
          description: "Bridge connecting Mingora to surrounding villages partially collapsed due to flood waters.",
          status: "In Progress"
        }
      ]
    })
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <InfrastructureKpis data={data} />

      {/* Restoration Status Chart */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Infrastructure Restoration Status</h2>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.restorationStatus}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Fully Restored" stackId="a" fill="#22c55e" />
                <Bar dataKey="Partially Restored" stackId="a" fill="#eab308" />
                <Bar dataKey="Not Restored" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* District-wise Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">District-wise Infrastructure Damage</h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>District</TableHead>
                <TableHead className="text-right">Roads Damaged</TableHead>
                <TableHead className="text-right">Bridges Damaged</TableHead>
                <TableHead className="text-right">Culverts Damaged</TableHead>
                <TableHead className="text-right">Total Length (KM)</TableHead>
                <TableHead className="text-right">Restoration Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.districtData.map((row: InfrastructureData) => (
                <TableRow key={row.district}>
                  <TableCell className="font-medium">{row.district}</TableCell>
                  <TableCell className="text-right">{row.roadsDamaged}</TableCell>
                  <TableCell className="text-right">{row.bridgesDamaged}</TableCell>
                  <TableCell className="text-right">{row.culvertsDamaged}</TableCell>
                  <TableCell className="text-right">{row.totalLength.toFixed(1)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${row.restorationProgress}%` }}
                        />
                      </div>
                      <span className="text-sm">{row.restorationProgress}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Road Situations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.roadSituations.map((situation: RoadSituation) => (
          <Card key={situation.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{situation.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(situation.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <Badge className={getStatusColor(situation.status)}>
                  {situation.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{situation.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}