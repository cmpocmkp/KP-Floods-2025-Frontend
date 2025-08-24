// Map & Geo
export type GisFeatureProps = {
  district: string;
  deaths: number;
  injured: number;
  houses_damaged: number;
  schools_damaged: number;
  livestock_lost: number;
  roads_damaged_km: number;
  bridges_damaged: number;
  culverts_damaged: number;
  latest_report_date: string; // YYYY-MM-DD
};

export type GisFeature = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] }; // [lng, lat]
  properties: GisFeatureProps;
};

export type GisFeatureCollection = { 
  type: "FeatureCollection"; 
  features: GisFeature[] 
};

export type ChoroplethDatum = { 
  district: string; 
  value: number 
};

export type DistrictCoordinate = { 
  district: string; 
  latitude: number; 
  longitude: number 
};

export type DistrictsTopoJSON = {
  type: "Topology";
  objects: { 
    districts: { 
      type: "GeometryCollection"; 
      geometries: any[] 
    } 
  };
  arcs: any[];
};

// Incidents
export type IncidentRow = { 
  date: string; 
  deaths: number; 
  injured: number; 
  houses_damaged: number 
};

// Infrastructure
export type InfraStatusBucket = { 
  fully_restored: number; 
  partially_restored: number; 
  not_restored: number 
};

export type InfrastructureStatus = { 
  roads_km: InfraStatusBucket; 
  bridges: InfraStatusBucket; 
  culverts: InfraStatusBucket 
};

export type InfrastructureByDistrictRow = {
  district: string;
  roads_km: number;
  bridges: number;
  culverts: number;
  restoration_progress: number; // 0..1
};