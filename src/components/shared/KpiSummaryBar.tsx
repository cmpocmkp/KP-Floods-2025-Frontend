import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skull, Activity, Banknote, HandCoins } from 'lucide-react';
import { KpiCard } from '@/components/ui/kpi-card';
import { getCumulativeDashboard } from '@/lib/overview';
import type { CumulativeDashboardResponse } from '@/lib/types';

interface KpiSummaryBarProps {
  totals?: any;
  isLoading?: boolean;
  isError?: boolean;
}

export function KpiSummaryBar({ totals, isLoading, isError }: KpiSummaryBarProps) {
  const { data: kpiData } = useQuery({
    queryKey: ['cumulative-dashboard'],
    queryFn: getCumulativeDashboard,
  });

  if (isLoading || !kpiData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-red-50 rounded-lg border border-red-200 flex items-center justify-center">
            <span className="text-red-600 text-sm">Error loading data</span>
          </div>
        ))}
      </div>
    );
  }

  const { human } = kpiData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Total Deaths"
        value={human.deaths}
        icon={Skull}
        color="text-red-600"
      />
      <KpiCard
        title="Approx Economic Loss"
        value="~124.6B PKR"
        icon={Banknote}
        color="text-yellow-600"
      />
      <KpiCard
        title="Approx Monetary Loss"
        value="~49.07B PKR"
        icon={Banknote}
        color="text-blue-600"
      />
      <KpiCard
        title="Approx Compensation"
        value="~4.18B PKR"
        icon={HandCoins}
        color="text-green-600"
      />
    </div>
  );
} 