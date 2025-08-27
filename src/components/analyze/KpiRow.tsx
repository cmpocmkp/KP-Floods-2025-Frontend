import { Card, CardContent } from "@/components/ui/card";
import {
  Skull,
  Activity,
  Home,
  School,
  Building2,
  FileText,
  Route
} from 'lucide-react';
import { DSRAggregates } from '@/api/dsr';

interface KpiRowProps {
  aggregates: DSRAggregates;
}

interface KpiItem {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color: string;
  subtitle?: string;
}

export function KpiRow({ aggregates }: KpiRowProps) {

  const kpiItems: KpiItem[] = [
    {
      title: "Total Deaths",
      value: aggregates.totals.deaths,
      icon: Skull,
      color: "text-red-600",
      subtitle: "Province-wide"
    },
    {
      title: "Total Injured",
      value: aggregates.totals.injured,
      icon: Activity,
      color: "text-yellow-600",
      subtitle: "Province-wide"
    },
    {
      title: "Houses Fully Damaged",
      value: aggregates.totals.housesFull,
      icon: Home,
      color: "text-red-500",
      subtitle: "Complete destruction"
    },
    {
      title: "Houses Partially Damaged",
      value: aggregates.totals.housesPartial,
      icon: Home,
      color: "text-orange-500",
      subtitle: "Partial damage"
    },
    {
      title: "Total Houses Damaged",
      value: aggregates.totals.housesTotal,
      icon: Home,
      color: "text-blue-600",
      subtitle: "Fully + Partially"
    },
    {
      title: "Schools Damaged",
      value: aggregates.totals.schoolsTotal,
      icon: School,
      color: "text-purple-600",
      subtitle: "Educational facilities"
    },
    {
      title: "Other Structures",
      value: aggregates.totals.othersTotal,
      icon: Building2,
      color: "text-indigo-600",
      subtitle: "Public buildings"
    },
    {
      title: "Total Incidents",
      value: aggregates.totals.incidents,
      icon: FileText,
      color: "text-green-600",
      subtitle: "Reported incidents"
    },
    {
      title: "Roads Blocked",
      value: aggregates.totals.roadsBlocked,
      icon: Route,
      color: "text-gray-600",
      subtitle: "Blocked roadways"
    },
    {
      title: "Districts Reporting",
      value: aggregates.totals.districtsReporting,
      icon: Building2,
      color: "text-teal-600",
      subtitle: "Active districts"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4 mb-6">
      {kpiItems.map((item, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>

            <div className="space-y-1">
              <div className={`text-2xl font-bold ${item.color}`}>
                {item.value.toLocaleString()}
              </div>
              <div className="text-sm font-medium text-gray-900">
                {item.title}
              </div>
              {item.subtitle && (
                <div className="text-xs text-muted-foreground">
                  {item.subtitle}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}