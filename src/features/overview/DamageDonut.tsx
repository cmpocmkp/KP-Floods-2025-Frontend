import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Deaths', value: 156, color: '#ef4444' },
  { name: 'Injured', value: 342, color: '#eab308' },
  { name: 'Houses Damaged', value: 1245, color: '#3b82f6' },
  { name: 'Livestock Lost', value: 789, color: '#22c55e' }
];

export function DamageDonut() {
  const total = data.reduce((sum, item) => sum + item.value, 0);

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