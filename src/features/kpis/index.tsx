
import { KpiCard } from '@/components/ui/kpi-card';
import {
  Skull,
  Home,
  Beef,
  FileText,
  AlertTriangle,
  Calendar,
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
  Zap,
  Droplets,
  Flame,
  Phone,
  Signal,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCompensationSummary } from '@/api/compensation';
import { getLivestockSummary } from '@/api/livestock';
import { getCombinedInfrastructureServices } from '@/api/infrastructure';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  // This component is now empty since Infrastructure Damage KPIs moved to InfrastructurePage
  // and Services Status KPIs moved to ServiceStatusCards component
  return null;
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

export function GlobalSummaryCards() {
  const { data: combinedData, isLoading } = useQuery({
    queryKey: ['combined-infrastructure-services'],
    queryFn: () => getCombinedInfrastructureServices(),
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

  if (!combinedData || !combinedData.infrastructure?.summary || !combinedData.services?.summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div data-testid="global-summary-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Districts Affected</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{combinedData.infrastructure.summary.total_districts}</div>
          <p className="text-xs text-muted-foreground">
            Infrastructure & Services
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Houses Damaged</CardTitle>
          <Home className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {(combinedData.infrastructure.summary.total_houses_fully_damaged + combinedData.infrastructure.summary.total_houses_partially_damaged).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Fully + Partially Damaged
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Services Disconnections</CardTitle>
          <Zap className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {(combinedData.services.summary.total_feeders_disconnections + combinedData.services.summary.total_water_disconnections + combinedData.services.summary.total_gas_disconnections).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Electricity + Water + Gas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inaccessible Areas</CardTitle>
          <Signal className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{combinedData.services.summary.total_inaccessible_areas.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Areas without connectivity
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function ServiceStatusCards() {
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

  if (!infraData || !infraData.services?.summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const servicesSummary = infraData.services.summary;

  return (
    <div data-testid="service-status-cards">
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
  );
}