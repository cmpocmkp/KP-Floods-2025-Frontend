import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Route } from 'lucide-react';
import { DSRAggregates } from '@/api/dsr';
import { VisualizeFilters } from '@/pages/VisualizePage';

interface RoadStatusBoardProps {
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

export function RoadStatusBoard({ aggregates, filters, crossFilters, onCrossFilterChange }: RoadStatusBoardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5" />
          Road Status & Blockages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <Route className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Infrastructure Status</h3>
          <p>Coming soon: Road blockage timeline and critical corridor monitoring</p>
        </div>
      </CardContent>
    </Card>
  );
}