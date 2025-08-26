import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { getDamageDistribution } from '@/lib/overview';

const COLORS = {
  'Human Casualties': '#ef4444',
  'Infrastructure Damage': '#f97316',
  'Housing Damage': '#3b82f6',
  'Agricultural Loss': '#22c55e',
  'Other': '#8b5cf6'
};

const LABELS = {
  'Human Casualties': 'Human Casualties',
  'Infrastructure Damage': 'Infrastructure Damage',
  'Housing Damage': 'Housing Damage',
  'Agricultural Loss': 'Agricultural Loss',
  'Other': 'Other'
};

export function DamageDonut() {
  const { data: damageData } = useQuery({
    queryKey: ['damage-distribution'],
    queryFn: getDamageDistribution
  });

  if (!damageData) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Damage Distribution</h2>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Predefined colors for fallback
  const DEFAULT_COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e', '#8b5cf6', '#ec4899', '#06b6d4'];

  const data = damageData.buckets.map((bucket, index) => ({
    name: LABELS[bucket.key as keyof typeof LABELS] || bucket.key,
    value: bucket.value,
    color: COLORS[bucket.key as keyof typeof COLORS] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
  }));

  const total = damageData.total_incidents;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Damage Distribution</h2>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [value.toLocaleString(), 'Count']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-3xl font-bold">{total.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Incidents</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}