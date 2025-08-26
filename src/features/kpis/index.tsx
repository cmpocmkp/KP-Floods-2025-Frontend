
import { KpiCard } from '@/components/ui/kpi-card';
import {
  Skull,
  Heart,
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

} from 'lucide-react';

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
        icon={Heart}
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="col-span-full flex items-center justify-center h-64 bg-muted/20 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-medium text-muted-foreground mb-2">
            Compensation Data Not Available
          </div>
          <div className="text-sm text-muted-foreground">
            The current dashboard API does not provide compensation statistics.
          </div>
        </div>
      </div>
    </div>
  );
}