import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  color,
  trend
}: KpiCardProps) {
  return (
    <Card className="h-[140px]">
      <CardContent className="pt-6 h-full">
        <div className="flex items-start gap-4 h-full">
          <div className={`${color} bg-white/10 p-3 rounded-full shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex flex-col">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <h3 className="text-2xl font-semibold mt-1 truncate">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </h3>
            {trend && (
              <div className={`text-sm mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </div>
            )}
            {description && (
              <p className="mt-auto text-sm text-muted-foreground line-clamp-2">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}