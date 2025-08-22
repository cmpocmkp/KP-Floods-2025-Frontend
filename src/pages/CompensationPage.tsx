import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CompensationPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['compensation-details'],
    queryFn: () => Promise.resolve({
      processingRate: 28,
      estimatedCompletion: 47,
      districtData: [
        {
          district: "Peshawar",
          beneficiariesPaid: 180,
          pendingCases: 220,
          amountDisbursed: 90000000,
          lastUpdate: "2025-08-19T10:30:00Z"
        },
        {
          district: "Charsadda",
          beneficiariesPaid: 150,
          pendingCases: 180,
          amountDisbursed: 75000000,
          lastUpdate: "2025-08-19T09:15:00Z"
        },
        {
          district: "Nowshera",
          beneficiariesPaid: 120,
          pendingCases: 160,
          amountDisbursed: 60000000,
          lastUpdate: "2025-08-19T11:45:00Z"
        }
      ],
      disbursementTrend: [
        { date: '08/14', amount: 45000000 },
        { date: '08/15', amount: 52000000 },
        { date: '08/16', amount: 63000000 },
        { date: '08/17', amount: 58000000 },
        { date: '08/18', amount: 72000000 },
        { date: '08/19', amount: 68000000 },
        { date: '08/20', amount: 62000000 }
      ]
    })
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Processing Status</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Processing Rate</p>
                <p className="text-2xl font-bold">{data?.processingRate} cases/day</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Est. Completion</p>
                <p className="text-2xl font-bold">{data?.estimatedCompletion} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disbursement Trend */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Daily Disbursement Trend</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.disbursementTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis 
                    tickFormatter={(value) => 
                      `${(value / 1000000).toFixed(0)}M`
                    }
                  />
                  <Tooltip 
                    formatter={(value: number) => 
                      [formatCurrency(value), "Amount Disbursed"]
                    }
                  />
                  <Bar dataKey="amount" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* District-wise Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">District-wise Compensation Status</h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>District</TableHead>
                <TableHead className="text-right">Beneficiaries Paid</TableHead>
                <TableHead className="text-right">Pending Cases</TableHead>
                <TableHead className="text-right">Amount Disbursed</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead className="text-right">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.districtData.map((district) => {
                const total = district.beneficiariesPaid + district.pendingCases;
                const progress = (district.beneficiariesPaid / total) * 100;
                
                return (
                  <TableRow key={district.district}>
                    <TableCell className="font-medium">{district.district}</TableCell>
                    <TableCell className="text-right">{district.beneficiariesPaid.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{district.pendingCases.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{formatCurrency(district.amountDisbursed)}</TableCell>
                    <TableCell>
                      {new Date(district.lastUpdate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-sm">{progress.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}