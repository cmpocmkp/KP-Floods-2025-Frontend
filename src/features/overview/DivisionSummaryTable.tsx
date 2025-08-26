
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

  // Calculate totals from the array data
  const totals = summaryData.reduce(
    (acc, division) => ({
      deaths: acc.deaths + division.deaths,
      injured: acc.injured + division.injured,
      houses_damaged: acc.houses_damaged + division.houses_damaged,
      schools_damaged: acc.schools_damaged + division.schools_damaged,
      livestock_lost: acc.livestock_lost + division.livestock_lost,
    }),
    { deaths: 0, injured: 0, houses_damaged: 0, schools_damaged: 0, livestock_lost: 0 }
  );

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Division-wise Summary</h2>
        <p className="text-sm text-muted-foreground">
          Impact summary across {summaryData.length} divisions
        </p>
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
            {summaryData.map((division) => (
              <TableRow key={division.division}>
                <TableCell className="font-medium">{division.division}</TableCell>
                <TableCell className="text-right">{division.deaths.toLocaleString()}</TableCell>
                <TableCell className="text-right">{division.injured.toLocaleString()}</TableCell>
                <TableCell className="text-right">{division.houses_damaged.toLocaleString()}</TableCell>
                <TableCell className="text-right">{division.schools_damaged.toLocaleString()}</TableCell>
                <TableCell className="text-right">{division.livestock_lost.toLocaleString()}</TableCell>
              </TableRow>
            ))}
            <TableRow className="font-semibold bg-muted/50">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">{totals.deaths.toLocaleString()}</TableCell>
              <TableCell className="text-right">{totals.injured.toLocaleString()}</TableCell>
              <TableCell className="text-right">{totals.houses_damaged.toLocaleString()}</TableCell>
              <TableCell className="text-right">{totals.schools_damaged.toLocaleString()}</TableCell>
              <TableCell className="text-right">{totals.livestock_lost.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}