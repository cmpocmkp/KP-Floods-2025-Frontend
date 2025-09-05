import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Treemap,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter
} from 'recharts';
import { Card } from '../ui/card';
import { 
  AGRICULTURE_DATA, 
  getAgricultureSummary, 
  getDivisionSummary, 
  getTopDistricts,
  formatCurrency,
  formatNumber 
} from '../../lib/agricultureData';

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5',
  '#FF8A80', '#80CBC4', '#81C784', '#FFD54F', '#FF8A65', '#A1887F'
];

const AgricultureOverview: React.FC = () => {
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const summary = getAgricultureSummary();
  const divisionData = getDivisionSummary();
  const topDistricts = getTopDistricts();

  // Filter data for selected division
  const selectedDivisionData = selectedDivision 
    ? AGRICULTURE_DATA.filter(item => item.division === selectedDivision)
    : [];

  // Prepare data for visualizations
  const divisionChartData = divisionData.map(div => ({
    name: div.division,
    estimatedLosses: div.estimatedLosses,
    damagedAreaGIS: div.damagedAreaGIS,
    ongroundVerified: div.ongroundVerified,
    structuralDamages: div.structuralDamages
  }));

  const topDistrictsData = topDistricts.map(district => ({
    name: district.district,
    estimatedLosses: district.estimatedLosses,
    damagedAreaGIS: district.damagedAreaGIS,
    ongroundVerified: district.ongroundVerified,
    structuralDamages: district.structuralDamages
  }));

  const damageComparisonData = [
    { name: 'Structural Damages', value: summary.totalStructuralDamages, color: '#FF6B6B' },
    { name: 'Crop Mask (Acres)', value: summary.totalCropMask, color: '#4ECDC4' },
    { name: 'GIS Damaged Area', value: summary.totalDamagedAreaGIS, color: '#45B7D1' },
    { name: 'Onground Verified', value: summary.totalOngroundVerified, color: '#96CEB4' }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(Math.round(summary.totalDamagedAreaGIS))}
            </div>
            <div className="text-sm text-gray-600">Affected GIS Damaged Area (Acres)</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatNumber(Math.round(summary.totalOngroundVerified))}
            </div>
            <div className="text-sm text-gray-600">Onground Verified (Acres)</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Division-wise Losses */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Division-wise Estimated Losses</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={divisionChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis tickFormatter={(value) => `${value}M`} />
                <Tooltip
                  formatter={(value: number) => `${value} Million PKR`}
                  labelFormatter={(label) => `Division: ${label}`}
                />
                <Bar dataKey="estimatedLosses" fill="#4ECDC4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Damage Types Distribution */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Damage Types Distribution</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={damageComparisonData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ name, value }) => `${name}: ${formatNumber(Math.round(value))}`}
                >
                  {damageComparisonData.map((entry, index) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatNumber(Math.round(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>



      {/* Division Selection and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Division Cards */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Select Division</h3>
            <div className="space-y-2">
              {divisionData.map((division, index) => (
                <div
                  key={division.division}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedDivision === division.division
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedDivision(
                    selectedDivision === division.division ? null : division.division
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{division.division}</span>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {formatCurrency(division.estimatedLosses)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Division Details */}
        <div className="lg:col-span-2">
          {selectedDivision ? (
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                {selectedDivision} Division Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedDivisionData.map((district, index) => (
                  <div key={district.district} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{district.district}</h4>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {formatCurrency(district.estimatedLosses)}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>Structural Damages: {district.structuralDamages}</div>
                      <div>Crop Mask: {formatNumber(Math.round(district.cropMask))} acres</div>
                      <div>GIS Damaged: {formatNumber(Math.round(district.damagedAreaGIS))} acres</div>
                      <div>Onground Verified: {formatNumber(Math.round(district.ongroundVerified))} acres</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <div className="text-center text-gray-500">
                <h3 className="text-xl font-semibold mb-4">Division Details</h3>
                <p>Select a division to view detailed district information</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Correlation Analysis */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">GIS vs Onground Verification Correlation</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              data={AGRICULTURE_DATA.filter(item => item.damagedAreaGIS > 0 && item.ongroundVerified > 0)}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid />
              <XAxis 
                type="number" 
                dataKey="damagedAreaGIS" 
                name="Affected GIS Damaged Area (Acres)"
                tickFormatter={(value) => `${value}acres`}
              />
              <YAxis 
                type="number" 
                dataKey="ongroundVerified" 
                name="Onground Verified (Acres)"
                tickFormatter={(value) => `${value}acres`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [`${value} acres`, name]}
                labelFormatter={(label) => `District: ${label}`}
              />
              <Scatter dataKey="ongroundVerified" fill="#4ECDC4" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Summary Statistics */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Agriculture Impact Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {divisionData.length}
            </div>
            <div className="text-sm text-gray-600">Divisions Affected</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {AGRICULTURE_DATA.filter(item => item.estimatedLosses > 0).length}
            </div>
            <div className="text-sm text-gray-600">Districts with Losses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {formatNumber(Math.round(summary.totalDamagedAreaGIS))}
            </div>
            <div className="text-sm text-gray-600">Total Damaged Area (Acres)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {summary.totalEstimatedLosses.toFixed(2)} B PKR
            </div>
            <div className="text-sm text-gray-600">Total Estimated Losses (PKR)</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AgricultureOverview; 