export interface CampDetailsByDistrictItem {
  key_id: number;
  item_value: number;
  item_title: string;
  last_updated: string;
  _id: string;
}

export interface CampDetailsByDistrictResponse {
  success: boolean;
  total_camps: number;
  result: CampDetailsByDistrictItem[];
  last_updated: string;
}

// Relief Operations API Types
export interface ReliefSummary {
  total_death_comp_reported: number;
  total_death_comp_paid: number;
  total_injury_comp_reported: number;
  total_injury_comp_paid: number;
  total_house_damage_reported: number;
  total_house_damage_paid: number;
  total_livestock_comp_reported: number;
  total_livestock_comp_paid: number;
  total_agriculture_comp_reported: number;
  total_agriculture_comp_paid: number;
  total_people_cooked_food: number;
  total_ration_bags: number;
  total_shelter_demanded: number;
  total_shelter_distributed: number;
  total_nfis_demanded: number;
  total_nfis_distributed: number;
  total_dewatering_required: number;
  total_dewatering_done: number;
  total_desilting_required: number;
  total_desilting_done: number;
  total_active_camps: number;
  total_people_in_camps: number;
  affected_districts: number;
}

export interface KpiCard {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: string;
  trend: string;
  category: string;
}

export interface ChartData {
  name: string;
  value: number;
  district?: string;
}

export interface BarChartData {
  title: string;
  data: ChartData[];
  x_axis: string;
  y_axis: string;
}

export interface PieChartData {
  title: string;
  data: ChartData[];
  total: number;
}

export interface LineChartData {
  title: string;
  data: Array<{
    category: string;
    reported?: number;
    processed?: number;
    demanded?: number;
    distributed?: number;
    required?: number;
    completed?: number;
  }>;
  x_axis: string;
  y_axis: string;
}

export interface ScatterPlotData {
  title: string;
  data: Array<{
    district: string;
    compensation_paid: number;
    relief_distributed: number;
    people_served: number;
  }>;
  x_axis: string;
  y_axis: string;
}

export interface DivisionSummaryData {
  title: string;
  data: Array<{
    district: string;
    total_compensation_paid: number;
    total_relief_distributed: number;
    active_camps: number;
    people_in_camps: number;
  }>;
}

export interface HeatMapData {
  title: string;
  data: Array<{
    district: string;
    intensity: number;
    normalized_intensity: number;
  }>;
}

export interface Charts {
  bar_chart: BarChartData;
  pie_chart: PieChartData;
  line_chart: LineChartData;
  scatter_plot: ScatterPlotData;
  division_summary: DivisionSummaryData;
  heat_map: HeatMapData;
}

export interface DistrictData {
  district: string;
  death_comp_reported: number;
  death_comp_paid: number;
  injury_comp_reported: number;
  injury_comp_paid: number;
  house_damage_reported: number;
  house_damage_paid: number;
  livestock_comp_reported: number;
  livestock_comp_paid: number;
  agriculture_comp_reported: number;
  agriculture_comp_paid: number;
  people_cooked_food: number;
  ration_bags_distributed: number;
  shelter_demanded: number;
  shelter_distributed: number;
  shelter_available: number;
  nfis_demanded: number;
  nfis_distributed: number;
  nfis_available: number;
  dewatering_required: number;
  dewatering_done: number;
  desilting_required: number;
  desilting_done: number;
  active_relief_camps: number;
  people_in_relief_camps: number;
  last_updated: string;
  source: string;
}

export interface ReliefOperationsResponse {
  success: boolean;
  message: string;
  summary: ReliefSummary;
  kpi_cards: KpiCard[];
  charts: Charts;
  district_data: DistrictData[];
  metadata: {
    last_updated: string;
    total_records: number;
    unique_districts: number;
    data_source: string;
  };
}

export const getCampsDetailsByDistrict = async (): Promise<CampDetailsByDistrictResponse> => {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const url = `${baseUrl}/floods/camps/details-by-district`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch camp details by district: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

export const getReliefOperationsOverview = async (): Promise<ReliefOperationsResponse> => {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const url = `${baseUrl}/floods/relief-operations/overview`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch relief operations overview: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};