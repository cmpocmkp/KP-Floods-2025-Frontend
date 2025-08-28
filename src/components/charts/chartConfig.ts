import { compactNumber, formatCurrency } from "@/lib/chartFormat";

export const DEFAULT_CHART_HEIGHT = 340;

export const DEFAULT_MARGIN = {
  top: 16,
  right: 32,
  bottom: 48,
  left: 32
};

export const DEFAULT_PIE_MARGIN = {
  top: 16,
  right: 40,
  bottom: 8,
  left: 40
};

export const AXIS_CONFIG = {
  xAxis: {
    height: 60,
    tickMargin: 8,
    interval: "preserveStartEnd" as const,
    minTickGap: 12
  },
  yAxis: {
    width: 50,
    allowDecimals: false,
    tickFormatter: compactNumber
  }
};

export const PIE_CONFIG = {
  outerRadius: 90,
  paddingAngle: 2,
  minAngle: 4,
  isAnimationActive: false
};

export const TOOLTIP_FORMATTERS = {
  number: (value: any) => compactNumber(Number(value)),
  currency: (value: any) => formatCurrency(Number(value)),
  percent: (value: any) => `${(Number(value) * 100).toFixed(1)}%`
};

export const CHART_COLORS = {
  primary: "#3B82F6",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#6B7280"
};