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
    <Card className="min-h-[110px]">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-lg" style={{
            background: color === 'text-red-600' ? 'rgba(239,68,68,0.1)' :
                       color === 'text-orange-600' ? 'rgba(245,158,11,0.1)' :
                       color === 'text-yellow-600' ? 'rgba(245,158,11,0.1)' :
                       color === 'text-green-600' ? 'rgba(34,197,94,0.1)' :
                       color === 'text-blue-600' ? 'rgba(45,91,255,0.1)' :
                       color === 'text-purple-600' ? 'rgba(147,51,234,0.1)' :
                       'rgba(45,91,255,0.1)'
          }}>
            <Icon className="w-5 h-5" style={{
              color: color === 'text-red-600' ? 'var(--danger)' :
                     color === 'text-orange-600' || color === 'text-yellow-600' ? 'var(--warning)' :
                     color === 'text-green-600' ? 'var(--success)' :
                     color === 'text-blue-600' ? 'var(--primary-600)' :
                     color === 'text-purple-600' ? '#9333EA' :
                     'var(--primary-600)'
            }} />
          </div>
          <div className="min-w-0 flex flex-col">
            <p className="text-sm font-medium" style={{color: 'var(--text-700)'}}>{title}</p>
            <h3 className="text-2xl font-[800] mt-1 truncate" style={{color: 'var(--text-900)'}}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </h3>
            {trend && (
              <div className="text-sm mt-1" style={{
                color: trend.isPositive ? 'var(--success)' : 'var(--danger)'
              }}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </div>
            )}
            {description && (
              <p className="mt-1 text-xs line-clamp-2" style={{color: 'var(--text-500)'}}>{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}