import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Download, MapPin, AlertTriangle } from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  BubbleChart,
  Bubble
} from 'recharts';

interface IncidentHotspotsProps {
  aggregates: any;
}

const SEVERITY_COLORS = ['#16a34a', '#eab308', '#f97316', '#dc2626'];

export function IncidentHotspots({ aggregates }: IncidentHotspotsProps) {
  // Analyze incident hotspots
  const hotspotData = useMemo(() => {
    if (!aggregates?.severityRecords) return null;

    // Calculate hotspot metrics for each district
    const hotspots = aggregates.severityRecords
      .filter(record => record.district && record.district !== 'Unknown District')
      .map((record, index) => {
        const totalCasualties = (record.deaths || 0) + (record.injured || 0);
        const totalDamage = (record.housesFull || 0) + (record.housesPartial || 0) + (record.schools || 0) + (record.other || 0);
        const incidents = Math.max(1, Math.floor(record.severity / 5)); // Estimated incidents

        // Calculate hotspot intensity (casualties + damage + frequency)
        const hotspotIntensity = totalCasualties * 2 + totalDamage * 0.5 + incidents;

        // Determine severity level
        let severityLevel = 'Low';
        let severityColor = SEVERITY_COLORS[0];
        if (hotspotIntensity > 200) {
          severityLevel = 'Critical';
          severityColor = SEVERITY_COLORS[3];
        } else if (hotspotIntensity > 100) {
          severityLevel = 'High';
          severityColor = SEVERITY_COLORS[2];
        } else if (hotspotIntensity > 50) {
          severityLevel = 'Medium';
          severityColor = SEVERITY_COLORS[1];
        }

        return {
          district: record.district,
          x: index * 10 + Math.random() * 5, // Simulated geographic positioning
          y: hotspotIntensity,
          size: Math.max(20, hotspotIntensity / 2),
          intensity: hotspotIntensity,
          casualties: totalCasualties,
          damage: totalDamage,
          incidents: incidents,
          severityLevel,
          severityColor,
          deaths: record.deaths || 0,
          injured: record.injured || 0,
          housesDamaged: totalDamage,
          schoolsAffected: record.schools || 0,
          livestockLost: record.cattle || 0
        };
      })
      .sort((a, b) => b.intensity - a.intensity);

    // Identify top hotspots
    const topHotspots = hotspots.slice(0, 5);

    // Calculate hotspot clusters
    const clusters = [
      { name: 'Critical', count: hotspots.filter(h => h.severityLevel === 'Critical').length, color: SEVERITY_COLORS[3] },
      { name: 'High', count: hotspots.filter(h => h.severityLevel === 'High').length, color: SEVERITY_COLORS[2] },
      { name: 'Medium', count: hotspots.filter(h => h.severityLevel === 'Medium').length, color: SEVERITY_COLORS[1] },
      { name: 'Low', count: hotspots.filter(h => h.severityLevel === 'Low').length, color: SEVERITY_COLORS[0] }
    ];

    return {
      hotspots,
      topHotspots,
      clusters
    };
  }, [aggregates]);

  const handleExportCSV = () => {
    if (!hotspotData) return;

    const headers = ['District', 'Hotspot Intensity', 'Casualties', 'Damage', 'Incidents', 'Severity Level', 'Deaths', 'Injured', 'Houses Damaged', 'Schools Affected', 'Livestock Lost'];
    const csvContent = [
      headers.join(','),
      ...hotspotData.hotspots.map(row => [
        `"${row.district}"`,
        row.intensity.toFixed(2),
        row.casualties,
        row.damage,
        row.incidents,
        `"${row.severityLevel}"`,
        row.deaths,
        row.injured,
        row.housesDamaged,
        row.schoolsAffected,
        row.livestockLost
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'incident_hotspots_analysis.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!hotspotData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            Incident Hotspots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Hotspot Data</h3>
            <p>Incident hotspot analysis will appear here when data is available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            Incident Hotspots Analysis
            <Badge variant="outline" className="ml-2">
              {hotspotData.hotspots.length} districts
            </Badge>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-1" />
            CSV
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Identify disaster hotspots and prioritize response efforts based on impact intensity
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Hotspot Scatter Plot */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Geographic Hotspot Distribution</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart data={hotspotData.hotspots} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="District Position"
                  hide
                />
                <YAxis
                  type="number"
                  dataKey="intensity"
                  name="Hotspot Intensity"
                  label={{ value: 'Impact Intensity', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name, props) => [
                    `${Number(value).toFixed(1)} (${props.payload.severityLevel})`,
                    'Hotspot Intensity'
                  ]}
                  labelFormatter={(label, payload) => `District: ${payload?.[0]?.payload?.district || 'Unknown'}`}
                />
                <Scatter dataKey="size" fill="#8884d8">
                  {hotspotData.hotspots.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.severityColor} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2">
              Bubble size represents impact intensity • Color indicates severity level
            </p>
          </div>

          {/* Top Hotspots List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Top 5 Critical Hotspots</h3>
            <div className="space-y-3">
              {hotspotData.topHotspots.map((hotspot, index) => (
                <div key={hotspot.district} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={index === 0 ? "destructive" : index < 3 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        #{index + 1}
                      </Badge>
                      <h4 className="font-semibold text-gray-900">{hotspot.district}</h4>
                      <Badge
                        style={{ backgroundColor: hotspot.severityColor }}
                        className="text-white text-xs"
                      >
                        {hotspot.severityLevel}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">{hotspot.intensity.toFixed(1)}</div>
                      <div className="text-xs text-gray-600">Intensity Score</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Casualties</div>
                      <div className="font-semibold text-red-600">{hotspot.casualties}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Damage</div>
                      <div className="font-semibold text-blue-600">{hotspot.damage}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Incidents</div>
                      <div className="font-semibold text-purple-600">{hotspot.incidents}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Deaths</div>
                      <div className="font-semibold text-red-700">{hotspot.deaths}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Houses</div>
                      <div className="font-semibold text-blue-700">{hotspot.housesDamaged}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hotspot Clusters */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hotspot Severity Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hotspotData.clusters.map((cluster) => (
                <div key={cluster.name} className="text-center p-4 rounded-lg border">
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ backgroundColor: cluster.color + '20' }}
                  >
                    <AlertTriangle
                      className="h-6 w-6"
                      style={{ color: cluster.color }}
                    />
                  </div>
                  <div className="text-2xl font-bold" style={{ color: cluster.color }}>
                    {cluster.count}
                  </div>
                  <div className="text-sm font-medium">{cluster.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {cluster.count > 1 ? 'districts' : 'district'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Response Recommendations */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-orange-900">Response Recommendations</h3>
            <div className="space-y-2 text-sm text-orange-800">
              <div className="flex items-start gap-2">
                <span className="font-semibold">1.</span>
                <span>Prioritize response in <strong>{hotspotData.topHotspots[0]?.district || 'top hotspot'}</strong> - highest intensity area</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold">2.</span>
                <span>Deploy emergency teams to all <strong>{hotspotData.clusters.find(c => c.name === 'Critical')?.count || 0} critical</strong> hotspots immediately</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold">3.</span>
                <span>Monitor <strong>{hotspotData.clusters.find(c => c.name === 'High')?.count || 0} high-risk</strong> areas for escalation</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold">4.</span>
                <span>Pre-position resources in medium-risk districts for rapid deployment</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}