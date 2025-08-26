import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from '@tanstack/react-query';
import { getDivisionSummary } from '@/lib/overview';

export function DivisionSummaryTable() {
  const { data: summaryData, isLoading } = useQuery({
    queryKey: ['division-summary'],
    queryFn: getDivisionSummary
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Division-wise Summary</h2>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summaryData) {
    return null;
  }
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Division-wise Summary</h2>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Division</TableHead>
              <TableHead className="text-right">Deaths</TableHead>
              <TableHead className="text-right">Injured</TableHead>
              <TableHead className="text-right">Houses Damaged</TableHead>
              <TableHead className="text-right">Schools Damaged</TableHead>
              <TableHead className="text-right">Livestock Lost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summaryData.rows.map((row) => (
              <TableRow key={row.division}>
                <TableCell className="font-medium">{row.division}</TableCell>
                <TableCell className="text-right">{row.deaths.toLocaleString()}</TableCell>
                <TableCell className="text-right">{row.injured.toLocaleString()}</TableCell>
                <TableCell className="text-right">{row.houses_damaged.toLocaleString()}</TableCell>
                <TableCell className="text-right">{row.schools_damaged.toLocaleString()}</TableCell>
                <TableCell className="text-right">{row.livestock_lost.toLocaleString()}</TableCell>
              </TableRow>
            ))}
            <TableRow className="font-semibold bg-muted/50">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">{summaryData.totals.deaths.toLocaleString()}</TableCell>
              <TableCell className="text-right">{summaryData.totals.injured.toLocaleString()}</TableCell>
              <TableCell className="text-right">{summaryData.totals.houses_damaged.toLocaleString()}</TableCell>
              <TableCell className="text-right">{summaryData.totals.schools_damaged.toLocaleString()}</TableCell>
              <TableCell className="text-right">{summaryData.totals.livestock_lost.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}