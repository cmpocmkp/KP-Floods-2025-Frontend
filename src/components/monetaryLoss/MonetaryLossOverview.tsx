import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Treemap,
  Legend
} from 'recharts';
import { Card } from '../ui/card';
import { fetchMonetaryLossData } from '../../api/monetaryLoss';
import { formatCurrency, calculatePercentage } from '../../lib/monetaryLossUtils';
import { MonetaryLossCategory } from '../../types/monetaryLoss';
import LoadingSpinner from '../Layout/LoadingSpinner';

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5',
  '#FF8A80', '#80CBC4', '#81C784', '#FFD54F', '#FF8A65', '#A1887F'
];

const MonetaryLossOverview: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ['monetaryLoss'],
    queryFn: fetchMonetaryLossData
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h2>
        <p className="text-gray-700 mb-2">There was an error loading the monetary loss data:</p>
        <p className="text-red-500 bg-red-50 p-3 rounded-md">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </p>
      </Card>
    );
  }
  if (!data) return null;

  const totalLoss = data.totalLossInRupees;
  const totalLossInBillions = data.totalLossInBillions;

  // Prepare data for different visualizations
  const categoryData = data.categories.map(cat => ({
    name: cat.category,
    value: cat.totalLoss,
    percentage: (cat.totalLoss / totalLoss) * 100
  }));

  // Debug: Log the data being passed to the chart
  console.log('Category Data for Bar Chart:', categoryData);

  const treemapData = data.categories.map(category => ({
    name: category.category,
    value: category.totalLoss,
    children: category.items.map(item => ({
      name: item.type,
      value: item.totalLoss,
      size: item.totalLoss
    }))
  }));

  // Debug: Log the treemap data
  console.log('Treemap Data:', treemapData);
  console.log('All Categories:', data.categories.map(cat => ({ name: cat.category, totalLoss: cat.totalLoss, itemCount: cat.items.length })));

  const selectedCategoryData = selectedCategory 
    ? data.categories.find(cat => cat.category === selectedCategory)?.items || []
    : [];

  return (
    <div className="space-y-6">
      {/* Total Loss Banner */}
      <Card className="p-8 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Monetary Loss</h1>
          <div className="text-6xl font-bold mb-2">
            ~{formatCurrency(Math.round(totalLoss))}
          </div>
          <div className="text-2xl opacity-90">
            (~{Math.round(totalLossInBillions * 100) / 100} B PKR)
          </div>
          <div className="text-lg mt-4 opacity-80">
            Comprehensive damage assessment across all sectors
          </div>
        </div>
      </Card>

      {/* Category Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.categories.map((category, index) => (
          <Card 
            key={category.category}
            className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedCategory === category.category ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedCategory(
              selectedCategory === category.category ? null : category.category
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">{category.category}</h3>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              ~{(Math.round((category.totalLoss / 1_000_000_000) * 100) / 100).toFixed(2)} B PKR
            </div>
            <div className="text-sm text-gray-600">
              {((category.totalLoss / totalLoss) * 100).toFixed(1)}% of total
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Treemap */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Damage Distribution Heatmap</h3>
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={categoryData}
                dataKey="value"
                stroke="#fff"
                fill="#8884d8"
                content={({ root, depth, x, y, width, height, index, payload, colors, rank, name, value }) => (
                  <g>
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      style={{
                        fill: COLORS[index % COLORS.length],
                        stroke: '#fff',
                        strokeWidth: 2,
                        strokeOpacity: 1 / (depth + 1e-10),
                      }}
                    />
                    {width > 80 && height > 40 && (
                      <>
                        <text
                          x={x + width / 2}
                          y={y + height / 2 - 10}
                          textAnchor="middle"
                          fill="#fff"
                          fontSize={12}
                          fontWeight="bold"
                        >
                          {name}
                        </text>
                        <text
                          x={x + width / 2}
                          y={y + height / 2 + 10}
                          textAnchor="middle"
                          fill="#fff"
                          fontSize={10}
                        >
                          ~{(Math.round((value / 1_000_000_000) * 100) / 100).toFixed(2)} B PKR
                        </text>
                      </>
                    )}
                  </g>
                )}
              />
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Comparison */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Category-wise Distribution</h3>
          <div className="h-[500px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={200}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                    labelLine={true}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded shadow-lg">
                            <p className="font-semibold">{data.name}</p>
                            <p className="text-[#4ECDC4]">
                              Amount: {formatCurrency(data.value)}
                            </p>
                            <p className="text-[#FF6B6B]">
                              Percentage: {data.percentage.toFixed(1)}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No data available for chart</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      {selectedCategory && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">
            Detailed Breakdown: {selectedCategory}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedCategoryData.map((item, index) => (
              <div key={item.type} className="bg-white rounded-lg shadow p-4 border-l-4" style={{ borderLeftColor: COLORS[index % COLORS.length] }}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-semibold text-gray-800">{item.type}</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  ~{formatCurrency(Math.round(item.totalLoss))}
                </div>
                <div className="text-sm text-gray-600">
                  ~{(Math.round((item.totalLoss / 1_000_000_000) * 1000) / 1000).toFixed(3)} B PKR
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* All Departments Breakdown */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">All Departments & Damage Types</h3>
        <div className="space-y-6">
          {data.categories.map((category, categoryIndex) => (
            <div key={category.category} className="border-b pb-6 last:border-b-0">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                  <div 
                    className="w-4 h-4 rounded mr-3" 
                    style={{ backgroundColor: COLORS[categoryIndex % COLORS.length] }}
                  ></div>
                  {category.category}
                </h4>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    ~{formatCurrency(Math.round(category.totalLoss))}
                  </div>
                  <div className="text-sm text-gray-600">
                    {((category.totalLoss / totalLoss) * 100).toFixed(1)}% of total
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.items.map((item, itemIndex) => (
                  <div key={item.type} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="text-sm font-medium text-gray-800">{item.type}</h5>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      ~{formatCurrency(Math.round(item.totalLoss))}
                    </div>
                    <div className="text-xs text-gray-600">
                      ~{(Math.round((item.totalLoss / 1_000_000_000) * 1000) / 1000).toFixed(3)} B PKR
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary Statistics */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Summary Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {data.categories.length}
            </div>
            <div className="text-sm text-gray-600">Damage Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {data.categories.reduce((sum, cat) => sum + cat.items.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Damage Types</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              ~{Math.round(totalLossInBillions * 100) / 100} B PKR
            </div>
            <div className="text-sm text-gray-600">Total Loss (PKR)</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MonetaryLossOverview;