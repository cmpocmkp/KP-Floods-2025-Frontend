import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { getIncidentTrends } from '@/lib/overview';
import { format } from 'date-fns';

export function IncidentTrendsChart() {
  const { data: trendsData, isLoading, error } = useQuery({
    queryKey: ['incident-trends'],
    queryFn: () => getIncidentTrends({
      metric: 'deaths',
      group_by: 'daily',
      fill_missing: true
    }),
    select: (data) => data.series.map(point => ({
      date: format(new Date(point.date), 'MM/dd'),
      value: point.value
    }))
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

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Incident Trends</h2>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="Deaths"
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}