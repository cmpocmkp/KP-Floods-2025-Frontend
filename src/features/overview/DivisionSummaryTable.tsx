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

const data = [
  {
    division: "Peshawar",
    deaths: 45,
    injured: 98,
    housesDamaged: 345,
    schoolsDamaged: 12,
    livestockLost: 234
  },
  {
    division: "Mardan",
    deaths: 32,
    injured: 76,
    housesDamaged: 289,
    schoolsDamaged: 8,
    livestockLost: 167
  },
  {
    division: "Hazara",
    deaths: 28,
    injured: 65,
    housesDamaged: 256,
    schoolsDamaged: 7,
    livestockLost: 145
  },
  {
    division: "Malakand",
    deaths: 38,
    injured: 87,
    housesDamaged: 312,
    schoolsDamaged: 11,
    livestockLost: 198
  }
];

export function DivisionSummaryTable() {
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
            {data.map((row) => (
              <TableRow key={row.division}>
                <TableCell className="font-medium">{row.division}</TableCell>
                <TableCell className="text-right">{row.deaths.toLocaleString()}</TableCell>
                <TableCell className="text-right">{row.injured.toLocaleString()}</TableCell>
                <TableCell className="text-right">{row.housesDamaged.toLocaleString()}</TableCell>
                <TableCell className="text-right">{row.schoolsDamaged.toLocaleString()}</TableCell>
                <TableCell className="text-right">{row.livestockLost.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}