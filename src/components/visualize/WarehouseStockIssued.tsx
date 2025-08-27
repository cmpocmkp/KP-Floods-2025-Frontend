import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts';
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Download,
  Info,
  CheckCircle,
  Clock
} from 'lucide-react';
import { VisualizeFilters } from '@/pages/VisualizePage';
import { getStockByDivision, getItemsIssuedTrend, getTopItems } from '@/api/warehouse';

interface WarehouseStockIssuedProps {
  warehouseData?: any;
  filters: VisualizeFilters;
  crossFilters: {
    selectedDistricts: string[];
    selectedDivisions: string[];
    selectedCategories: string[];
  };
  onCrossFilterChange: (filters: {
    selectedDistricts: string[];
    selectedDivisions: string[];
    selectedCategories: string[];
  }) => void;
}

interface StockData {
  name: string;
  value: number;
  color: string;
}

interface IssuedTrendData {
  date: string;
  items: number;
}

interface TopItemData {
  id: number;
  item: string;
  available: number;
  issued: number;
  remaining: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export function WarehouseStockIssued({ warehouseData, filters, crossFilters, onCrossFilterChange }: WarehouseStockIssuedProps) {
  const [selectedView, setSelectedView] = useState<'overview' | 'trends' | 'inventory'>('overview');

  // Fetch warehouse data
  const { data: stockByDivision, isLoading: isLoadingStock } = useQuery({
    queryKey: ['warehouse-stock-by-division'],
    queryFn: getStockByDivision,
  });

  const { data: issuedTrend, isLoading: isLoadingTrend } = useQuery({
    queryKey: ['warehouse-issued-trend'],
    queryFn: getItemsIssuedTrend,
  });

  const { data: topItems, isLoading: isLoadingTopItems } = useQuery({
    queryKey: ['warehouse-top-items'],
    queryFn: getTopItems,
  });

  // Process stock by division data
  const stockData = useMemo(() => {
    if (!stockByDivision) return [];

    return stockByDivision.map((item, index) => ({
      ...item,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index % 6]
    }));
  }, [stockByDivision]);

  // Process issued trend data
  const trendData = useMemo(() => {
    if (!issuedTrend) return [];
    return issuedTrend.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));
  }, [issuedTrend]);

  // Process top items data
  const topItemsData = useMemo(() => {
    if (!topItems) return [];
    return topItems.slice(0, 10).map(item => ({
      ...item,
      statusColor: item.status === 'Out of Stock' ? '#ef4444' :
                   item.status === 'Low Stock' ? '#f59e0b' : '#10b981',
      utilizationRate: item.available > 0 ? ((item.issued / (item.available + item.issued)) * 100) : 0
    }));
  }, [topItems]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!stockByDivision || !topItems) return null;

    const totalStock = stockByDivision.reduce((sum, item) => sum + item.value, 0);
    const totalIssued = topItems.reduce((sum, item) => sum + item.issued, 0);
    const lowStockItems = topItems.filter(item => item.status === 'Low Stock').length;
    const outOfStockItems = topItems.filter(item => item.status === 'Out of Stock').length;

    return {
      totalStock,
      totalIssued,
      lowStockItems,
      outOfStockItems,
      utilizationRate: totalStock > 0 ? ((totalIssued / totalStock) * 100) : 0
    };
  }, [stockByDivision, topItems]);

  // Handle CSV export
  const handleExportCSV = () => {
    let csvContent = '';

    if (selectedView === 'overview') {
      const headers = ['Division', 'Stock Level'];
      csvContent = [
        headers.join(','),
        ...stockData.map(item => [`"${item.name}"`, item.value].join(','))
      ].join('\n');
    } else if (selectedView === 'inventory') {
      const headers = ['Item', 'Available', 'Issued', 'Remaining', 'Status', 'Utilization Rate (%)'];
      csvContent = [
        headers.join(','),
        ...topItemsData.map(item => [
          `"${item.item}"`,
          item.available,
          item.issued,
          item.remaining,
          `"${item.status}"`,
          item.utilizationRate.toFixed(1)
        ].join(','))
      ].join('\n');
    } else {
      const headers = ['Date', 'Items Issued'];
      csvContent = [
        headers.join(','),
        ...trendData.map(item => [item.date, item.items].join(','))
      ].join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `warehouse_${selectedView}_analysis.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isLoading = isLoadingStock || isLoadingTrend || isLoadingTopItems;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Warehouse & Relief Operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-muted-foreground">Loading warehouse data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stockData.length && !trendData.length && !topItemsData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Warehouse & Relief Operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Warehouse Data</h3>
            <p>No warehouse inventory data available for the selected period.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Warehouse & Relief Operations
            <Badge variant="outline" className="ml-2">
              {stockData.length} divisions
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedView === 'overview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('overview')}
            >
              Overview
            </Button>
            <Button
              variant={selectedView === 'trends' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('trends')}
            >
              Trends
            </Button>
            <Button
              variant={selectedView === 'inventory' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('inventory')}
            >
              Inventory
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-1" />
              CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Statistics */}
          {summaryStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Package className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-xl font-bold text-blue-600">
                  {summaryStats.totalStock.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Total Stock</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-xl font-bold text-green-600">
                  {summaryStats.totalIssued.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Items Issued</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <div className="text-xl font-bold text-orange-600">
                  {summaryStats.lowStockItems}
                </div>
                <div className="text-xs text-gray-600">Low Stock Items</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-xl font-bold text-red-600">
                  {summaryStats.utilizationRate.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600">Utilization Rate</div>
              </div>
            </div>
          )}

          {/* Content based on selected view */}
          {selectedView === 'overview' && stockData.length > 0 && (
            <>
              {/* Stock Distribution by Division */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Stock Distribution by Division</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Info className="h-4 w-4" />
                    <span>Current stock levels across divisions</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stockData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {stockData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Stock Items']} />
                    </PieChart>
                  </ResponsiveContainer>

                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stockData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [value, 'Stock Items']} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {selectedView === 'trends' && trendData.length > 0 && (
            <>
              {/* Issuance Trends Over Time */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Item Issuance Trends</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>Daily item issuance patterns</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [value, 'Items Issued']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="items"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="Items Issued"
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {selectedView === 'inventory' && topItemsData.length > 0 && (
            <>
              {/* Top Items Inventory Status */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Top Items Inventory Status</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Stock levels and utilization rates</span>
                  </div>
                </div>
                {topItemsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={topItemsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="item"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                      />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value, name) => [value, name]}
                        labelFormatter={(label) => `Item: ${label}`}
                      />
                      <Legend />
                      <Bar
                        dataKey="available"
                        fill="#10b981"
                        name="Available Stock"
                        radius={[2, 2, 0, 0]}
                        yAxisId="left"
                      />
                      <Bar
                        dataKey="issued"
                        fill="#3b82f6"
                        name="Items Issued"
                        radius={[2, 2, 0, 0]}
                        yAxisId="left"
                      />
                      <Line
                        type="monotone"
                        dataKey="utilizationRate"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        name="Utilization Rate (%)"
                        yAxisId="right"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-gray-500">
                    <div className="text-center">
                      <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No warehouse data available</p>
                      <p className="text-sm">Warehouse inventory will appear here when data is available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Low Stock Alert */}
              {summaryStats && (summaryStats.lowStockItems > 0 || summaryStats.outOfStockItems > 0) && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-900 mb-2">Inventory Alert</h4>
                      <div className="text-sm text-orange-700">
                        {summaryStats.lowStockItems > 0 && (
                          <div>• {summaryStats.lowStockItems} items are running low on stock</div>
                        )}
                        {summaryStats.outOfStockItems > 0 && (
                          <div>• {summaryStats.outOfStockItems} items are completely out of stock</div>
                        )}
                        <div>• Consider restocking critical relief items</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}