import { api, qs } from './api';
import type {
  DateRangeParams,
  OverviewResponse,
  CumulativeDashboardResponse,
  DamageDistributionResponse,
  DivisionSummaryResponse,
  SingleSeriesTrendResponse,
  MultiDistrictTrendResponse
} from './types';

export async function getOverview(params?: DateRangeParams): Promise<OverviewResponse> {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const response = await fetch(`${baseUrl}/floods/overview${qs(params)}`, {
    headers: {
      'Accept': '*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch overview: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

export async function getCumulativeDashboard(): Promise<CumulativeDashboardResponse> {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const response = await fetch(`${baseUrl}/floods/dashboard/cumulative`, {
    headers: {
      'Accept': '*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch cumulative dashboard: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

export async function getDamageDistribution(params?: DateRangeParams): Promise<DamageDistributionResponse> {
  // Filter out React Query internal parameters
  const { client, queryKey, signal, ...apiParams } = params || {};
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const response = await fetch(`${baseUrl}/floods/distribution/damage${qs(apiParams)}`, {
    headers: {
      'Accept': '*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch damage distribution: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

export async function getDivisionSummary(params?: DateRangeParams): Promise<DivisionSummaryResponse> {
  // Filter out React Query internal parameters
  const { client, queryKey, signal, ...apiParams } = params || {};
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const response = await fetch(`${baseUrl}/floods/division-summary${qs(apiParams)}`, {
    headers: {
      'Accept': '*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch division summary: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

export interface IncidentTrendsParams extends DateRangeParams {
  metric?: 'deaths' | 'injured' | 'houses';
  district?: string;
  group_by?: 'daily' | 'weekly';
  fill_missing?: boolean;
}

