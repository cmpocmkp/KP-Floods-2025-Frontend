import React from 'react';
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
  UserCheck,
  Wallet,
  ClipboardCheck,
  Clock
} from 'lucide-react';

import { OverviewResponse } from '@/lib/types';

export function OverviewKpis({ data }: { data?: OverviewResponse }) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const { totals } = data;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Total Deaths"
        value={totals.deaths}
        icon={Skull}
        color="text-red-600"
      />
      <KpiCard
        title="Total Injured"
        value={totals.injured}
        icon={Heart}
        color="text-yellow-600"
      />
      <KpiCard
        title="Houses Damaged"
        value={totals.houses_damaged}
        icon={Home}
        color="text-blue-600"
      />
      <KpiCard
        title="Livestock Lost"
        value={totals.livestock_lost}
        icon={Beef}
        color="text-green-600"
      />
    </div>
  );
}

export function IncidentKpis({ data }: { data: any }) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Total Incidents"
        value={data?.totalIncidents || 0}
        icon={FileText}
        color="text-blue-600"
      />
      <KpiCard
        title="Critical Incidents"
        value={data?.criticalIncidents || 0}
        icon={AlertTriangle}
        color="text-red-600"
      />
      <KpiCard
        title="Flood Related"
        value={data?.floodIncidents || 0}
        icon={Droplets}
        color="text-cyan-600"
      />
      <KpiCard
        title="Last 24 Hours"
        value={data?.recentIncidents || 0}
        icon={Calendar}
        color="text-purple-600"
      />
    </div>
  );
}

export function InfrastructureKpis({ data }: { data: any }) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Roads Damaged"
        value={`${data?.roadsDamaged || 0} km`}
        icon={StretchHorizontal}
        color="text-orange-600"
      />
      <KpiCard
        title="Bridges Damaged"
        value={data?.bridgesDamaged || 0}
        icon={Building2}
        color="text-blue-600"
      />
      <KpiCard
        title="Culverts Damaged"
        value={data?.culvertsDamaged || 0}
        icon={Construction}
        color="text-yellow-600"
      />
      <KpiCard
        title="Avg. Restoration Time"
        value={`${data?.avgRestorationDays || 0} days`}
        icon={Timer}
        color="text-green-600"
      />
    </div>
  );
}

export function WarehouseKpis({ data }: { data: any }) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Total Items"
        value={data?.totalItems || 0}
        icon={Package}
        color="text-blue-600"
      />
      <KpiCard
        title="Items Issued"
        value={data?.itemsIssued || 0}
        icon={PackageCheck}
        color="text-green-600"
      />
      <KpiCard
        title="Items Requested"
        value={data?.itemsRequested || 0}
        icon={PackageSearch}
        color="text-yellow-600"
      />
      <KpiCard
        title="Low Stock Items"
        value={data?.lowStockItems || 0}
        icon={AlertCircle}
        color="text-red-600"
      />
    </div>
  );
}

export function CampsKpis({ data }: { data: any }) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Total Camps"
        value={data?.totalCamps || 0}
        icon={Tent}
        color="text-blue-600"
      />
      <KpiCard
        title="Districts with Camps"
        value={data?.districtsWithCamps || 0}
        icon={MapPin}
        color="text-purple-600"
      />
      <KpiCard
        title="Total Occupants"
        value={data?.totalOccupants || 0}
        icon={Users}
        color="text-green-600"
      />
      <KpiCard
        title="Capacity Utilization"
        value={`${data?.capacityUtilization || 0}%`}
        icon={Building}
        color="text-yellow-600"
      />
    </div>
  );
}

export function CompensationKpis({ data }: { data: any }) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Affected Families"
        value={data?.totalBeneficiaries || 0}
        icon={Users}
        color="text-blue-600"
      />
      <KpiCard
        title="Cases Processed"
        value={data?.beneficiariesPaid || 0}
        icon={UserCheck}
        color="text-green-600"
      />
      <KpiCard
        title="Amount Disbursed"
        value={`Rs ${(data?.amountDisbursed || 0).toLocaleString()}`}
        icon={Wallet}
        color="text-purple-600"
      />
      <KpiCard
        title="Pending Cases"
        value={data?.pendingCases || 0}
        icon={Clock}
        color="text-yellow-600"
      />
    </div>
  );
}