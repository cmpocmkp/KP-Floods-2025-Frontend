import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PieChart, Download, Target, TrendingUp } from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ReferenceLine
} from 'recharts';

interface DamagePatternAnalysisProps {
  aggregates: any;
}

const DAMAGE_COLORS = ['#dc2626', '#ea580c', '#d97706', '#65a30d', '#059669', '#0891b2', '#7c3aed', '#c026d3'];

export function DamagePatternAnalysis({ aggregates }: DamagePatternAnalysisProps) {
  // Analyze damage patterns
  const damagePatternsData = useMemo(() => {
    if (!aggregates?.severityRecords) return null;

    // Aggregate damage by type
    const damageTypes = {
      houses: aggregates.totals.housesTotal || 0,
      schools: aggregates.totals.schoolsTotal || 0,
      infrastructure: aggregates.totals.otherTotal || 0,
      livestock: aggregates.totals.cattle || 0
    };

    // Calculate percentages
    const totalDamage = Object.values(damageTypes).reduce((sum, val) => sum + val, 0);
    const damagePercentages = Object.entries(damageTypes).map(([type, value]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      value,
      percentage: totalDamage > 0 ? ((value / totalDamage) * 100).toFixed(1) : 0
    }));

    // Damage distribution by district (top affected)
    const districtDamage = aggregates.severityRecords
      .filter(record => record.district && record.district !== 'Unknown District')
      .map(record => ({
        district: record.district,
        houses: (record.housesFull || 0) + (record.housesPartial || 0),
        schools: record.schools || 0,
        infrastructure: record.other || 0,
        livestock: record.cattle || 0,
        totalDamage: (record.housesFull || 0) + (record.housesPartial || 0) + (record.schools || 0) + (record.other || 0) + (record.cattle || 0)
      }))
      .sort((a, b) => b.totalDamage - a.totalDamage)
      .slice(0, 10);

    // Damage intensity analysis (damage per capita)
    const damageIntensity = aggregates.severityRecords
      .filter(record => record.district && record.district !== 'Unknown District')
      .map(record => {
        const totalCasualties = (record.deaths || 0) + (record.injured || 0);
        const totalDamage = (record.housesFull || 0) + (record.housesPartial || 0) + (record.schools || 0) + (record.other || 0) + (record.cattle || 0);
        return {
          district: record.district,
          casualties: totalCasualties,
          damage: totalDamage,
          intensity: totalCasualties > 0 ? totalDamage / totalCasualties : 0
        };
      })
      .filter(item => item.intensity > 0)
      .sort((a, b) => b.intensity - a.intensity)
      .slice(0, 8);

    return {
      damageTypes,
      damagePercentages,
      districtDamage,
      damageIntensity,
      totalDamage
    };
  }, [aggregates]);

  const handleExportCSV = () => {
    if (!damagePatternsData) return;

    const csvContent = [
      'Damage Pattern Analysis',
      '',
      'Damage Types:',
      'Type,Value,Percentage',
      ...damagePatternsData.damagePercentages.map(item =>
        `${item.type},${item.value},${item.percentage}%`
      ),
      '',
      'District Damage:',
      'District,Houses,Schools,Infrastructure,Livestock,Total',
      ...damagePatternsData.districtDamage.map(item =>
        `${item.district},${item.houses},${item.schools},${item.infrastructure},${item.livestock},${item.totalDamage}`
      ),
      '',
      'Damage Intensity (Damage per Casualty):',
      'District,Casualties,Damage,Intensity',
      ...damagePatternsData.damageIntensity.map(item =>
        `${item.district},${item.casualties},${item.damage},${item.intensity.toFixed(2)}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'damage_pattern_analysis.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!damagePatternsData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Damage Pattern Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <PieChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Damage Data</h3>
            <p>Damage pattern analysis will appear here when data is available.</p>
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
            <Target className="h-5 w-5" />
            Damage Pattern Analysis
            <Badge variant="outline" className="ml-2">
              {damagePatternsData.totalDamage.toLocaleString()} total
            </Badge>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-1" />
            CSV
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Analyze damage distribution patterns and identify vulnerability trends
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Damage Type Distribution */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Damage Distribution by Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={damagePatternsData.damagePercentages}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percentage }) => `${type}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {damagePatternsData.damagePercentages.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={DAMAGE_COLORS[index % DAMAGE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Count']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Damage Breakdown</h4>
                {damagePatternsData.damagePercentages.map((item, index) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: DAMAGE_COLORS[index % DAMAGE_COLORS.length] }}
                      />
                      <span className="text-sm font-medium">{item.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.value.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* District Damage Distribution */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Damage Distribution by District</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={damagePatternsData.districtDamage} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="district"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  labelFormatter={(label) => `District: ${label}`}
                />
                <Bar dataKey="houses" stackId="a" fill="#2563eb" name="Houses" />
                <Bar dataKey="schools" stackId="a" fill="#7c3aed" name="Schools" />
                <Bar dataKey="infrastructure" stackId="a" fill="#ea580c" name="Infrastructure" />
                <Bar dataKey="livestock" stackId="a" fill="#16a34a" name="Livestock" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Damage Intensity Analysis */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Damage Intensity Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-semibold mb-3">Damage per Casualty (Top Districts)</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={damagePatternsData.damageIntensity} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="district"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      fontSize={11}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [typeof value === 'number' ? value.toFixed(2) : value, name]}
                      labelFormatter={(label) => `District: ${label}`}
                    />
                    <Bar dataKey="intensity" fill="#dc2626" name="Damage per Casualty" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="text-md font-semibold mb-3">Casualty vs Damage Scatter</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <ScatterChart data={damagePatternsData.damageIntensity} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="casualties" name="Casualties" />
                    <YAxis dataKey="damage" name="Damage" />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      formatter={(value, name) => [value, name]}
                      labelFormatter={(label) => `District: ${label}`}
                    />
                    <Scatter dataKey="damage" fill="#2563eb" name="Damage" />
                    <ReferenceLine y={damagePatternsData.damageIntensity.reduce((sum, item) => sum + item.damage, 0) / damagePatternsData.damageIntensity.length} stroke="#dc2626" strokeDasharray="5 5" />
                  </ScatterChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground mt-2">
                  Red line shows average damage level
                </p>
              </div>
            </div>
          </div>

          {/* Pattern Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-900">Housing Focus</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {damagePatternsData.damagePercentages.find(d => d.type === 'Houses')?.percentage || 0}%
              </div>
              <div className="text-sm text-blue-700">of total damage</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-900">Livestock Impact</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {damagePatternsData.damagePercentages.find(d => d.type === 'Livestock')?.percentage || 0}%
              </div>
              <div className="text-sm text-green-700">of total damage</div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-purple-900">Concentration</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {damagePatternsData.districtDamage.length > 0 ?
                  (damagePatternsData.districtDamage[0].totalDamage / damagePatternsData.totalDamage * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-purple-700">in top district</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}