import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getGisDistricts } from '@/api/map';
import { DEFAULT_DATE_RANGE } from '@/lib/api';
import type { GisFeature } from '@/types/api';

interface DistrictData {
  deaths: number;
  injured: number;
  houseDamaged: number;
}

interface LeafletMapProps {
  districtData?: Record<string, DistrictData>;
  isLoading?: boolean;
}

export function LeafletMap(_props: LeafletMapProps) {
  const [gisData, setGisData] = useState<GisFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gisResponse = await getGisDistricts({
          date_from: DEFAULT_DATE_RANGE.from,
          date_to: DEFAULT_DATE_RANGE.to
        });
        setGisData(gisResponse.features);
      } catch (err) {
        console.error('Failed to fetch GIS data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Center the map on KP province
  const center: [number, number] = [34.9526, 71.7340];

  const getSeverityColor = (deaths: number): string => {
    if (deaths >= 50) return '#ef4444'; // red for severe
    if (deaths >= 10) return '#f97316'; // orange for moderate
    if (deaths >= 1) return '#eab308'; // yellow for low
    return '#22c55e'; // green for infrastructure only
  };

  const getCircleSize = (deaths: number): number => {
    if (deaths >= 50) return 20;
    if (deaths >= 10) return 15;
    if (deaths >= 1) return 12;
    return 8;
  };

  if (isLoading) {
    return (
      <Card className="h-[500px] flex items-center justify-center">
        <div className="text-lg">Loading map data...</div>
      </Card>
    );
  }

  return (
    <Card className="h-[500px]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Affected Areas</h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Severe (50+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>High (10-49)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Low (1-9)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Infrastructure</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <MapContainer
          center={center}
          zoom={8}
          style={{ height: "420px", width: "100%", borderRadius: "0 0 1rem 1rem" }}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {gisData.map((feature) => (
            <CircleMarker
              key={feature.properties.district}
              center={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
              radius={getCircleSize(feature.properties.deaths)}
              fillColor={getSeverityColor(feature.properties.deaths)}
              color="white"
              weight={2}
              opacity={1}
              fillOpacity={0.8}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="font-medium">{feature.properties.district}</div>
                <div className="text-sm">
                  <div>Deaths: {feature.properties.deaths}</div>
                  <div>Injured: {feature.properties.injured}</div>
                  <div>Houses Damaged: {feature.properties.houses_damaged}</div>
                  <div>Schools Damaged: {feature.properties.schools_damaged}</div>
                  <div>Livestock Lost: {feature.properties.livestock_lost}</div>
                  <div>Roads Damaged: {feature.properties.roads_damaged_km}km</div>
                  <div>Bridges Damaged: {feature.properties.bridges_damaged}</div>
                  <div>Culverts Damaged: {feature.properties.culverts_damaged}</div>
                  <div className="text-xs text-gray-500 mt-1">Last Updated: {feature.properties.latest_report_date}</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
}