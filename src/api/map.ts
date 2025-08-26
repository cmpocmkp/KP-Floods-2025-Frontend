import { qs } from "@/lib/api";
import type { ChoroplethDatum, DistrictCoordinate, DistrictsTopoJSON, GisFeatureCollection, GisFeature } from "@/types/api";

// Utility function to convert string values to numbers for numeric fields
const convertGisFeatureToNumbers = (feature: any): GisFeature => {
  return {
    ...feature,
    properties: {
      ...feature.properties,
      deaths: parseInt(feature.properties.deaths) || 0,
      injured: parseInt(feature.properties.injured) || 0,
      houses_damaged: parseInt(feature.properties.houses_damaged) || 0,
      schools_damaged: parseInt(feature.properties.schools_damaged) || 0,
      livestock_lost: parseInt(feature.properties.livestock_lost) || 0,
      roads_damaged_km: parseInt(feature.properties.roads_damaged_km) || 0,
      bridges_damaged: parseInt(feature.properties.bridges_damaged) || 0,
      culverts_damaged: parseInt(feature.properties.culverts_damaged) || 0,
    }
  };
};

export const getGisDistricts = async (p?: { date_from?: string; date_to?: string }): Promise<GisFeatureCollection> => {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const endpoint = `${baseUrl}/floods/gis/districts`;

  const response = await fetch(endpoint, {
    headers: {
      'Accept': '*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch GIS districts: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Convert string values to numbers
  const convertedFeatures = data.features.map(convertGisFeatureToNumbers);

  return {
    ...data,
    features: convertedFeatures
  };
};

export const getChoropleth = (p: { metric: "deaths"|"injured"|"houses"|"livestock"; date_from?: string; date_to?: string }) =>
  api<ChoroplethDatum[]>(`/api/geo/choropleth${qs(p)}`);

export const getCoordinates = () => 
  api<DistrictCoordinate[]>("/api/coordinates");

export const getDistrictsTopo = () => 
  api<DistrictsTopoJSON>("/api/geo/districts-topojson");