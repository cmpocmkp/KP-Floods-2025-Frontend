import type { IncidentRow } from "@/types/api";

interface DistrictIncidentDetail {
  report_date: string | null;
  male_deaths: number;
  female_deaths: number;
  child_deaths: number;
  total_deaths: number;
  male_injured: number;
  female_injured: number;
  child_injured: number;
  total_injured: number;
  house_damaged_fully: number;
  house_damaged_partially: number;
  total_houses_damaged: number;
  school_damaged_fully: number;
  school_damaged_partially: number;
  total_school_damaged: number;
  total_other_damaged: number;
  cattle_perished: number;
  nat_name: string | null;
  last_updated: string;
}

export interface DistrictIncidentSummary {
  district: string;
  deaths: number;
  injured: number;
  houses_damaged: number;
  cause: string;
  date: string | null;
  view_detail: boolean;
  district_id: number;
  division: string | null;
  incidents: DistrictIncidentDetail[];
}

export const getRecentIncidents = async (p?: { date_from?: string; date_to?: string; limit?: number; district?: string }): Promise<IncidentRow[]> => {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const params = new URLSearchParams();

  if (p?.date_from) params.append('date_from', p.date_from);
  if (p?.date_to) params.append('date_to', p.date_to);
  if (p?.limit) params.append('limit', p.limit.toString());
  if (p?.district) params.append('district', p.district);

  const queryString = params.toString();
  const url = `${baseUrl}/floods/incidents/recent${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    headers: {
      'Accept': '*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch recent incidents: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

export const getDistrictIncidents = async (district: string, p?: { date_from?: string; date_to?: string }): Promise<IncidentRow[]> => {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const params = new URLSearchParams();

  if (p?.date_from) params.append('date_from', p.date_from);
  if (p?.date_to) params.append('date_to', p.date_to);

  const queryString = params.toString();
  const url = `${baseUrl}/floods/incidents/recent?district=${encodeURIComponent(district)}${queryString ? `&${queryString}` : ''}`;

  const response = await fetch(url, {
    headers: {
      'Accept': '*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch district incidents: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

export const getDistrictWiseIncidents = async (p?: { date_from?: string; date_to?: string; limit?: number }): Promise<DistrictIncidentSummary[]> => {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const url = `${baseUrl}/floods/incidents/recent/district-wise`;

  const response = await fetch(url, {
    headers: {
      'Accept': '*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch district-wise incidents: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};