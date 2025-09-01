import React, { useState } from 'react';
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
import { processCompensationData, formatCurrency, formatNumber } from '../../lib/compensationPolicy';
import { CompensationCategory } from '../../types/compensation';

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5',
  '#FF8A80', '#80CBC4', '#81C784', '#FFD54F', '#FF8A65', '#A1887F'
];

const CompensationPolicyOverview: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const data = processCompensationData();

  // Prepare data for visualizations
  const categoryData = data.categories.map(cat => ({
    name: cat.category,
    compensation: cat.totalCompensation,
    beneficiaries: cat.totalCount,
    percentage: (cat.totalCompensation / data.totalCompensation) * 100
  }));

  const treemapData = data.categories.map(category => ({
    name: category.category,
    value: category.totalCompensation,
    children: category.items.map(item => ({
      name: item.type,
      value: item.total,
      size: item.total
    }))
  }));

  const selectedCategoryData = selectedCategory 
    ? data.categories.find(cat => cat.category === selectedCategory)?.items || []
    : [];

  return (
    <div className="space-y-6">
      {/* Total Compensation Banner */}
      <Card className="p-8 bg-gradient-to-r from-green-500 via-blue-500 to-green-600 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Compensation Policy Summary</h1>
          <div className="text-6xl font-bold mb-2">
            ~{formatCurrency(Math.round(data.totalCompensation))}
          </div>
          <div className="text-2xl opacity-90">
            (~{Math.round(data.totalCompensation / 1_000_000_000 * 100) / 100} Billion PKR)
          </div>
          <div className="text-lg mt-4 opacity-80">
            Total Beneficiaries: ~76,350
          </div>
        </div>
      </Card>

      {/* Category Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
              {(category.totalCompensation / 1_000_000_000).toFixed(2)}B
            </div>
            <div className="text-sm text-gray-600">
              ~{formatNumber(Math.round(category.totalCount))} beneficiaries
            </div>
            <div className="text-xs text-gray-500">
              {((category.totalCompensation / data.totalCompensation) * 100).toFixed(1)}% of total
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compensation Distribution Treemap */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Compensation Distribution</h3>
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={treemapData}
                dataKey="value"
                stroke="#fff"
                fill="#8884d8"
              />
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Comparison */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Category-wise Distribution</h3>
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="compensation"
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
                            Amount: {formatCurrency(data.compensation)}
                          </p>
                          <p className="text-[#FF6B6B]">
                            Percentage: {data.percentage.toFixed(1)}%
                          </p>
                          <p className="text-[#45B7D1]">
                            Beneficiaries: {formatNumber(data.beneficiaries)}
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
                    {((item.total / data.totalCompensation) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Compensation:</span> {formatCurrency(item.compensation)}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Count:</span> ~{formatNumber(Math.round(item.count))}
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(item.total)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* All Compensation Types */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">All Compensation Types</h3>
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
                    {formatCurrency(category.totalCompensation)}
                  </div>
                                     <div className="text-sm text-gray-600">
                     ~{formatNumber(Math.round(category.totalCount))} beneficiaries
                   </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.items.map((item, itemIndex) => (
                  <div key={item.type} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-sm font-medium text-gray-800">{item.type}</h5>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {((item.total / data.totalCompensation) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600">
                        Rate: {formatCurrency(item.compensation)}
                      </div>
                                             <div className="text-xs text-gray-600">
                         Count: ~{formatNumber(Math.round(item.count))}
                       </div>
                      <div className="text-sm font-bold text-gray-900">
                        {formatCurrency(item.total)}
                      </div>
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
        <h3 className="text-xl font-semibold mb-4">Compensation Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {data.categories.length}
            </div>
            <div className="text-sm text-gray-600">Compensation Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {data.categories.reduce((sum, cat) => sum + cat.items.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Compensation Types</div>
          </div>
          <div className="text-center">
                         <div className="text-3xl font-bold text-purple-600">
               ~{formatNumber(Math.round(data.totalBeneficiaries))}
             </div>
            <div className="text-sm text-gray-600">Total Beneficiaries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {(data.totalCompensation / 1_000_000_000).toFixed(2)}B
            </div>
            <div className="text-sm text-gray-600">Total Compensation (PKR)</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CompensationPolicyOverview; 