import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnalyzeFilters } from '@/components/analyze/AnalyzeFilters';
import { KpiRow } from '@/components/analyze/KpiRow';
import { DistrictRankingsTable } from '@/components/analyze/DistrictRankingsTable';
import { CauseNatureChart } from '@/components/analyze/CauseNatureChart';
import { SeverityTable } from '@/components/analyze/SeverityTable';
import { NarrativeDigest } from '@/components/analyze/NarrativeDigest';
import { RoadsBoard } from '@/components/analyze/RoadsBoard';
import { getDailyDSR, computeDSRAggregates, SeverityWeights } from '@/api/dsr';
import { DataCoveragePeriod } from '@/components/shared/DataCoveragePeriod';

export default function AnalyzePage() {
  const [selectedDate, setSelectedDate] = useState('2025-08-15');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [severityWeights, setSeverityWeights] = useState<SeverityWeights>({
    death: 1.0,
    inj: 0.25,
    full: 0.6,
    part: 0.25,
    school: 0.5,
    other: 0.1,
    cattle: 0.05
  });

  // Fetch current day data
  const { data: currentData, isLoading: isLoadingCurrent, error: currentError } = useQuery({
    queryKey: ['dsr', selectedDate],
    queryFn: () => getDailyDSR(selectedDate),
    enabled: !!selectedDate,
  });

  // Compute aggregates
  const aggregates = useMemo(() => {
    if (!currentData) return null;
    return computeDSRAggregates(currentData, severityWeights);
  }, [currentData, severityWeights]);

  // Filter data by selected districts
  const filteredAggregates = useMemo(() => {
    if (!aggregates || selectedDistricts.length === 0) return aggregates;

    return {
      ...aggregates,
      severityRecords: aggregates.severityRecords.filter(record =>
        selectedDistricts.includes(record.district)
      ),
      rankings: {
        topDeaths: aggregates.rankings.topDeaths.filter(item =>
          selectedDistricts.includes(item.district)
        ),
        topHouses: aggregates.rankings.topHouses.filter(item =>
          selectedDistricts.includes(item.district)
        )
      },
      narratives: Object.fromEntries(
        Object.entries(aggregates.narratives).filter(([district]) =>
          selectedDistricts.includes(district)
        )
      )
    };
  }, [aggregates, selectedDistricts]);

  const handleExportCSV = () => {
    if (!aggregates) return;

    const csvContent = [
      ['District', 'Deaths', 'Injured', 'Houses Full', 'Houses Partial', 'Schools', 'Other', 'Cattle', 'Severity'],
      ...aggregates.severityRecords.map(record => [
        record.district,
        record.deaths,
        record.injured,
        record.housesFull,
        record.housesPartial,
        record.schools,
        record.other,
        record.cattle,
        record.severity.toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsr-analysis-${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    // For now, just show an alert. In a real implementation, you'd generate a PDF report
    alert('PDF generation would be implemented here with a proper PDF library');
  };

  if (isLoadingCurrent) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (currentError) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading DSR Data</h2>
          <p className="text-muted-foreground">
            {currentError instanceof Error ? currentError.message : 'Failed to load data'}
          </p>
        </div>
      </div>
    );
  }

  if (!aggregates) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600">No Data Available</h2>
          <p className="text-muted-foreground">Please try selecting a different date.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DataCoveragePeriod />
      {/* Filters */}
      <AnalyzeFilters
        date={selectedDate}
        onDateChange={setSelectedDate}
        selectedDistricts={selectedDistricts}
        onDistrictsChange={setSelectedDistricts}
        aggregates={aggregates}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
      />

      {/* KPI Row */}
      <KpiRow
        aggregates={filteredAggregates || aggregates}
      />

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <DistrictRankingsTable aggregates={filteredAggregates || aggregates} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <CauseNatureChart aggregates={filteredAggregates || aggregates} />
        </div>
      </div>

      {/* Severity Analysis */}
      <SeverityTable
        aggregates={filteredAggregates || aggregates}
        weights={severityWeights}
        onWeightsChange={setSeverityWeights}
      />

      {/* Incident Narratives */}
      <NarrativeDigest
        aggregates={filteredAggregates || aggregates}
        selectedDistricts={selectedDistricts}
      />

      {/* Road Situations */}
      <RoadsBoard
        aggregates={filteredAggregates || aggregates}
        selectedDistricts={selectedDistricts}
      />

      {/* Summary Footer */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Daily Situation Report Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Data for {selectedDate} • {aggregates.totals.districtsReporting} districts reporting
            {selectedDistricts.length > 0 && ` • Filtered to ${selectedDistricts.length} districts`}
          </p>
        </div>
      </div>
    </div>
  );
}