import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LeafletMap } from '@/features/overview/LeafletMap';
import { IncidentTrendsChart } from '@/features/overview/IncidentTrendsChart';
import { DamageDonut } from '@/features/overview/DamageDonut';
import { DivisionSummaryTable } from '@/features/overview/DivisionSummaryTable';

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7">
          <LeafletMap />
        </div>
        <div className="xl:col-span-5">
          <DamageDonut />
        </div>
      </div>
      
      <div className="xl:col-span-12">
        <DivisionSummaryTable />
      </div>

      <div className="xl:col-span-12">
        <IncidentTrendsChart />
      </div>
    </div>
  );
}