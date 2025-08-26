import { api, qs } from './api';
import type {
  DateRangeParams,
  OverviewResponse,
  DamageDistributionResponse,
  DivisionSummaryResponse,
  SingleSeriesTrendResponse,
  MultiDistrictTrendResponse
} from './types';

export async function getOverview(params?: DateRangeParams): Promise<OverviewResponse> {
  return api(`/api/overview${qs(params)}`);
}

export async function getDamageDistribution(params?: DateRangeParams): Promise<DamageDistributionResponse> {
  // Filter out React Query internal parameters
  const { client, queryKey, signal, ...apiParams } = params || {};
  return api(`/api/distribution/damage${qs(apiParams)}`);
}

export async function getDivisionSummary(params?: DateRangeParams): Promise<DivisionSummaryResponse> {
  // Filter out React Query internal parameters
  const { client, queryKey, signal, ...apiParams } = params || {};
  return api(`/api/summaries/divisions${qs(apiParams)}`);
}

export interface IncidentTrendsParams extends DateRangeParams {
  metric?: 'deaths' | 'injured' | 'houses';
  district?: string;
  group_by?: 'daily' | 'weekly';
  fill_missing?: boolean;
}

export async function getIncidentTrends(params?: IncidentTrendsParams): Promise<SingleSeriesTrendResponse> {
  return api(`/api/trends/incidents${qs(params)}`);
}

export interface MultiDistrictTrendsParams extends DateRangeParams {
  metric?: 'deaths' | 'houses';
  top?: number;
}

export async function getMultiDistrictTrends(params?: MultiDistrictTrendsParams): Promise<MultiDistrictTrendResponse> {
  return api(`/api/trends/incidents/by-district${qs(params)}`);
}