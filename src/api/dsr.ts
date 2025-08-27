export interface DistrictSummary {
  DistrictName: string;
  Causes: string;
  NatureOfIncident: string;
  MaleDeaths: number;
  FemaleDeaths: number;
  ChildDeaths: number;
  TotalDeaths: number;
  MaleInjured: number;
  FemaleInjured: number;
  ChildInjured: number;
  TotalInjured: number;
  HouseDamagedFully: number;
  HouseDamagedPartially: number;
  TotalHousesDamaged: number;
  SchoolDamagedFully: number;
  SchoolDamagedPartially: number;
  TotalSchoolDamaged: number;
  OtherDamagedFully: number;
  OtherDamagedPartially: number;
  TotalOtherDamaged: number;
  CattlePerished: number;
  _id: string;
}

export interface IncidentDetail {
  DistrictName: string;
  IncidentDescription: string;
  IncidentSource: string;
  IncidentResponsible?: string;
  _id: string;
}

export interface RoadSituation {
  DistrictName: string;
  SituationDescription: string;
  SituationResponsible?: string;
  SituationSource?: string;
  _id: string;
}

export interface DailyDSRData {
  dsr_date: string;
  district_summaries: DistrictSummary[];
  incident_details: IncidentDetail[];
  road_situations: RoadSituation[];
  last_updated: string;
}

export interface DailyDSRResponse {
  success: boolean;
  message: string;
  date: string;
  data: DailyDSRData;
  summary: {
    total_district_summaries: number;
    total_incident_details: number;
    total_road_situations: number;
    total_deaths: number;
    total_injured: number;
    total_houses_damaged: number;
  };
  source: string;
}

export interface SeverityWeights {
  death: number;
  inj: number;
  full: number;
  part: number;
  school: number;
  other: number;
  cattle: number;
}

export interface SeverityRecord {
  district: string;
  deaths: number;
  injured: number;
  housesFull: number;
  housesPartial: number;
  schools: number;
  other: number;
  cattle: number;
  severity: number;
}

export interface DSRAggregates {
  totals: {
    deaths: number;
    injured: number;
    housesFull: number;
    housesPartial: number;
    housesTotal: number;
    schoolsTotal: number;
    othersTotal: number;
    districtsReporting: number;
    incidents: number;
    roadsBlocked: number;
  };
  rankings: {
    topDeaths: Array<{ district: string; deaths: number; injured: number; }>;
    topHouses: Array<{ district: string; housesFull: number; housesPartial: number; total: number; }>;
  };
  severityRecords: SeverityRecord[];
  causeCounts: Record<string, number>;
  natureCounts: Record<string, number>;
  roads: RoadSituation[];
  narratives: Record<string, {
    incidents: IncidentDetail[];
    count: number;
    combinedNarrative: string;
    sources: string[];
  }>;
}

export const getDailyDSR = async (date: string): Promise<DailyDSRResponse> => {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const url = `${baseUrl}/floods/daily-dsr/${date}`;

  const response = await fetch(url, {
    headers: {
      'Accept': '*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch DSR data: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

export const getPreviousDayDSR = async (date: string): Promise<DailyDSRResponse | null> => {
  try {
    const currentDate = new Date(date);
    const previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - 1);
    const prevDateStr = previousDate.toISOString().split('T')[0];
    return await getDailyDSR(prevDateStr);
  } catch (error) {
    // If previous day data is not available, return null
    return null;
  }
};

export const computeDSRAggregates = (dsr: DailyDSRResponse, weights: SeverityWeights = {
  death: 1.0,
  inj: 0.25,
  full: 0.6,
  part: 0.25,
  school: 0.5,
  other: 0.1,
  cattle: 0.05
}): DSRAggregates => {
  const { district_summaries, incident_details, road_situations } = dsr.data;

  // Compute totals
  const totals = {
    deaths: district_summaries.reduce((sum, d) => sum + d.TotalDeaths, 0),
    injured: district_summaries.reduce((sum, d) => sum + d.TotalInjured, 0),
    housesFull: district_summaries.reduce((sum, d) => sum + d.HouseDamagedFully, 0),
    housesPartial: district_summaries.reduce((sum, d) => sum + d.HouseDamagedPartially, 0),
    housesTotal: district_summaries.reduce((sum, d) => sum + d.TotalHousesDamaged, 0),
    schoolsTotal: district_summaries.reduce((sum, d) => sum + d.TotalSchoolDamaged, 0),
    othersTotal: district_summaries.reduce((sum, d) => sum + d.TotalOtherDamaged, 0),
    districtsReporting: district_summaries.length,
    incidents: dsr.summary.total_incident_details,
    roadsBlocked: dsr.summary.total_road_situations
  };

  // Compute rankings
  const rankings = {
    topDeaths: district_summaries
      .filter(d => d.TotalDeaths > 0)
      .map(d => ({
        district: d.DistrictName,
        deaths: d.TotalDeaths,
        injured: d.TotalInjured
      }))
      .sort((a, b) => b.deaths - a.deaths)
      .slice(0, 5),

    topHouses: district_summaries
      .filter(d => d.TotalHousesDamaged > 0)
      .map(d => ({
        district: d.DistrictName,
        housesFull: d.HouseDamagedFully,
        housesPartial: d.HouseDamagedPartially,
        total: d.TotalHousesDamaged
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
  };

  // Compute severity records
  const severityRecords: SeverityRecord[] = district_summaries.map(d => ({
    district: d.DistrictName,
    deaths: d.TotalDeaths,
    injured: d.TotalInjured,
    housesFull: d.HouseDamagedFully,
    housesPartial: d.HouseDamagedPartially,
    schools: d.TotalSchoolDamaged,
    other: d.TotalOtherDamaged,
    cattle: d.CattlePerished,
    severity: d.TotalDeaths * weights.death +
              d.TotalInjured * weights.inj +
              d.HouseDamagedFully * weights.full +
              d.HouseDamagedPartially * weights.part +
              d.TotalSchoolDamaged * weights.school +
              d.TotalOtherDamaged * weights.other +
              d.CattlePerished * weights.cattle
  })).sort((a, b) => b.severity - a.severity);

  // Compute cause and nature counts
  const causeCounts: Record<string, number> = {};
  const natureCounts: Record<string, number> = {};

  district_summaries.forEach(d => {
    // Split causes by common separators and count (only if not null)
    if (d.Causes) {
      const causes = d.Causes.split(/[\/,&]/).map(c => c.trim()).filter(c => c);
      causes.forEach(cause => {
        causeCounts[cause] = (causeCounts[cause] || 0) + 1;
      });
    }

    // Split nature by common separators and count (only if not null)
    if (d.NatureOfIncident) {
      const natures = d.NatureOfIncident.split(/[\/,&]/).map(n => n.trim()).filter(n => n);
      natures.forEach(nature => {
        natureCounts[nature] = (natureCounts[nature] || 0) + 1;
      });
    }
  });

  // Group narratives by district
  const narratives: Record<string, {
    incidents: IncidentDetail[];
    count: number;
    combinedNarrative: string;
    sources: string[];
  }> = {};

  incident_details.forEach(incident => {
    if (!narratives[incident.DistrictName]) {
      narratives[incident.DistrictName] = {
        incidents: [],
        count: 0,
        combinedNarrative: '',
        sources: []
      };
    }

    narratives[incident.DistrictName].incidents.push(incident);
    narratives[incident.DistrictName].count++;

    // Only add to combined narrative if IncidentDescription exists
    if (incident.IncidentDescription) {
      narratives[incident.DistrictName].combinedNarrative += (narratives[incident.DistrictName].combinedNarrative ? '\n\n' : '') + incident.IncidentDescription;
    }

    // Only add to sources if IncidentSource exists and is not already included
    if (incident.IncidentSource && !narratives[incident.DistrictName].sources.includes(incident.IncidentSource)) {
      narratives[incident.DistrictName].sources.push(incident.IncidentSource);
    }
  });

  return {
    totals,
    rankings,
    severityRecords,
    causeCounts,
    natureCounts,
    roads: road_situations,
    narratives
  };
};

