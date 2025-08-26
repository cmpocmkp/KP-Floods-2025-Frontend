import type { IncidentRow } from "@/types/api";

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