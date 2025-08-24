import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getRecentIncidents } from '@/api/incidents';
import { DEFAULT_DATE_RANGE } from '@/lib/api';
import type { IncidentRow } from '@/types/api';

interface ChartData {
  date: string;
  deaths: number;
  injured: number;
  houses: number;
}

export function IncidentTrendsChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incidents = await getRecentIncidents({
          date_from: DEFAULT_DATE_RANGE.from,
          date_to: DEFAULT_DATE_RANGE.to,
          limit: 7
        });
        const chartData = incidents.map(incident => ({
          date: new Date(incident.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
          deaths: incident.deaths,
          injured: incident.injured,
          houses: incident.houses_damaged
        }));
        setData(chartData.reverse()); // Most recent last
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
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
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="deaths" 
                name="Deaths"
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="injured" 
                name="Injured"
                stroke="#eab308" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="houses" 
                name="Houses Damaged"
                stroke="#3b82f6" 
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