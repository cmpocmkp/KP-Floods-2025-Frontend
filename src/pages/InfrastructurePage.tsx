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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getInfrastructureStatus, getInfrastructureByDistrict } from '@/api/infrastructure';
import { DEFAULT_DATE_RANGE } from '@/lib/api';

export default function InfrastructurePage() {
  const { 
    data: infraStatus, 
    isLoading: isStatusLoading,
    error: statusError
  } = useQuery({
    queryKey: ['infrastructure-status'],
    queryFn: () => getInfrastructureStatus({
      date_from: DEFAULT_DATE_RANGE.from,
      date_to: DEFAULT_DATE_RANGE.to
    }),
    retry: 1
  });

  const { 
    data: districtData, 
    isLoading: isDistrictLoading,
    error: districtError
  } = useQuery({
    queryKey: ['infrastructure-by-district'],
    queryFn: () => getInfrastructureByDistrict({
      date_from: DEFAULT_DATE_RANGE.from,
      date_to: DEFAULT_DATE_RANGE.to
    }),
    retry: 1
  });

  const isLoading = isStatusLoading || isDistrictLoading;

  // Handle loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Loading infrastructure data...</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-pulse">Loading...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle errors
  if (statusError || districtError) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-red-600">Error Loading Data</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-medium">Infrastructure Status Error:</h3>
                  <p className="text-sm text-red-600">{statusError instanceof Error ? statusError.message : 'Failed to load status data'}</p>
                </div>
              )}
              {districtError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-medium">District Data Error:</h3>
                  <p className="text-sm text-red-600">{districtError instanceof Error ? districtError.message : 'Failed to load district data'}</p>
                </div>
              )}
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

  const formattedDistrictData = districtData?.map(d => ({
    district: d.district,
    roadsDamaged: d.roads_km,
    bridgesDamaged: d.bridges,
    culvertsDamaged: d.culverts,
    totalLength: d.roads_km,
    restorationProgress: Math.round(d.restoration_progress * 100)
  })) || [];

  const formattedRestorationStatus = infraStatus ? [
    {
      name: 'Roads',
      'Fully Restored': infraStatus.roads_km.fully_restored,
      'Partially Restored': infraStatus.roads_km.partially_restored,
      'Not Restored': infraStatus.roads_km.not_restored
    },
    {
      name: 'Bridges',
      'Fully Restored': infraStatus.bridges.fully_restored,
      'Partially Restored': infraStatus.bridges.partially_restored,
      'Not Restored': infraStatus.bridges.not_restored
    },
    {
      name: 'Culverts',
      'Fully Restored': infraStatus.culverts.fully_restored,
      'Partially Restored': infraStatus.culverts.partially_restored,
      'Not Restored': infraStatus.culverts.not_restored
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Restoration Status Chart */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Infrastructure Restoration Status</h2>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedRestorationStatus}>
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
              {formattedDistrictData.map((row) => (
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


    </div>
  );
}