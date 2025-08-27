import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  FileText,
  Eye,
  ChevronDown,
  ExternalLink,
  AlertCircle,
  MapPin,
  Clock
} from 'lucide-react';
import { DSRAggregates } from '@/api/dsr';

interface NarrativeDigestProps {
  aggregates: DSRAggregates;
  selectedDistricts?: string[];
}

export function NarrativeDigest({ aggregates, selectedDistricts = [] }: NarrativeDigestProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  // Filter narratives based on selected districts
  const filteredNarratives = selectedDistricts.length > 0
    ? Object.fromEntries(
        Object.entries(aggregates.narratives).filter(([district]) =>
          selectedDistricts.includes(district)
        )
      )
    : aggregates.narratives;

  // Get districts with incident details
  const districtsWithIncidents = Object.keys(filteredNarratives).sort();

  // Function to safely render HTML content
  const renderHTMLContent = (htmlContent: string) => {
    // Basic HTML sanitization - remove dangerous tags and attributes
    const sanitized = htmlContent
      .replace(/<script[^>]*>.*?<\/script>/gis, '') // Remove scripts
      .replace(/<style[^>]*>.*?<\/style>/gis, '') // Remove styles
      .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
      .replace(/<br\s*\/?>/gi, '\n') // Convert br to newlines
      .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&amp;/g, '&') // Replace ampersands
      .replace(/&lt;/g, '<') // Replace less than
      .replace(/&gt;/g, '>') // Replace greater than
      .replace(/&quot;/g, '"') // Replace quotes
      .replace(/\n\s*\n/g, '\n\n') // Clean up multiple newlines
      .trim();

    return sanitized;
  };

  // Get summary statistics
  const totalIncidents = Object.values(filteredNarratives).reduce((sum, district) => sum + district.count, 0);
  const districtsWithDetails = districtsWithIncidents.length;
  const uniqueSources = new Set(
    Object.values(filteredNarratives).flatMap(district =>
      district.sources.filter(source => source && source.trim())
    )
  ).size;

  if (districtsWithIncidents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Incident Narratives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Incident Details Available</h3>
            <p>Select a different date or district to view incident narratives.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Incident Narratives & Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalIncidents}</div>
            <div className="text-sm text-muted-foreground">Total Incidents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{districtsWithDetails}</div>
            <div className="text-sm text-muted-foreground">Districts with Details</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{uniqueSources}</div>
            <div className="text-sm text-muted-foreground">Reporting Sources</div>
          </div>
        </div>

        {/* District Selection Tabs */}
        <Tabs value={selectedDistrict || districtsWithIncidents[0]} onValueChange={setSelectedDistrict}>
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 mb-6">
            {districtsWithIncidents.slice(0, 5).map((district) => (
              <TabsTrigger
                key={district}
                value={district}
                className="text-xs"
              >
                {district}
              </TabsTrigger>
            ))}
            {districtsWithIncidents.length > 5 && (
              <TabsTrigger value="all" className="text-xs">
                All ({districtsWithIncidents.length})
              </TabsTrigger>
            )}
          </TabsList>

          {districtsWithIncidents.map((district) => (
            <TabsContent key={district} value={district} className="mt-0">
              <DistrictIncidentDetails
                district={district}
                narrative={filteredNarratives[district]}
                renderHTMLContent={renderHTMLContent}
              />
            </TabsContent>
          ))}

          {/* All districts view */}
          <TabsContent value="all" className="mt-0">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {districtsWithIncidents.map((district) => (
                <Card key={district} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{district}</span>
                      <Badge variant="secondary" className="ml-2">
                        {filteredNarratives[district].count} incident{filteredNarratives[district].count !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <DistrictIncidentDetails
                      district={district}
                      narrative={filteredNarratives[district]}
                      renderHTMLContent={renderHTMLContent}
                      compact={true}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface DistrictIncidentDetailsProps {
  district: string;
  narrative: {
    incidents: Array<{
      IncidentDescription: string;
      IncidentSource: string;
      IncidentResponsible?: string;
      _id: string;
    }>;
    count: number;
    combinedNarrative: string;
    sources: string[];
  };
  renderHTMLContent: (html: string) => string;
  compact?: boolean;
}

function DistrictIncidentDetails({ district, narrative, renderHTMLContent, compact = false }: DistrictIncidentDetailsProps) {
  return (
    <div className="space-y-4">
      {/* District Header */}
      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">{district}</h3>
        </div>
        <div className="flex items-center gap-4 text-sm text-blue-700">
          <span className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            {narrative.count} incident{narrative.count !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <ExternalLink className="h-4 w-4" />
            {narrative.sources.length} source{narrative.sources.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Sources */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700">Sources:</span>
        {narrative.sources.map((source, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {source}
          </Badge>
        ))}
      </div>

      {/* Incident Details */}
      {compact ? (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2 text-gray-900">Combined Incident Summary</h4>
          <div className="text-sm text-gray-700 whitespace-pre-line max-h-32 overflow-y-auto">
            {renderHTMLContent(narrative.combinedNarrative).substring(0, 500)}
            {narrative.combinedNarrative.length > 500 && '...'}
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {narrative.incidents.map((incident, index) => (
            <Card key={incident._id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {incident.IncidentSource}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Incident Description</h4>
                    <div className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded">
                      {renderHTMLContent(incident.IncidentDescription)}
                    </div>
                  </div>

                  {incident.IncidentResponsible && incident.IncidentResponsible.trim() && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Response & Responsibility</h4>
                      <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded border-l-4 border-l-blue-500">
                        {renderHTMLContent(incident.IncidentResponsible)}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}