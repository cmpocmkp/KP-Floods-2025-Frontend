import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { DSRAggregates } from '@/api/dsr';
import type { VisualizeFilters } from '@/types/visualize';

interface InsightCardsProps {
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

export function InsightCards({ aggregates, filters, crossFilters, onCrossFilterChange }: InsightCardsProps) {
  const insights = [
    {
      type: 'new_today',
      title: 'New Districts Affected',
      description: 'Districts reporting incidents for the first time',
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      count: 3
    },
    {
      type: 'biggest_increase',
      title: 'Biggest ↑ in Casualties',
      description: 'Districts with largest increase vs previous period',
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      count: 2
    },
    {
      type: 'improvement',
      title: 'Recovery Progress',
      description: 'Districts showing improvement in situation',
      icon: TrendingDown,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      count: 1
    },
    {
      type: 'cause_shift',
      title: 'Cause Pattern Shift',
      description: 'Changes in incident causes vs previous period',
      icon: Lightbulb,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      count: 1
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pattern Insights</h2>
        <Button variant="outline" size="sm">
          <Lightbulb className="h-4 w-4 mr-2" />
          Generate Daily Brief
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <Card key={index} className={`cursor-pointer hover:shadow-md transition-shadow ${insight.bgColor}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <insight.icon className={`h-8 w-8 ${insight.color}`} />
                <span className={`text-2xl font-bold ${insight.color}`}>{insight.count}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
              <p className="text-sm text-gray-600">{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Auto-generated insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Automated Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
              <h4 className="font-semibold text-blue-900 mb-2">Spike Detection</h4>
              <p className="text-sm text-blue-700">
                Casualty rates 45% above 7-day average. Consider immediate response escalation.
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-l-orange-500">
              <h4 className="font-semibold text-orange-900 mb-2">Infrastructure Bottleneck</h4>
              <p className="text-sm text-orange-700">
                Road clearance operations lagging behind incident response in 3 districts.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-l-green-500">
              <h4 className="font-semibold text-green-900 mb-2">Response Effectiveness</h4>
              <p className="text-sm text-green-700">
                Medical response teams achieving 85% coverage within 2 hours of incident reports.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}