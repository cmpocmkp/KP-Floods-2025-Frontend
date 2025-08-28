import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '@/components/Layout/LoadingSpinner';
import { computeDSRAggregates, SeverityWeights } from '@/api/dsr';
import { DailyTrendsChart } from '@/components/visualize/DailyTrendsChart';
import { DistrictImpactComparison } from '@/components/visualize/DistrictImpactComparison';
import { DamagePatternAnalysis } from '@/components/visualize/DamagePatternAnalysis';
import { IncidentHotspots } from '@/components/visualize/IncidentHotspots';
import { RecoveryProgressTracker } from '@/components/visualize/RecoveryProgressTracker';

// Removed filters - using all available DSR data

interface DSRData {
  dsr_date: string;
  district_summaries: any[];
  incident_details: any[];
  road_situations: any[];
  last_updated: string;
}

interface DSRApiResponse {
  success: boolean;
  message: string;
  data: DSRData[];
  summary: {
    total_reports: number;
    total_deaths: number;
    total_injured: number;
    total_houses_damaged: number;
    total_schools_damaged: number;
    total_other_damaged: number;
    total_cattle_perished: number;
  };
}

export default function VisualizePage() {
  const [severityWeights, setSeverityWeights] = useState<SeverityWeights>({
    death: 1.0,
    inj: 0.25,
    full: 0.6,
    part: 0.25,
    school: 0.5,
    other: 0.1,
    cattle: 0.05
  });

  const [crossFilters, setCrossFilters] = useState<{
    selectedDistricts: string[];
    selectedDivisions: string[];
    selectedCategories: string[];
  }>({
    selectedDistricts: [],
    selectedDivisions: [],
    selectedCategories: []
  });

  // Fetch all DSR data from August 15, 2025 onwards
  const { data: dsrData, isLoading: isLoadingDSR } = useQuery({
    queryKey: ['all-dsr-data'],
    queryFn: async (): Promise<DSRApiResponse> => {
      const response = await fetch('https://kp-floods-2025-mongo-backend-production.up.railway.app/floods/daily-dsr');
      if (!response.ok) {
        throw new Error('Failed to fetch DSR data');
      }
      return response.json();
    },
  });

  // Compute aggregates from all DSR data
  const aggregates = useMemo(() => {
    if (!dsrData?.data || !Array.isArray(dsrData.data)) return null;

    try {
      // Aggregate all district summaries from all DSR reports
      const allDistrictSummaries: any[] = [];
      const allIncidentDetails: any[] = [];
      const allRoadSituations: any[] = [];

      dsrData.data.forEach((dsr: DSRData) => {
        if (dsr.district_summaries && Array.isArray(dsr.district_summaries)) {
          allDistrictSummaries.push(...dsr.district_summaries);
        }
        if (dsr.incident_details && Array.isArray(dsr.incident_details)) {
          allIncidentDetails.push(...dsr.incident_details);
        }
        if (dsr.road_situations && Array.isArray(dsr.road_situations)) {
          allRoadSituations.push(...dsr.road_situations);
        }
      });

      // Create aggregated DSR response for computeDSRAggregates
      const aggregatedDSR = {
        success: true,
        message: "Aggregated DSR data",
        date: new Date().toISOString(),
        source: "DMIS API",
        data: {
          dsr_date: new Date().toISOString(),
          last_updated: new Date().toISOString(),
          district_summaries: allDistrictSummaries,
          incident_details: allIncidentDetails,
          road_situations: allRoadSituations
        },
        summary: {
          total_district_summaries: allDistrictSummaries.length,
          total_incident_details: allIncidentDetails.length,
          total_road_situations: allRoadSituations.length,
          total_deaths: dsrData.summary.total_deaths,
          total_injured: dsrData.summary.total_injured,
          total_houses_damaged: dsrData.summary.total_houses_damaged
        }
      };

      return computeDSRAggregates(aggregatedDSR, severityWeights);
    } catch (error) {
      console.error('Error computing DSR aggregates:', error);
      return null;
    }
  }, [dsrData, severityWeights]);

  // Apply cross-filters
  const filteredAggregates = useMemo(() => {
    if (!aggregates) return aggregates;

    let filtered = { ...aggregates };

    // Filter by districts
    if (crossFilters.selectedDistricts.length > 0) {
      filtered.severityRecords = filtered.severityRecords.filter(record =>
        crossFilters.selectedDistricts.includes(record.district)
      );
      filtered.narratives = Object.fromEntries(
        Object.entries(filtered.narratives).filter(([district]) =>
          crossFilters.selectedDistricts.includes(district)
        )
      );
    }

    // Filter by divisions (would need division data in records)
    // This would require extending the data structure

    return filtered;
  }, [aggregates, crossFilters]);

  const handleCopyDailyBrief = () => {
    // Generate a daily brief based on all available data
    const brief = generateDailyBrief(filteredAggregates || aggregates);
    navigator.clipboard.writeText(brief);
    // You could add a toast notification here
  };

  const generateDailyBrief = (data: any) => {
    if (!data) return "No data available for the selected period.";

    const { totals } = data;

    return `DAILY SITUATION BRIEF - August 15, 2025 to Present

EXECUTIVE SUMMARY:
• ${totals.deaths} deaths reported across ${totals.districtsReporting} districts
• ${totals.injured} injuries documented
• ${totals.housesTotal} houses damaged (${totals.housesFull} fully, ${totals.housesPartial} partially)
• ${totals.schoolsTotal} educational facilities affected
• ${totals.incidents} total incidents reported
• ${totals.roadsBlocked} roads currently blocked

KEY METRICS:
• Province-wide impact across ${totals.districtsReporting} districts
• ${Object.keys(data.narratives).length} districts provided detailed incident reports
• Infrastructure damage spans ${totals.housesTotal} residential structures
• ${totals.roadsBlocked} transportation routes affected

PRIORITY ACTIONS:
• Emergency response teams deployed to ${totals.districtsReporting} districts
• Road clearance operations ongoing for ${totals.roadsBlocked} blocked routes
• Relief coordination for ${totals.housesTotal} affected households
• Medical support for ${totals.injured} injured individuals

Data Source: DMIS API | Generated: ${new Date().toLocaleString()}
---
*This brief is generated from real-time disaster management data and should be validated with field reports.*`;
  };

  const isLoading = isLoadingDSR;

  if (isLoading || !aggregates) {
    return (
      <div className="space-y-6">
        <LoadingSpinner
          size="lg"
          text={isLoading ? "Loading data..." : "Processing data..."}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Daily Trends Analysis */}
      <DailyTrendsChart aggregates={filteredAggregates || aggregates} />

      {/* District Impact Comparison */}
      <DistrictImpactComparison aggregates={filteredAggregates || aggregates} />

      {/* Damage Pattern Analysis */}
      <DamagePatternAnalysis aggregates={filteredAggregates || aggregates} />

      {/* Incident Hotspots */}
      <IncidentHotspots aggregates={filteredAggregates || aggregates} />

      {/* Recovery Progress Tracker */}
      <RecoveryProgressTracker aggregates={filteredAggregates || aggregates} />
    </div>
  );
}