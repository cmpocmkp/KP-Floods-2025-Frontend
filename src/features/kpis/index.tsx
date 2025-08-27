
import { KpiCard } from '@/components/ui/kpi-card';
import {
  Skull,
  Home,
  Beef,
  FileText,
  AlertTriangle,
  Calendar,
  StretchHorizontal, // Instead of Road
  Building2, // Instead of Bridge
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
  ShoppingBag,
  GraduationCap,
  Heart,
  Building as OfficeBuilding,
  Zap,
  Droplets,
  Flame,
  Phone,

} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCompensationSummary } from '@/api/compensation';
import { getLivestockSummary } from '@/api/livestock';
import { getCombinedInfrastructureServices } from '@/api/infrastructure';

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

export function InfrastructureKpis() {
  const { data: infraData, isLoading } = useQuery({
    queryKey: ['combined-infrastructure-services'],
    queryFn: () => getCombinedInfrastructureServices()
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!infraData || !infraData.infrastructure?.summary || !infraData.services?.summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const infraSummary = infraData.infrastructure.summary;
  const servicesSummary = infraData.services.summary;

  return (
    <div className="space-y-6">
      {/* Infrastructure Damage KPIs */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-center">🏗️ Infrastructure Damage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Houses Fully Damaged"
            value={infraSummary.total_houses_fully_damaged.toLocaleString()}
            icon={Home}
            color="text-red-600"
          />
          <KpiCard
            title="Houses Partially Damaged"
            value={infraSummary.total_houses_partially_damaged.toLocaleString()}
            icon={Home}
            color="text-orange-600"
          />
          <KpiCard
            title="Shops Damaged"
            value={infraSummary.total_shops_damaged.toLocaleString()}
            icon={ShoppingBag}
            color="text-yellow-600"
          />
          <KpiCard
            title="Education Facilities Damaged"
            value={infraSummary.total_education_facilities_damaged.toLocaleString()}
            icon={GraduationCap}
            color="text-blue-600"
          />
          <KpiCard
            title="Health Facilities Damaged"
            value={infraSummary.total_health_facilities_damaged.toLocaleString()}
            icon={Heart}
            color="text-purple-600"
          />
          <KpiCard
            title="Govt Offices Damaged"
            value={infraSummary.total_govt_offices_damaged.toLocaleString()}
            icon={OfficeBuilding}
            color="text-indigo-600"
          />
          <KpiCard
            title="Roads Damaged"
            value={`${infraSummary.total_roads_damaged_length_km.toLocaleString()} km`}
            icon={StretchHorizontal}
            color="text-green-600"
          />
          <KpiCard
            title="Bridges Damaged"
            value={(infraSummary.total_permanent_bridges_damaged + infraSummary.total_pedestrian_bridges_damaged).toLocaleString()}
            icon={Building2}
            color="text-teal-600"
          />
        </div>
      </div>

      {/* Services Status KPIs */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-center">⚡ Services Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Electricity Disconnections"
            value={servicesSummary.total_feeders_disconnections.toLocaleString()}
            icon={Zap}
            color="text-yellow-500"
          />
          <KpiCard
            title="Electricity Restored"
            value={servicesSummary.total_feeders_restored.toLocaleString()}
            icon={Zap}
            color="text-green-500"
          />
          <KpiCard
            title="Water Disconnections"
            value={servicesSummary.total_water_disconnections.toLocaleString()}
            icon={Droplets}
            color="text-blue-500"
          />
          <KpiCard
            title="Water Restored"
            value={servicesSummary.total_water_restored.toLocaleString()}
            icon={Droplets}
            color="text-cyan-500"
          />
          <KpiCard
            title="Gas Disconnections"
            value={servicesSummary.total_gas_disconnections.toLocaleString()}
            icon={Flame}
            color="text-red-500"
          />
          <KpiCard
            title="Gas Restored"
            value={servicesSummary.total_gas_restored.toLocaleString()}
            icon={Flame}
            color="text-orange-500"
          />
          <KpiCard
            title="Phone Disconnections"
            value={servicesSummary.total_ptcl_disconnections.toLocaleString()}
            icon={Phone}
            color="text-purple-500"
          />
          <KpiCard
            title="Phone Restored"
            value={servicesSummary.total_ptcl_restored.toLocaleString()}
            icon={Phone}
            color="text-pink-500"
          />
        </div>
      </div>
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

export function LivestockKpis() {
  const { data: livestockData, isLoading } = useQuery({
    queryKey: ['livestock-summary'],
    queryFn: () => getLivestockSummary()
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

  if (!livestockData) {
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
        title="Total Cattle Lost"
        value={livestockData.totalCattlesPerished.toLocaleString()}
        icon={Beef}
        color="text-red-600"
      />
      <KpiCard
        title="Shelters Damaged"
        value={livestockData.totalSheltersDamaged.toLocaleString()}
        icon={Home}
        color="text-orange-600"
      />
      <KpiCard
        title="Fodder Lost (Tons)"
        value={`${livestockData.totalFodderRoughagesTon.toLocaleString()}T`}
        icon={Package}
        color="text-green-600"
      />
      <KpiCard
        title="Affected Districts"
        value={livestockData.affectedDistricts.toString()}
        icon={MapPin}
        color="text-blue-600"
      />
    </div>
  );
}