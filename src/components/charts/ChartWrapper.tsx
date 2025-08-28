import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Props {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  height?: number;
  onExport?: () => void;
  className?: string;
}

export default function ChartWrapper({
  title,
  icon: Icon,
  children,
  height = 340,
  onExport,
  className = ""
}: Props) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5" />}
          {title}
        </CardTitle>
        {onExport && (
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        )}
      </CardHeader>
      <CardContent style={{ height }}>
        {children}
      </CardContent>
    </Card>
  );
}