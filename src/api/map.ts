import { api, qs } from "@/lib/api";
import type { ChoroplethDatum, DistrictCoordinate, DistrictsTopoJSON, GisFeatureCollection } from "@/types/api";

export const getGisDistricts = (p?: { date_from?: string; date_to?: string }) =>
  api<GisFeatureCollection>(`/api/gis/districts${qs(p)}`);

export const getChoropleth = (p: { metric: "deaths"|"injured"|"houses"|"livestock"; date_from?: string; date_to?: string }) =>
  api<ChoroplethDatum[]>(`/api/geo/choropleth${qs(p)}`);

export const getCoordinates = () => 
  api<DistrictCoordinate[]>("/api/coordinates");

export const getDistrictsTopo = () => 
  api<DistrictsTopoJSON>("/api/geo/districts-topojson");