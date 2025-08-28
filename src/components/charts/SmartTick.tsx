import React from "react";
import { truncate } from "@/lib/chartFormat";

type Props = { 
  x?: number; 
  y?: number; 
  payload?: any; 
  max?: number; 
  angle?: number;
  textAnchor?: "start" | "middle" | "end";
};

export default function SmartTick({ 
  x = 0, 
  y = 0, 
  payload, 
  max = 12, 
  angle = -35,
  textAnchor = "end" 
}: Props) {
  const label = String(payload?.value ?? "");
  const short = truncate(label, max);
  
  return (
    <g transform={`translate(${x},${y})`}>
      <title>{label}</title>
      <text 
        x={0}
        y={0}
        dy={16} 
        textAnchor={textAnchor}
        transform={`rotate(${angle})`}
        className="text-xs fill-current"
      >
        {short}
      </text>
    </g>
  );
}