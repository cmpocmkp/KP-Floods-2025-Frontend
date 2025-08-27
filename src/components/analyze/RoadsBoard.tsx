import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Route,
  AlertTriangle,
  ExternalLink,
  Clock,
  MapPin,
  Wrench
} from 'lucide-react';
import { DSRAggregates } from '@/api/dsr';

interface RoadsBoardProps {
  aggregates: DSRAggregates;
  selectedDistricts?: string[];
}

export function RoadsBoard({ aggregates, selectedDistricts = [] }: RoadsBoardProps) {
  // Filter road situations based on selected districts
  const filteredRoads = selectedDistricts.length > 0
    ? aggregates.roads.filter(road => selectedDistricts.includes(road.DistrictName))
    : aggregates.roads;

  // Group roads by status/responsibility
  const blockedRoads = filteredRoads.filter(road =>
    road.SituationDescription.toLowerCase().includes('blocked') ||
    road.SituationDescription.toLowerCase().includes('block')
  );

  const clearedRoads = filteredRoads.filter(road =>
    road.SituationResponsible?.toLowerCase().includes('cleared') ||
    road.SituationResponsible?.toLowerCase().includes('reopened')
  );

  const criticalRoads = filteredRoads.filter(road =>
    road.SituationDescription.toLowerCase().includes('kkh') ||
    road.SituationDescription.toLowerCase().includes('karakoram') ||
    road.SituationDescription.toLowerCase().includes('main')
  );

  // Get unique districts with road issues
  const districtsWithRoadIssues = [...new Set(filteredRoads.map(road => road.DistrictName))];

  if (filteredRoads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Road Situations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Route className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Road Issues Reported</h3>
            <p>All roads are operating normally in the selected areas.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5" />
          Road Situations & Blockages
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{blockedRoads.length}</div>
            <div className="text-sm text-muted-foreground">Blocked Roads</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{clearedRoads.length}</div>
            <div className="text-sm text-muted-foreground">Cleared Roads</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{criticalRoads.length}</div>
            <div className="text-sm text-muted-foreground">Critical Routes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{districtsWithRoadIssues.length}</div>
            <div className="text-sm text-muted-foreground">Affected Districts</div>
          </div>
        </div>

        {/* Road Status Cards */}
        <div className="space-y-4">
          {blockedRoads.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                Blocked Roads ({blockedRoads.length})
              </h3>
              <div className="space-y-3">
                {blockedRoads.map((road, index) => (
                  <RoadSituationCard key={road._id} road={road} status="blocked" />
                ))}
              </div>
            </div>
          )}

          {criticalRoads.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-orange-700">
                <AlertTriangle className="h-5 w-5" />
                Critical Routes ({criticalRoads.length})
              </h3>
              <div className="space-y-3">
                {criticalRoads.map((road, index) => (
                  <RoadSituationCard key={road._id} road={road} status="critical" />
                ))}
              </div>
            </div>
          )}

          {clearedRoads.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-green-700">
                <Wrench className="h-5 w-5" />
                Cleared Roads ({clearedRoads.length})
              </h3>
              <div className="space-y-3">
                {clearedRoads.map((road, index) => (
                  <RoadSituationCard key={road._id} road={road} status="cleared" />
                ))}
              </div>
            </div>
          )}

          {/* Other road situations */}
          {filteredRoads.filter(road =>
            !blockedRoads.includes(road) &&
            !criticalRoads.includes(road) &&
            !clearedRoads.includes(road)
          ).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-700">
                <Clock className="h-5 w-5" />
                Other Situations
              </h3>
              <div className="space-y-3">
                {filteredRoads
                  .filter(road =>
                    !blockedRoads.includes(road) &&
                    !criticalRoads.includes(road) &&
                    !clearedRoads.includes(road)
                  )
                  .map((road, index) => (
                    <RoadSituationCard key={road._id} road={road} status="other" />
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface RoadSituationCardProps {
  road: {
    DistrictName: string;
    SituationDescription: string;
    SituationResponsible?: string;
    SituationSource?: string;
    _id: string;
  };
  status: 'blocked' | 'critical' | 'cleared' | 'other';
}

function RoadSituationCard({ road, status }: RoadSituationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'blocked': return 'border-red-500 bg-red-50';
      case 'critical': return 'border-orange-500 bg-orange-50';
      case 'cleared': return 'border-green-500 bg-green-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'blocked': return <Badge variant="destructive">Blocked</Badge>;
      case 'critical': return <Badge className="bg-orange-500 hover:bg-orange-600">Critical</Badge>;
      case 'cleared': return <Badge variant="default" className="bg-green-500">Cleared</Badge>;
      default: return <Badge variant="secondary">Other</Badge>;
    }
  };

  return (
    <Card className={`border-l-4 ${getStatusColor(status)}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-gray-900">{road.DistrictName}</span>
          </div>
          {getStatusBadge(status)}
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Situation Description</h4>
            <div className="text-sm text-gray-700 bg-white p-3 rounded border">
              {road.SituationDescription}
            </div>
          </div>

          {road.SituationResponsible && road.SituationResponsible.trim() && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Response & Responsibility</h4>
              <div className="text-sm text-gray-700 bg-white p-3 rounded border">
                {road.SituationResponsible}
              </div>
            </div>
          )}

          {road.SituationSource && road.SituationSource.trim() && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <ExternalLink className="h-3 w-3" />
              <span>Source: {road.SituationSource}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}