import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { date: '08/14', deaths: 12, injured: 28, houses: 156 },
  { date: '08/15', deaths: 15, injured: 35, houses: 189 },
  { date: '08/16', deaths: 8, injured: 22, houses: 134 },
  { date: '08/17', deaths: 18, injured: 42, houses: 245 },
  { date: '08/18', deaths: 14, injured: 31, houses: 178 },
  { date: '08/19', deaths: 11, injured: 26, houses: 167 },
  { date: '08/20', deaths: 9, injured: 24, houses: 145 }
];

export function IncidentTrendsChart() {
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
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="injured" 
                stroke="#eab308" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="houses" 
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