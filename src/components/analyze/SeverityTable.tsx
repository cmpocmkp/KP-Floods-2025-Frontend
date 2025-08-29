import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Trophy,
  Settings,
  Skull,
  Activity,
  Home,
  School,
  Building2,
  Beef,
  Target
} from 'lucide-react';
import { DSRAggregates, SeverityWeights } from '@/api/dsr';

interface SeverityTableProps {
  aggregates: DSRAggregates;
  weights: SeverityWeights;
  onWeightsChange: (weights: SeverityWeights) => void;
}

export function SeverityTable({ aggregates, weights, onWeightsChange }: SeverityTableProps) {
  const [showWeightsModal, setShowWeightsModal] = useState(false);

  // Recalculate severity scores with current weights
  const severityRecords = aggregates.severityRecords
    .map(record => ({
      ...record,
      severity: record.deaths * weights.death +
                record.injured * weights.inj +
                record.housesFull * weights.full +
                record.housesPartial * weights.part +
                record.schools * weights.school +
                record.other * weights.other +
                record.cattle * weights.cattle
    }))
    .sort((a, b) => b.severity - a.severity);

  const handleWeightChange = (key: keyof SeverityWeights, value: string) => {
    const numValue = parseFloat(value) || 0;
    onWeightsChange({
      ...weights,
      [key]: numValue
    });
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 100) return 'text-red-600 bg-red-50';
    if (severity >= 50) return 'text-orange-600 bg-orange-50';
    if (severity >= 10) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getSeverityLabel = (severity: number) => {
    if (severity >= 100) return 'Critical';
    if (severity >= 50) return 'High';
    if (severity >= 10) return 'Medium';
    return 'Low';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            District Severity Ranking
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowWeightsModal(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Adjust Weights
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>District</TableHead>
              <TableHead className="text-right">Severity Score</TableHead>
              <TableHead className="text-right">Deaths</TableHead>
              <TableHead className="text-right">Injured</TableHead>
              <TableHead className="text-right">Houses Full</TableHead>
              <TableHead className="text-right">Houses Partial</TableHead>
              <TableHead className="text-right">Schools</TableHead>
              <TableHead className="text-right">Other</TableHead>
              <TableHead className="text-right">Cattle</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {severityRecords.slice(0, 10).map((record, index) => (
              <TableRow key={record.district}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={index === 0 ? "default" : "secondary"}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-600 text-white' : ''
                      }`}
                    >
                      {index + 1}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{record.district}</TableCell>
                <TableCell className="text-right">
                  <Badge className={`${getSeverityColor(record.severity)} border-0`}>
                    {record.severity.toFixed(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold text-red-600">
                  {record.deaths.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-yellow-600">
                  {record.injured.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-red-500">
                  {record.housesFull.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-orange-500">
                  {record.housesPartial.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-purple-600">
                  {record.schools.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-indigo-600">
                  {record.other.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-green-600">
                  {record.cattle.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {severityRecords.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No severity data available
          </div>
        )}

        {severityRecords.length > 10 && (
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Showing top 10 districts. {severityRecords.length - 10} more districts available.
            </p>
          </div>
        )}

        {/* Weights Adjustment Modal */}
        {showWeightsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Adjust Severity Weights</h3>
                <Button variant="outline" size="sm" onClick={() => setShowWeightsModal(false)}>
                  Close
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                Adjust weights to customize severity calculation. Higher weights give more importance to that factor.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Skull className="h-4 w-4 text-red-500" />
                    Deaths
                  </Label>
                  <Input
                    type="number"
                    value={weights.death}
                    onChange={(e) => handleWeightChange('death', e.target.value)}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-yellow-500" />
                    Injured
                  </Label>
                  <Input
                    type="number"
                    value={weights.inj}
                    onChange={(e) => handleWeightChange('inj', e.target.value)}
                    min="0"
                    max="1"
                    step="0.1"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Home className="h-4 w-4 text-red-400" />
                    Houses Fully Damaged
                  </Label>
                  <Input
                    type="number"
                    value={weights.full}
                    onChange={(e) => handleWeightChange('full', e.target.value)}
                    min="0"
                    max="2"
                    step="0.1"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Home className="h-4 w-4 text-orange-400" />
                    Houses Partially Damaged
                  </Label>
                  <Input
                    type="number"
                    value={weights.part}
                    onChange={(e) => handleWeightChange('part', e.target.value)}
                    min="0"
                    max="1"
                    step="0.1"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <School className="h-4 w-4 text-purple-500" />
                    Schools Damaged
                  </Label>
                  <Input
                    type="number"
                    value={weights.school}
                    onChange={(e) => handleWeightChange('school', e.target.value)}
                    min="0"
                    max="1"
                    step="0.1"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-indigo-500" />
                    Other Buildings
                  </Label>
                  <Input
                    type="number"
                    value={weights.other}
                    onChange={(e) => handleWeightChange('other', e.target.value)}
                    min="0"
                    max="1"
                    step="0.1"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Beef className="h-4 w-4 text-green-500" />
                    Cattle Perished
                  </Label>
                  <Input
                    type="number"
                    value={weights.cattle}
                    onChange={(e) => handleWeightChange('cattle', e.target.value)}
                    min="0"
                    max="0.5"
                    step="0.05"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowWeightsModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setShowWeightsModal(false)}
                  >
                    Apply Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}