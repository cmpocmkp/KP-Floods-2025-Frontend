import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from 'lucide-react';
import { DSRAggregates } from '@/api/dsr';
import { VisualizeFilters } from '@/pages/VisualizePage';

interface NarrativeDigestProps {
  aggregates: DSRAggregates | null;
  filters: VisualizeFilters;
  crossFilters: {
    selectedDistricts: string[];
    selectedDivisions: string[];
    selectedCategories: string[];
  };
  onCrossFilterChange: (filters: {
    selectedDistricts: string[];
    selectedDivisions: string[];
    selectedCategories: string[];
  }) => void;
}

export function NarrativeDigest({ aggregates, filters, crossFilters, onCrossFilterChange }: NarrativeDigestProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Narrative Digest
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Incident Narratives</h3>
          <p>Coming soon: Sanitized incident descriptions and response summaries</p>
        </div>
      </CardContent>
    </Card>
  );
}