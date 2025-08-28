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

// PHE Schemes Types
export interface PheSchemeData {
  _id: string;
  report_date: string;
  division: {
    _id: string;
    name: string;
  };
  district: {
    _id: string;
    name: string;
  };
  department: string;
  tehsil: string | null;
  uc: string | null;
  type_of_scheme: string | null;
  scheme_name: string | null;
  nature_of_damage: string | null;
  damage_status: string | null;
  components_damaged: string | null;
  minorly_damaged_no: number | null;
  partially_damaged_no: number | null;
  washed_away_no: number | null;
  total_schemes_no: number | null;
  estimated_cost_million_pkr: number | null;
  restoration_status: string | null;
  notes: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
}

// C&W Roads & Bridges Types
export interface CwRoadsBridgesData {
  district: string;
  effected_roads: number;
  damage_spots: number;
  total_length_km: number;
  damage_length_km: number;
  restored_open_all: number;
  restored_light_traffic: number;
  not_restored_closed: number;
  restoration_cost_m: number;
  rehabilitation_cost_m: number;
}

export interface CwRoadsBridgesResponse {
  data: CwRoadsBridgesData[];
  summary: {
    total_districts: number;
    total_effected_roads: number;
    total_damage_spots: number;
    total_length_km: number;
    total_damage_length_km: number;
    total_restored_open_all: number;
    total_restored_light_traffic: number;
    total_not_restored_closed: number;
    total_restoration_cost_m: number;
    total_rehabilitation_cost_m: number;
  };
  total_records: number;
  source: string;
}

// Local Government Types
export interface LocalGovtDetail {
  id: number;
  department: string;
  reporting_officer: string;
  designation: string;
  contact: number;
  email: string;
  tehsil: string;
  location: string | null;
  nature_of_damage: string | null;
  infrastructure_type: string | null;
  specific_description: string | null;
  points_spots: string | null;
  damaged_area_sqm: number;
  restoration_status: string;
  restoration_cost_m: number;
  rehabilitation_cost_m: number;
}

export interface LocalGovtData {
  district: string;
  division: string;
  total_records: number;
  total_damaged_area_sqm: number;
  total_restoration_cost_m: number;
  total_rehabilitation_cost_m: number;
  restoration_status: {
    fully_restored: number;
    partially_restored: number;
    not_restored: number;
    washed_away: number;
  };
  infrastructure_types: Record<string, number>;
  tehsils: Record<string, number>;
  details: LocalGovtDetail[];
}

export interface LocalGovtResponse {
  data: LocalGovtData[];
  summary: {
    total_districts: number;
    total_records: number;
    total_damaged_area_sqm: number;
    total_restoration_cost_m: number;
    total_rehabilitation_cost_m: number;
    total_fully_restored: number;
    total_partially_restored: number;
    total_not_restored: number;
    total_washed_away: number;
  };
  total_records: number;
  source: string;
}

// Combined Infrastructure and Services Data
// Education Data Types
export interface EducationSchoolData {
  estimated_losses_pkr: {
    fully: number;
    partially: number;
    total: number;
  };
  institutions_count: number;
  fully_damaged: number;
  partially_damaged: number;
  rooms_damaged: number;
  toilets_damaged: number;
}

export interface EducationHigherEducationInstitute {
  institute: string;
  location: string;
  restoration_status: string;
  restoration_cost_pkr: number;
  rehabilitation_cost_pkr: number;
}

export interface EducationHigherEducationData {
  institute_count: number;
  restoration_total_pkr: number;
  rehabilitation_total_pkr: number;
  total_pkr: number;
  institutes: EducationHigherEducationInstitute[];
}

export interface EducationDistrictData {
  district: string;
  schools_esed: EducationSchoolData;
  higher_education: EducationHigherEducationData;
  district_total_pkr: number;
  district_total_million_pkr: number;
  percentage_of_total_damage: number;
}

export interface EducationResponse {
  data: EducationDistrictData[];
  summary: {
    total_institutions: number;
    total_damage_pkr: number;
    total_damage_million_pkr: number;
  };
  total_records: number;
  source: string;
}

// Irrigation Data Types
export interface IrrigationDivisionData {
  division: string;
  schemes: number;
  restoration_million: number;
  rehabilitation_million: number;
  combined_from: string[];
  total_cost_million: number;
  percentage_of_total_schemes: number;
}

export interface IrrigationResponse {
  data: IrrigationDivisionData[];
  summary: {
    total_schemes: number;
    total_restoration_cost: number;
    total_rehabilitation_cost: number;
  };
}

export interface HigherEducationResponse {
  data: Array<{
    district: string;
    colleges_universities_damaged: number;
    approx_short_term_restoration_pkr: number;
    approx_complete_rehabilitation_pkr: number;
  }>;
  summary: {
    total_institutions_damaged: number;
    total_restoration_cost: number;
    total_rehabilitation_cost: number;
    districts_affected: number;
  };
  total_records: number;
  source: string;
}

export interface CombinedInfrastructureData {
  success: boolean;
  message: string;
  infrastructure: InfrastructureDamageResponse;
  services: ServicesStatusResponse;
  cw_roads_bridges: CwRoadsBridgesResponse;
  local_govt: LocalGovtResponse;
  education: EducationResponse;
  higher_education: HigherEducationResponse;
  irrigation: IrrigationResponse;
  phe: {
    data: {
      division: string;
      district: string;
      department: string;
      numberOfDamagedSchemes: number;
      tentativeCost: number;
    }[];
    summary: {
      total_districts: number;
      total_damaged_schemes: number;
      total_tentative_cost: number;
      districts_with_damage: number;
    };
  };
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

export const getPheAssets = async (): Promise<PheSchemeData[]> => {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const response = await fetch(`${baseUrl}/floods/phe-assets`, {
    headers: {
      'Accept': '*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch PHE assets: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.map((item: any) => ({
    district: item.district.name,
    total_schemes: item.total_schemes_no,
    damaged_schemes: item.minorly_damaged_no + item.partially_damaged_no + item.washed_away_no,
    restored_schemes: 0, // Not available in API
    restoration_cost_m: item.estimated_cost_million_pkr,
    rehabilitation_cost_m: 0 // Not available in API
  }));
};

export const getEnergyPowerAssets = async (): Promise<any[]> => {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const response = await fetch(`${baseUrl}/floods/energy-power-assets`, {
    headers: {
      'Accept': '*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch energy & power assets: ${response.status} ${response.statusText}`);
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