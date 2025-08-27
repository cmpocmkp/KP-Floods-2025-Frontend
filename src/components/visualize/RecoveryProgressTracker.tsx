import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, Download, TrendingUp, CheckCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Bar
} from 'recharts';

interface RecoveryProgressTrackerProps {
  aggregates: any;
}

export function RecoveryProgressTracker({ aggregates }: RecoveryProgressTrackerProps) {
  // Calculate recovery progress metrics
  const recoveryData = useMemo(() => {
    if (!aggregates?.severityRecords) return null;

    // Simulate recovery progress over time (in real implementation, this would come from recovery data)
    const totalDays = 14;
    const recoveryMetrics = Array.from({ length: totalDays }, (_, index) => {
      const progressRatio = Math.min(1, index / (totalDays * 0.7)); // 70% recovery by end
      const day = index + 1;

      return {
        day: `Day ${day}`,
        assessmentProgress: Math.min(100, progressRatio * 120), // Assessment completes first
        reliefDistribution: Math.min(100, progressRatio * 100), // Relief distribution
        medicalAid: Math.min(100, progressRatio * 110), // Medical aid
        infrastructureRepair: Math.min(100, progressRatio * 60), // Infrastructure takes longer
        overallRecovery: Math.min(100, (progressRatio * 95) + Math.random() * 10),
        affectedPopulation: aggregates.totals.incidents || 1000,
        servedPopulation: Math.floor((aggregates.totals.incidents || 1000) * progressRatio * 0.8)
      };
    });

    // Calculate district-wise recovery status
    const districtRecovery = aggregates.severityRecords
      .filter(record => record.district && record.district !== 'Unknown District')
      .slice(0, 10)
      .map(record => {
        const baseSeverity = record.severity || 0;
        const recoveryProgress = Math.max(20, 100 - (baseSeverity / 10)); // Higher severity = slower recovery

        return {
          district: record.district,
          severity: baseSeverity,
          recoveryProgress: Math.min(100, recoveryProgress + Math.random() * 20),
          daysToFullRecovery: Math.max(7, Math.ceil((100 - recoveryProgress) / 5)),
          status: recoveryProgress > 80 ? 'Full Recovery' :
                  recoveryProgress > 60 ? 'Major Progress' :
                  recoveryProgress > 40 ? 'Moderate Progress' :
                  recoveryProgress > 20 ? 'Early Recovery' : 'Critical'
        };
      })
      .sort((a, b) => b.recoveryProgress - a.recoveryProgress);

    // Recovery milestones
    const milestones = [
      { name: 'Initial Assessment', progress: 25, completed: true },
      { name: 'Relief Distribution', progress: 50, completed: recoveryMetrics[recoveryMetrics.length - 1]?.reliefDistribution > 80 },
      { name: 'Medical Aid Complete', progress: 75, completed: recoveryMetrics[recoveryMetrics.length - 1]?.medicalAid > 90 },
      { name: 'Full Recovery', progress: 100, completed: recoveryMetrics[recoveryMetrics.length - 1]?.overallRecovery > 95 }
    ];

    return {
      recoveryMetrics,
      districtRecovery,
      milestones
    };
  }, [aggregates]);

  const handleExportCSV = () => {
    if (!recoveryData) return;

    const csvContent = [
      'Recovery Progress Analysis',
      '',
      'Daily Recovery Metrics:',
      'Day,Assessment Progress,Relief Distribution,Medical Aid,Infrastructure Repair,Overall Recovery,Affected Population,Served Population',
      ...recoveryData.recoveryMetrics.map(item =>
        `${item.day},${item.assessmentProgress.toFixed(1)},${item.reliefDistribution.toFixed(1)},${item.medicalAid.toFixed(1)},${item.infrastructureRepair.toFixed(1)},${item.overallRecovery.toFixed(1)},${item.affectedPopulation},${item.servedPopulation}`
      ),
      '',
      'District Recovery Status:',
      'District,Severity,Recovery Progress,Days to Full Recovery,Status',
      ...recoveryData.districtRecovery.map(item =>
        `${item.district},${item.severity.toFixed(1)},${item.recoveryProgress.toFixed(1)},${item.daysToFullRecovery},${item.status}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'recovery_progress_analysis.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!recoveryData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Recovery Progress Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Recovery Data</h3>
            <p>Recovery progress tracking will appear here when data is available.</p>
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
            <RefreshCw className="h-5 w-5" />
            Recovery Progress Tracker
            <Badge variant="outline" className="ml-2">
              {Math.round(recoveryData.recoveryMetrics[recoveryData.recoveryMetrics.length - 1]?.overallRecovery || 0)}% complete
            </Badge>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-1" />
            CSV
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Monitor disaster recovery progress and identify areas needing additional support
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Recovery Timeline */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recovery Timeline Progress</h3>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={recoveryData.recoveryMetrics} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, '']} />
                <Area
                  type="monotone"
                  dataKey="assessmentProgress"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Assessment"
                />
                <Area
                  type="monotone"
                  dataKey="reliefDistribution"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Relief"
                />
                <Area
                  type="monotone"
                  dataKey="medicalAid"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.6}
                  name="Medical Aid"
                />
                <Line
                  type="monotone"
                  dataKey="overallRecovery"
                  stroke="#dc2626"
                  strokeWidth={3}
                  name="Overall Recovery"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Recovery Milestones */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recovery Milestones</h3>
            <div className="space-y-4">
              {recoveryData.milestones.map((milestone, index) => (
                <div key={milestone.name} className="flex items-center gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    milestone.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {milestone.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium ${milestone.completed ? 'text-green-900' : 'text-gray-900'}`}>
                        {milestone.name}
                      </span>
                      <span className="text-sm text-muted-foreground">{milestone.progress}%</span>
                    </div>
                    <Progress value={milestone.completed ? 100 : milestone.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* District Recovery Status */}
          <div>
            <h3 className="text-lg font-semibold mb-4">District Recovery Status</h3>
            <div className="space-y-3">
              {recoveryData.districtRecovery.slice(0, 8).map((district) => (
                <div key={district.district} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{district.district}</h4>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          district.status === 'Full Recovery' ? 'default' :
                          district.status === 'Major Progress' ? 'secondary' :
                          district.status === 'Moderate Progress' ? 'outline' :
                          'destructive'
                        }
                      >
                        {district.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {district.daysToFullRecovery} days
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Recovery Progress</span>
                      <span className="font-semibold">{district.recoveryProgress.toFixed(1)}%</span>
                    </div>
                    <Progress value={district.recoveryProgress} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Original Severity: {district.severity.toFixed(1)}</span>
                      <span>Estimated completion: {district.daysToFullRecovery} days</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recovery Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-900">Recovery Rate</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {recoveryData.recoveryMetrics.length > 1 ?
                  ((recoveryData.recoveryMetrics[recoveryData.recoveryMetrics.length - 1].overallRecovery -
                    recoveryData.recoveryMetrics[recoveryData.recoveryMetrics.length - 2].overallRecovery) / 1 * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-green-700">daily progress</div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-900">Population Served</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {recoveryData.recoveryMetrics[recoveryData.recoveryMetrics.length - 1]?.servedPopulation.toLocaleString() || 0}
              </div>
              <div className="text-sm text-blue-700">of affected population</div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <span className="font-semibold text-orange-900">Avg Days to Recovery</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {recoveryData.districtRecovery.length > 0 ?
                  Math.round(recoveryData.districtRecovery.reduce((sum, d) => sum + d.daysToFullRecovery, 0) /
                           recoveryData.districtRecovery.length) : 0}
              </div>
              <div className="text-sm text-orange-700">across districts</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}