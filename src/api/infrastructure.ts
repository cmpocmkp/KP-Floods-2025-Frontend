import { api, qs } from "@/lib/api";
import type { InfrastructureByDistrictRow, InfrastructureStatus } from "@/types/api";

export const getInfrastructureStatus = (p?: { date_from?: string; date_to?: string }) =>
  api<InfrastructureStatus>(`/api/infrastructure/status${qs(p)}`);

export const getInfrastructureByDistrict = (p?: { date_from?: string; date_to?: string }) =>
  api<InfrastructureByDistrictRow[]>(`/api/infrastructure/by-district${qs(p)}`);