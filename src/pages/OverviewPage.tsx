import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { OverviewKpis } from '@/features/kpis';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LeafletMap } from '@/features/overview/LeafletMap';
import { IncidentTrendsChart } from '@/features/overview/IncidentTrendsChart';
import { DamageDonut } from '@/features/overview/DamageDonut';
import { DivisionSummaryTable } from '@/features/overview/DivisionSummaryTable';

export default function OverviewPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['overview', 'topline'],
    queryFn: () => Promise.resolve({
      deaths: 156,
      injured: 342,
      housesDamaged: 1245,
      livestockLost: 789,
      // Add more data as needed
    })
  });

  return (
    <div className="space-y-6">
      <OverviewKpis data={data} />
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7">
          <LeafletMap />
        </div>
        <div className="xl:col-span-5">
          <IncidentTrendsChart />
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5">
          <DamageDonut />
        </div>
        <div className="xl:col-span-7">
          <DivisionSummaryTable />
        </div>
      </div>
    </div>
  );
}