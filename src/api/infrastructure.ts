import type { InfrastructureByDistrictRow, InfrastructureStatus } from "@/types/api";

// Infrastructure Damage Types
export interface TehsilInfrastructureData {
  DistrictName: string;
  DistrictID: string;
  TehsilID: string;
  TehsilName: string;
  HousesFullyDamaged: number;
  HousesPartiallyDamaged: number;
  ShopsDamaged: number;
  EducationFacilitiesDamaged: number;
  HealthFacilitiesDamaged: number;
  GovtOfficesDamaged: number;
  RoadsDamaged: number;
  RoadsDamagedLengthKM: number;
  PermanentBridgesDamaged: number;
  PedestrianBridgesDamaged: number;
  _id: string;
}

export interface DistrictInfrastructureData {
  _id: string;
  DistrictName: string;
  DistrictID: string;
  HousesFullyDamaged: number;
  HousesPartiallyDamaged: number;
  ShopsDamaged: number;
  EducationFacilitiesDamaged: number;
  HealthFacilitiesDamaged: number;
  GovtOfficesDamaged: number;
  RoadsDamaged: number;
  RoadsDamagedLengthKM: number;
  PermanentBridgesDamaged: number;
  PedestrianBridgesDamaged: number;
  Tehsil: TehsilInfrastructureData[];
  last_updated: string;
  __v: number;
}

export interface InfrastructureDamageResponse {
  success: boolean;
  message: string;
  data: DistrictInfrastructureData[];
  summary: {
    total_districts: number;
    total_houses_fully_damaged: number;
    total_houses_partially_damaged: number;
    total_shops_damaged: number;
    total_education_facilities_damaged: number;
    total_health_facilities_damaged: number;
    total_govt_offices_damaged: number;
    total_roads_damaged: number;
    total_roads_damaged_length_km: number;
    total_permanent_bridges_damaged: number;
    total_pedestrian_bridges_damaged: number;
  };
  last_updated: string;
  total_records: number;
  source: string;
}

// Services Status Types
export interface TehsilServicesData {
  DistrictName: string;
  DistrictID: string;
  TehsilName: string;
  TehsilID: string;
  TotalFeedersDisconnections: number;
  TotalFeedersRestored: number;
  TotalWaterDisconnections: number;
  TotalWaterRestored: number;
  TotalGasDisconnections: number;
  TotalGasRestored: number;
  TotalPTCLDisconnections: number;
  TotalPTCLRestored: number;
  TotalCellularDisconnections: number;
  TotalCellularRestored: number;
  TotalInaccessibleAreas: number;
  TotalReconnectedAreas: number;
  _id: string;
}

export interface DistrictServicesData {
  _id: string;
  DistrictName: string;
  DistrictID: string;
  TotalFeedersDisconnections: number;
  TotalFeedersRestored: number;
  TotalWaterDisconnections: number;
  TotalWaterRestored: number;
  TotalGasDisconnections: number;
  TotalGasRestored: number;
  TotalPTCLDisconnections: number;
  TotalPTCLRestored: number;
  TotalCellularDisconnections: number;
  TotalCellularRestored: number;
  TotalInaccessibleAreas: number;
  TotalReconnectedAreas: number;
  Tehsil: TehsilServicesData[];
  last_updated: string;
  __v: number;
}

export interface ServicesStatusResponse {
  success: boolean;
  message: string;
  data: DistrictServicesData[];
  summary: {
    total_districts: number;
    total_feeders_disconnections: number;
    total_feeders_restored: number;
    total_water_disconnections: number;
    total_water_restored: number;
    total_gas_disconnections: number;
    total_gas_restored: number;
    total_ptcl_disconnections: number;
    total_ptcl_restored: number;
    total_cellular_disconnections: number;
    total_cellular_restored: number;
    total_inaccessible_areas: number;
    total_reconnected_areas: number;
  };
  last_updated: string;
  total_records: number;
  source: string;
}

// Combined Infrastructure and Services Data
export interface CombinedInfrastructureData {
  success: boolean;
  message: string;
  infrastructure: InfrastructureDamageResponse;
  services: ServicesStatusResponse;
  last_updated: string;
  data_sources: string[];
}

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

// New API functions for enhanced infrastructure data
export const getInfrastructureDamage = async (): Promise<InfrastructureDamageResponse> => {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const response = await fetch(`${baseUrl}/floods/infrastructure-damage`, {
    headers: {
      'Accept': '*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch infrastructure damage: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

export const getServicesStatus = async (): Promise<ServicesStatusResponse> => {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const response = await fetch(`${baseUrl}/floods/services-status`, {
    headers: {
      'Accept': '*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch services status: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

export const getCombinedInfrastructureServices = async (): Promise<CombinedInfrastructureData> => {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const response = await fetch(`${baseUrl}/floods/infrastructure-services`, {
    headers: {
      'Accept': '*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch combined infrastructure services: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};