// Overview Types
export interface OverviewResponse {
  report_period: {
    from: string;
    to: string;
  };
  totals: {
    deaths: number;
    injured: number;
    houses_damaged: number;
    schools_damaged: number;
    livestock_lost: number;
  };
  last_updated: string;
  sources: string[];
}

// Cumulative Dashboard Types
export interface CumulativeDashboardResponse {
  human: {
    deaths: number;
    injured: number;
    housesDamaged: number;
    schoolsDamaged: number;
    livestockLost: number;
  };
  incidents: {
    total: number;
    critical: number;
    floodRelated: number;
    last24h: number;
  };
  infrastructure: {
    roadsDamagedKm: number;
    bridgesDamaged: number;
    culvertsDamaged: number;
    avgRestorationDays: number;
  };
  inventory: {
    totalItems: number;
    itemsIssued: number;
    itemsRequested: number;
    lowStock: number;
  };
  camps: {
    totalCamps: number;
    districtsWithCamps: number;
    totalOccupants: number;
    capacityUtilizationPct: number;
  };
  lastUpdated: string;
}

// Damage Distribution Types
export interface DamageDistributionResponse {
  total_incidents: number;
  buckets: Array<{
    key: string;
    value: number;
  }>;
}

// Division Summary Types
export interface DivisionSummaryRow {
  division: string;
  deaths: number;
  injured: number;
  houses_damaged: number;
  schools_damaged: number;
  livestock_lost: number;
}

export type DivisionSummaryResponse = DivisionSummaryRow[];

// Incident Trends Types
export interface IncidentTrendPoint {
  date: string;
  value: number;
}

export interface SingleSeriesTrendResponse {
  metric: string;
  scope: string | { district: string };
  group_by: 'daily' | 'weekly';
  series: IncidentTrendPoint[];
  last_updated: string;
  source: string;
}

export interface MultiDistrictTrendResponse {
  metric: string;
  series: Array<{
    district: string;
    series: IncidentTrendPoint[];
  }>;
}

// Common Types
export interface DateRangeParams {
  date_from?: string;
  date_to?: string;
}