import type { InfrastructureByDistrictRow, InfrastructureStatus } from "@/types/api";

export const getInfrastructureStatus = async (p?: { date_from?: string; date_to?: string }): Promise<InfrastructureStatus> => {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const response = await fetch(`${baseUrl}/floods/infrastructure/status`, {
    headers: {
      'Accept': '*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch infrastructure status: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

export const getInfrastructureByDistrict = async (p?: { date_from?: string; date_to?: string }): Promise<InfrastructureByDistrictRow[]> => {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const response = await fetch(`${baseUrl}/floods/infrastructure/by-district`, {
    headers: {
      'Accept': '*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch infrastructure by district: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};