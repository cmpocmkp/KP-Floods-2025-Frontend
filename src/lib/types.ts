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

export interface DivisionSummaryResponse {
  rows: DivisionSummaryRow[];
  totals: {
    deaths: number;
    injured: number;
    houses_damaged: number;
    schools_damaged: number;
    livestock_lost: number;
  };
  last_updated: string;
}

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