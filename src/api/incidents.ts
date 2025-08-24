import { api, qs } from "@/lib/api";
import type { IncidentRow } from "@/types/api";

export const getRecentIncidents = (p?: { date_from?: string; date_to?: string; limit?: number; district?: string }) =>
  api<IncidentRow[]>(`/api/incidents/recent${qs(p)}`);

export const getDistrictIncidents = (district: string, p?: { date_from?: string; date_to?: string }) =>
  api<IncidentRow[]>(`/api/incidents/${encodeURIComponent(district)}${qs(p)}`);