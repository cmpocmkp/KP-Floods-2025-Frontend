export interface VisualizeFilters {
  dateRange: {
    start: string;
    end: string;
    granularity: 'day' | 'week' | 'month';
  };
  divisions: string[];
  districts: string[];
  categories: {
    houses: boolean;
    schools: boolean;
    roads: boolean;
    bridges: boolean;
    services: boolean;
    warehouse: boolean;
    relief: boolean;
    compensation: boolean;
  };
}