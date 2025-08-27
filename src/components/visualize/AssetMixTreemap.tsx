import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from 'lucide-react';
import { DSRAggregates } from '@/api/dsr';
import { VisualizeFilters } from '@/pages/VisualizePage';

interface AssetMixTreemapProps {
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

export function AssetMixTreemap({ aggregates, filters, crossFilters, onCrossFilterChange }: AssetMixTreemapProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Asset Mix Treemap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Infrastructure Asset Distribution</h3>
          <p>Coming soon: Treemap visualization of different asset types and their damage</p>
        </div>
      </CardContent>
    </Card>
  );
}