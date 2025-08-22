import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const districts = [
  { district: "Peshawar", lat: 34.01444, lon: 71.5675 },
  { district: "Charsadda", lat: 34.15, lon: 71.73333 },
  { district: "Nowhsera", lat: 34.01528, lon: 71.97472 },
  { district: "Mohmand", lat: 34.32111, lon: 71.4 },
  { district: "Swat", lat: 34.77167, lon: 72.36 },
  { district: "Buner", lat: 34.51111, lon: 72.48833 },
  { district: "Battagram", lat: 34.68333, lon: 73.01667 },
  { district: "Dir Lower", lat: 34.8281, lon: 71.8405 },
  { district: "Dir Upper", lat: 35.2071, lon: 71.8757 },
  { district: "Shangla", lat: 34.9064, lon: 72.6608 },
  { district: "Malakand", lat: 34.61778, lon: 71.97222 },
  { district: "Bajaur", lat: 34.67611, lon: 71.52444 },
  { district: "Chitral Upper", lat: 36.215, lon: 72.0479 },
  { district: "Chitral Lower", lat: 35.84611, lon: 71.78583 },
  { district: "Bannu", lat: 32.98639, lon: 70.60444 },
  { district: "North Waziristan", lat: 33.0038, lon: 70.069 },
  { district: "Mansehra", lat: 34.33389, lon: 73.20139 },
  { district: "Haripur", lat: 33.99417, lon: 72.93333 },
  { district: "Torghar", lat: 34.61361, lon: 72.78889 },
  { district: "Abbotabad", lat: 34.15583, lon: 73.21944 },
  { district: "Mardan", lat: 34.1989, lon: 72.0447 },
  { district: "Swabi", lat: 34.11667, lon: 72.46667 },
  { district: "Dera Ismail Khan", lat: 31.8327, lon: 70.9024 },
  { district: "South Waziristan", lat: 32.305, lon: 69.58889 },
  { district: "Karak", lat: 33.12, lon: 71.09472 },
  { district: "Lakki Marwat", lat: 32.6072, lon: 70.9113 },
  { district: "Kurram", lat: 33.9, lon: 70.1 }
];

interface DistrictData {
  deaths: number;
  injured: number;
  houseDamaged: number;
}

interface LeafletMapProps {
  districtData?: Record<string, DistrictData>;
  isLoading?: boolean;
}

export function LeafletMap({ districtData = {}, isLoading = false }: LeafletMapProps) {
  // Center the map on KP province
  const center: [number, number] = [34.9526, 71.7340];

  const getSeverityColor = (district: string): string => {
    const data = districtData[district];
    if (!data) return '#22c55e'; // green for no data
    
    const deaths = data.deaths || 0;
    if (deaths >= 50) return '#ef4444'; // red for severe
    if (deaths >= 10) return '#f97316'; // orange for moderate
    if (deaths >= 1) return '#eab308'; // yellow for low
    return '#22c55e'; // green for infrastructure only
  };

  const getCircleSize = (district: string): number => {
    const data = districtData[district];
    if (!data) return 8;
    
    const deaths = data.deaths || 0;
    if (deaths >= 50) return 20;
    if (deaths >= 10) return 15;
    if (deaths >= 1) return 12;
    return 8;
  };

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
          {districts.map((district) => (
            <CircleMarker
              key={district.district}
              center={[district.lat, district.lon]}
              radius={getCircleSize(district.district)}
              fillColor={getSeverityColor(district.district)}
              color="white"
              weight={2}
              opacity={1}
              fillOpacity={0.8}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="font-medium">{district.district}</div>
                {districtData[district.district] && (
                  <div className="text-sm">
                    <div>Deaths: {districtData[district.district].deaths || 0}</div>
                    <div>Injured: {districtData[district.district].injured || 0}</div>
                    <div>Houses: {districtData[district.district].houseDamaged || 0}</div>
                  </div>
                )}
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
}