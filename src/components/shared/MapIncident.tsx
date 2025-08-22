import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import { MapMarker } from '../../lib/types'
import { cn, formatNumber } from '../../lib/utils'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
import L from 'leaflet'

// Only run this fix on the client side
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  })
}

interface MapIncidentProps {
  markers: MapMarker[]
  className?: string
  height?: string
}

const severityColors = {
  high: '#dc2626', // red-600
  medium: '#ea580c', // orange-600
  low: '#ca8a04', // yellow-600
  infrastructure: '#16a34a' // green-600
}

const severityLabels = {
  high: 'High Severity (50+ deaths)',
  medium: 'Medium Severity (10-49 deaths)',
  low: 'Low Severity (1-9 deaths)',
  infrastructure: 'Infrastructure Damage Only'
}

// Default center of KP, Pakistan
const defaultCenter: LatLngExpression = [34.9526, 72.3311]

export default function MapIncident({ 
  markers, 
  className,
  height = '400px'
}: MapIncidentProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className={cn('bg-gray-100 rounded-2xl flex items-center justify-center', className)} style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative rounded-2xl overflow-hidden shadow-sm border border-gray-100', className)}>
      <MapContainer
        center={defaultCenter}
        zoom={8}
        style={{ height, width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {markers.map((marker) => (
          <CircleMarker
            key={marker.id}
            center={[marker.lat, marker.lng]}
            radius={marker.severity === 'high' ? 12 : marker.severity === 'medium' ? 8 : 6}
            pathOptions={{
              color: severityColors[marker.severity],
              fillColor: severityColors[marker.severity],
              fillOpacity: 0.7,
              weight: 2
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-gray-900 mb-1">{marker.location}</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Deaths:</span> {formatNumber(marker.deaths)}</p>
                  <p><span className="font-medium">Severity:</span> {severityLabels[marker.severity]}</p>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}