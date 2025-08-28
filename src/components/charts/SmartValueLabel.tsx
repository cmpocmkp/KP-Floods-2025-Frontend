import React from "react";
import { compactNumber } from "@/lib/chartFormat";

interface Props {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number;
  position?: "top" | "center" | "bottom";
}

export default function SmartValueLabel({ 
  x = 0, 
  y = 0, 
  width = 0, 
  height = 0,
  value,
  position = "top" 
}: Props) {
  if (!width || width < 18) return null; // too narrow, skip to avoid overlap
  
  const yOffset = position === "top" ? -6 
    : position === "center" ? height ? height / 2 : 0 
    : height ? height + 6 : 6;

  return (
    <text 
      x={x + width / 2} 
      y={y + yOffset} 
      textAnchor="middle"
      className="text-xs fill-current"
    >
      {compactNumber(value)}
    </text>
  );
}