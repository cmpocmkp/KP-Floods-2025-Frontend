import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { LeafletMap } from '@/features/overview/LeafletMap';
import { IncidentTrendsChart } from '@/features/overview/IncidentTrendsChart';
import { DamageDonut } from '@/features/overview/DamageDonut';
import { DivisionSummaryTable } from '@/features/overview/DivisionSummaryTable';

export default function OverviewPage() {
  const handleGenerateSummary = () => {
    // TODO: Implement summary report generation
    console.log('Generate Summary Report clicked');
  };

  const handleGenerateDetail = () => {
    // TODO: Implement detailed report generation
    console.log('Generate Detail Report clicked');
  };

  return (
    <div className="space-y-6">
      {/* PDF Report Buttons */}
      <div className="flex gap-4">
        <Button 
          onClick={handleGenerateSummary}
          variant="outline"
          className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          <FileText className="h-4 w-4" />
          Generate Summary
        </Button>
        <Button 
          onClick={handleGenerateDetail}
          variant="outline"
          className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
        >
          <FileText className="h-4 w-4" />
          Generate Detail Report
        </Button>
      </div>

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