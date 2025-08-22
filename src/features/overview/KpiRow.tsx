import React from 'react';
import { Card } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { Skull, Heart, Home, Beef } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { overviewApi } from '@/lib/api';

function KpiCard({ 
  title, 
  value, 
  icon: Icon,
  loading,
  color = "text-gray-900"
}: { 
  title: string; 
  value?: number; 
  icon: React.ElementType;
  loading?: boolean;
  color?: string;
}) {
  return (
    <Card className="p-6 rounded-2xl">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{title}</div>
          {loading ? (
            <Skeleton className="h-10 w-24 mt-1" />
          ) : (
            <div className={`text-3xl md:text-4xl font-semibold mt-1 ${color}`}>
              {value?.toLocaleString()}
            </div>
          )}
        </div>
        <div className={`p-2 rounded-full bg-gray-100 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

export function KpiRow() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['overview', 'topline'],
    queryFn: () => overviewApi.getToplineMetrics()
  });

  const kpis = [
    { title: 'Total Deaths', value: metrics?.data.totalDeaths, icon: Skull, color: 'text-red-600' },
    { title: 'Total Injured', value: metrics?.data.totalInjured, icon: Heart, color: 'text-amber-600' },
    { title: 'Houses Damaged', value: metrics?.data.housesDamaged, icon: Home, color: 'text-blue-600' },
    { title: 'Livestock Lost', value: metrics?.data.livestockLost, icon: Beef, color: 'text-emerald-600' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <KpiCard
          key={kpi.title}
          title={kpi.title}
          value={kpi.value}
          icon={kpi.icon}
          loading={isLoading}
          color={kpi.color}
        />
      ))}
    </div>
  );
}