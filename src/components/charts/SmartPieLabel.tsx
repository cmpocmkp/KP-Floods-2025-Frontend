import React from "react";
import { compactNumber } from "@/lib/chartFormat";

const MIN_SLICE_PCT = 0.06; // hide labels <6% to avoid clutter

interface Props {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
  value: number;
}

export default function SmartPieLabel(props: Props) {
  const { cx, cy, midAngle, outerRadius, percent, name, value } = props;
  
  if (!percent || percent < MIN_SLICE_PCT) return null;

  const RAD = Math.PI / 180;
  const r = outerRadius + 12; // outside with small padding
  const x = cx + r * Math.cos(-midAngle * RAD);
  const y = cy + r * Math.sin(-midAngle * RAD);
  const sin = Math.sin(-midAngle * RAD);
  const cos = Math.cos(-midAngle * RAD);
  const textAnchor = cos >= 0 ? "start" : "end";
  const centerX = cx + (outerRadius + 25) * cos;
  const centerY = cy + (outerRadius + 25) * sin;

  return (
    <g>
      <text
        x={centerX}
        y={centerY}
        textAnchor={textAnchor}
        dominantBaseline="central"
        className="text-xs fill-current"
      >
        {`${name}: ${Math.round(percent * 100)}%`}
      </text>
      <path
        d={`M${cx + (outerRadius + 2) * cos},${
          cy + (outerRadius + 2) * sin
        }L${centerX},${centerY}`}
        stroke="currentColor"
        fill="none"
      />
    </g>
  );
}