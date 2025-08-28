import type { PheSchemeData } from '@/api/infrastructure';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { KpiCard } from '@/components/ui/kpi-card';
import { Building2, Banknote } from 'lucide-react';

interface PheAssetsTabProps {
  data: PheSchemeData[];
}

export default function PheAssetsTab({ data }: PheAssetsTabProps): JSX.Element {
  // Calculate totals for KPIs
  const totalSchemes = data.reduce((acc, curr) => acc + curr.total_schemes, 0);

  const totalRestorationCost = data.reduce((acc, curr) => acc + curr.restoration_cost_m, 0);
  const totalRehabilitationCost = data.reduce((acc, curr) => acc + curr.rehabilitation_cost_m, 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard
          title="Total Schemes"
          value={totalSchemes.toLocaleString()}
          icon={Building2}
          color="text-blue-600"
        />
        <KpiCard
          title="Restoration Cost (M)"
          value={totalRestorationCost.toLocaleString()}
          icon={Banknote}
          color="text-yellow-600"
        />
        <KpiCard
          title="Rehabilitation Cost (M)"
          value={totalRehabilitationCost.toLocaleString()}
          icon={Banknote}
          color="text-purple-600"
        />
      </div>

      {/* District-wise PHE Schemes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            District-wise PHE Schemes Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>District</TableHead>
                  <TableHead className="text-right">Total Schemes</TableHead>
                  <TableHead className="text-right">Damaged</TableHead>
                  <TableHead className="text-right">Restored</TableHead>
                  <TableHead className="text-right">Restoration Cost (M)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((district, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{district.district}</TableCell>
                    <TableCell className="text-right">{district.total_schemes.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-red-600">{district.damaged_schemes.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-green-600">{district.restored_schemes.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-yellow-600">{district.restoration_cost_m.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}