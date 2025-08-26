
import { KpiCard } from '@/components/ui/kpi-card';
import {
  Skull,
  Home,
  Beef,
  FileText,
  AlertTriangle,
  Droplets,
  Calendar,
  StretchHorizontal, // Instead of Road
  Building2, // Instead of Bridge
  Construction,
  Timer,
  Package,
  PackageCheck,
  PackageSearch,
  AlertCircle,
  Users,
  Building,
  Tent,
  MapPin,
  DollarSign,
  Activity,

} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCompensationSummary } from '@/api/compensation';

import type { CumulativeDashboardResponse } from '@/lib/types';

export function OverviewKpis({ data }: { data?: CumulativeDashboardResponse }) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const { human } = data;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Total Deaths"
        value={human.deaths}
        icon={Skull}
        color="text-red-600"
      />
      <KpiCard
        title="Total Injured"
        value={human.injured}
        icon={Activity}
        color="text-yellow-600"
      />
      <KpiCard
        title="Houses Damaged"
        value={human.housesDamaged}
        icon={Home}
        color="text-blue-600"
      />
      <KpiCard
        title="Livestock Lost"
        value={human.livestockLost}
        icon={Beef}
        color="text-green-600"
      />
    </div>
  );
}

export function IncidentKpis({ data }: { data?: CumulativeDashboardResponse }) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const { incidents } = data;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Total Incidents"
        value={incidents.total}
        icon={FileText}
        color="text-blue-600"
      />
      <KpiCard
        title="Critical Incidents"
        value={incidents.critical}
        icon={AlertTriangle}
        color="text-red-600"
      />
      <KpiCard
        title="Flood Related"
        value={incidents.floodRelated}
        icon={Droplets}
        color="text-cyan-600"
      />
      <KpiCard
        title="Last 24 Hours"
        value={incidents.last24h}
        icon={Calendar}
        color="text-purple-600"
      />
    </div>
  );
}

export function InfrastructureKpis({ data }: { data?: CumulativeDashboardResponse }) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const { infrastructure } = data;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Roads Damaged"
        value={`${infrastructure.roadsDamagedKm} km`}
        icon={StretchHorizontal}
        color="text-orange-600"
      />
      <KpiCard
        title="Bridges Damaged"
        value={infrastructure.bridgesDamaged}
        icon={Building2}
        color="text-blue-600"
      />
      <KpiCard
        title="Culverts Damaged"
        value={infrastructure.culvertsDamaged}
        icon={Construction}
        color="text-yellow-600"
      />
      <KpiCard
        title="Avg. Restoration Time"
        value={`${infrastructure.avgRestorationDays} days`}
        icon={Timer}
        color="text-green-600"
      />
    </div>
  );
}

export function WarehouseKpis({ data }: { data?: CumulativeDashboardResponse }) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const { inventory } = data;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Total Items"
        value={inventory.totalItems}
        icon={Package}
        color="text-blue-600"
      />
      <KpiCard
        title="Items Issued"
        value={inventory.itemsIssued}
        icon={PackageCheck}
        color="text-green-600"
      />
      <KpiCard
        title="Items Requested"
        value={inventory.itemsRequested}
        icon={PackageSearch}
        color="text-yellow-600"
      />
      <KpiCard
        title="Low Stock Items"
        value={inventory.lowStock}
        icon={AlertCircle}
        color="text-red-600"
      />
    </div>
  );
}

export function CampsKpis({ data }: { data?: CumulativeDashboardResponse }) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const { camps } = data;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Total Camps"
        value={camps.totalCamps}
        icon={Tent}
        color="text-blue-600"
      />
      <KpiCard
        title="Districts with Camps"
        value={camps.districtsWithCamps}
        icon={MapPin}
        color="text-purple-600"
      />
      <KpiCard
        title="Total Occupants"
        value={camps.totalOccupants}
        icon={Users}
        color="text-green-600"
      />
      <KpiCard
        title="Capacity Utilization"
        value={`${camps.capacityUtilizationPct}%`}
        icon={Building}
        color="text-yellow-600"
      />
    </div>
  );
}

export function CompensationKpis() {
  const { data: compensationData, isLoading } = useQuery({
    queryKey: ['compensation-summary'],
    queryFn: () => getCompensationSummary()
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const totalCompensation = compensationData?.totalCompensation || 0;
  const totalDeaths = compensationData?.totalDeaths || 0;
  const totalInjured = compensationData?.totalInjured || 0;
  const totalHousesDamaged = compensationData?.totalHousesDamaged || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Total Compensation"
        value={`PKR ${(totalCompensation / 1000000000).toFixed(1)}B`}
        icon={DollarSign}
        color="text-green-600"
      />
      <KpiCard
        title="Total Deaths"
        value={totalDeaths.toString()}
        icon={Skull}
        color="text-red-600"
      />
      <KpiCard
        title="Total Injured"
        value={totalInjured.toString()}
        icon={Activity}
        color="text-orange-600"
      />
      <KpiCard
        title="Houses Damaged"
        value={totalHousesDamaged.toString()}
        icon={Home}
        color="text-blue-600"
      />
    </div>
  );
}