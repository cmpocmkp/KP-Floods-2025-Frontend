import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { IncidentKpis } from '@/features/kpis';
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
import { format } from 'date-fns';

interface Incident {
  id: number;
  district: string;
  deaths: number;
  injured: number;
  housesDamaged: number;
  cause: string;
  date: string;
}

export default function IncidentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['incidents-overview'],
    queryFn: () => Promise.resolve({
      totalIncidents: 248,
      criticalIncidents: 42,
      floodIncidents: 156,
      recentIncidents: 18,
      incidents: [
        {
          id: 1,
          district: "Peshawar",
          deaths: 12,
          injured: 28,
          housesDamaged: 156,
          cause: "Flash Flood",
          date: "2025-08-19T10:30:00Z",
          description: "Sudden flash flood in local stream caused widespread damage..."
        },
        {
          id: 2,
          district: "Charsadda",
          deaths: 8,
          injured: 15,
          housesDamaged: 89,
          cause: "River Overflow",
          date: "2025-08-18T14:20:00Z",
          description: "River Swat overflow affected multiple villages..."
        }
      ]
    })
  });

  const getCauseBadgeColor = (cause: string) => {
    switch (cause.toLowerCase()) {
      case 'flash flood':
        return 'bg-red-100 text-red-800';
      case 'river overflow':
        return 'bg-blue-100 text-blue-800';
      case 'landslide':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <IncidentKpis data={data} />

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="px-3 py-1 bg-white">All</Badge>
        <Badge variant="outline" className="px-3 py-1">Peshawar</Badge>
        <Badge variant="outline" className="px-3 py-1">Charsadda</Badge>
        <Badge variant="outline" className="px-3 py-1">Nowshera</Badge>
      </div>

      {/* Incidents Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Recent Incidents</h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>District</TableHead>
                <TableHead className="text-right">Deaths</TableHead>
                <TableHead className="text-right">Injured</TableHead>
                <TableHead className="text-right">Houses Damaged</TableHead>
                <TableHead>Cause</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.incidents.map((incident: Incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-medium">{incident.district}</TableCell>
                  <TableCell className="text-right">{incident.deaths}</TableCell>
                  <TableCell className="text-right">{incident.injured}</TableCell>
                  <TableCell className="text-right">{incident.housesDamaged}</TableCell>
                  <TableCell>
                    <Badge className={getCauseBadgeColor(incident.cause)}>
                      {incident.cause}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(incident.date), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <button className="text-blue-600 hover:text-blue-800">
                      View Details
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Incident Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Flash Flood in Peshawar</h3>
            <p className="text-sm text-muted-foreground">
              August 19, 2025
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Sudden flash flood in local stream caused widespread damage to infrastructure
              and residential areas. Emergency response teams were deployed immediately.
            </p>
            <div className="flex gap-2">
              <Badge variant="destructive">12 Deaths</Badge>
              <Badge variant="warning">28 Injured</Badge>
              <Badge variant="secondary">156 Houses</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">River Overflow in Charsadda</h3>
            <p className="text-sm text-muted-foreground">
              August 18, 2025
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              River Swat overflow affected multiple villages in the district. Evacuation
              efforts are ongoing with support from local authorities.
            </p>
            <div className="flex gap-2">
              <Badge variant="destructive">8 Deaths</Badge>
              <Badge variant="warning">15 Injured</Badge>
              <Badge variant="secondary">89 Houses</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}