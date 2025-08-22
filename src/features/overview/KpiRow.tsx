import React from 'react';
import { KpiCard } from '@/components/ui/kpi-card';
import { Skull, Heart, Home, Beef } from 'lucide-react';

export function KpiRow({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Total Deaths"
        value={data?.deaths || 0}
        icon={Skull}
        color="text-red-600"
      />
      <KpiCard
        title="Total Injured"
        value={data?.injured || 0}
        icon={Heart}
        color="text-yellow-600"
      />
      <KpiCard
        title="Houses Damaged"
        value={data?.housesDamaged || 0}
        icon={Home}
        color="text-blue-600"
      />
      <KpiCard
        title="Livestock Lost"
        value={data?.livestockLost || 0}
        icon={Beef}
        color="text-green-600"
      />
    </div>
  );
}