
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getIncidentTrends } from '@/lib/overview';

interface DistrictSeries {
  date: string;
  value: number;
  count: number;
}

interface DistrictData {
  district: string;
  series: DistrictSeries[];
}

interface IncidentTrendsResponse {
  metric: string;
  scope: string;
  group_by: string;
  series: DistrictData[];
  last_updated: string;
  source: string;
}

export function IncidentTrendsChart() {
  const { data: trendsData, isLoading, error } = useQuery({
    queryKey: ['incident-trends-multi-district'],
    queryFn: () => getIncidentTrends({ metric: 'deaths', group_by: 'daily' }),
    select: (data: IncidentTrendsResponse) => {
      // Filter districts that have actual death data (total value > 0)
      const activeDistricts = data.series.filter((district: DistrictData) =>
        district.series.some((point: DistrictSeries) => point.value > 0)
      );

      // Sort districts by total deaths and take top 8
      const topDistricts = activeDistricts
        .map((district: DistrictData) => ({
          ...district,
          totalDeaths: district.series.reduce((sum: number, point: DistrictSeries) => sum + point.value, 0)
        }))
        .sort((a, b) => b.totalDeaths - a.totalDeaths)
        .slice(0, 8);

      // Create a map of all unique dates from top districts
      const dateMap = new Set<string>();
      topDistricts.forEach((district) => {
        district.series.forEach((point: DistrictSeries) => {
          dateMap.add(point.date);
        });
      });

      const dates = Array.from(dateMap).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      // Create chart data with top districts only
      const chartData = dates.map(date => {
        const dataPoint: any = {
          date: format(new Date(date), 'MM/dd'),
          fullDate: date // Keep full date for tooltip
        };

        topDistricts.forEach((district) => {
          const point = district.series.find((p: DistrictSeries) => p.date === date);
          dataPoint[district.district] = point ? point.value : 0;
        });

        return dataPoint;
      });

      return {
        data: chartData,
        districts: topDistricts.map((d: DistrictData & { totalDeaths: number }) => d.district),
        totalDistricts: data.series.length,
        activeDistricts: activeDistricts.length
      };
    }
  });

  if (isLoading) return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Incident Trends</h2>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] flex items-center justify-center">
          Loading...
        </div>
      </CardContent>
    </Card>
  );

  if (error) return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Incident Trends</h2>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] flex items-center justify-center text-red-500">
          Error loading data: {error.message}
        </div>
      </CardContent>
    </Card>
  );

  // Define colors for different districts
  const DISTRICT_COLORS = [
    '#ef4444', // Red
    '#f97316', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#3b82f6', // Blue
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#06b6d4'  // Cyan
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">District-wise Death Trends</h2>
        <p className="text-sm text-muted-foreground">
          Daily death trends for top {trendsData?.districts.length || 8} districts with casualties
          ({trendsData?.activeDistricts || 0} of {trendsData?.totalDistricts || 26} districts have incident data)
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendsData?.data || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [value, `Deaths in ${name}`]}
                labelFormatter={(label, payload) => {
                  const fullDate = payload?.[0]?.payload?.fullDate;
                  return `Date: ${fullDate ? format(new Date(fullDate), 'MMM dd, yyyy') : label}`;
                }}
              />
              <Legend />
              {trendsData?.districts.map((district: string, index: number) => (
                <Line
                  key={district}
                  type="monotone"
                  dataKey={district}
                  name={district}
                  stroke={DISTRICT_COLORS[index % DISTRICT_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}