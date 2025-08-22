import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { WarehouseKpis } from '@/features/kpis';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface StockItem {
  id: number;
  item: string;
  available: number;
  issued: number;
  remaining: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EC4899'];

export default function WarehousePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['warehouse-overview'],
    queryFn: () => Promise.resolve({
      totalItems: 12450,
      itemsIssued: 8234,
      itemsRequested: 2156,
      lowStockItems: 18,
      stockByDivision: [
        { name: 'Peshawar', value: 3200 },
        { name: 'Mardan', value: 2800 },
        { name: 'Hazara', value: 2400 },
        { name: 'Malakand', value: 2200 },
        { name: 'Bannu', value: 1850 }
      ],
      topItems: [
        {
          id: 1,
          item: "Food Packages",
          available: 2500,
          issued: 1800,
          remaining: 700,
          status: "In Stock"
        },
        {
          id: 2,
          item: "Tents",
          available: 800,
          issued: 750,
          remaining: 50,
          status: "Low Stock"
        },
        {
          id: 3,
          item: "Water Bottles",
          available: 5000,
          issued: 3200,
          remaining: 1800,
          status: "In Stock"
        }
      ],
      issuedTrend: [
        { date: '08/14', items: 420 },
        { date: '08/15', items: 380 },
        { date: '08/16', items: 550 },
        { date: '08/17', items: 480 },
        { date: '08/18', items: 620 },
        { date: '08/19', items: 580 },
        { date: '08/20', items: 450 }
      ]
    })
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Stock':
        return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
      case 'Low Stock':
        return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
      case 'Out of Stock':
        return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <WarehouseKpis data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock by Division */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Stock by Division</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.stockByDivision}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {data?.stockByDivision.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Items Issued Trend */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Items Issued in Last 7 Days</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.issuedTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="items" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Available Items */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Top Available Items</h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right">Issued</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.topItems.map((item: StockItem) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.item}</TableCell>
                  <TableCell className="text-right">{item.available.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.issued.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.remaining.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}