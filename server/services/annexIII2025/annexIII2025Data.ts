import { getInfrastructureDamage } from '../../../../src/api/infrastructure';
import { fetchMonetaryLossData } from '../../../../src/api/monetaryLoss';
import { getCompensationSummary } from '../../../../src/api/compensation';
import { getAgricultureImpacts } from '../../../../src/api/agriculture';
import { getLivestockSummary } from '../../../../src/api/livestock';
import { getCumulativeDashboard } from '../../../../src/lib/overview';

// Helper functions
const toBillion = (n: number): number => +(n / 1e9).toFixed(2);

function computeTotals(rows: Array<{ damageBPKR: number; lossBPKR: number; needsBPKR: number }>) {
  const totals = rows.reduce(
    (acc, row) => ({
      damageBPKR: acc.damageBPKR + row.damageBPKR,
      lossBPKR: acc.lossBPKR + row.lossBPKR,
      needsBPKR: acc.needsBPKR + row.needsBPKR,
    }),
    { damageBPKR: 0, lossBPKR: 0, needsBPKR: 0 }
  );

  return {
    damageBPKR: toBillion(totals.damageBPKR * 1e9),
    lossBPKR: toBillion(totals.lossBPKR * 1e9),
    needsBPKR: toBillion(totals.needsBPKR * 1e9),
  };
}

function makeIntroFromStats(year: number): string {
  return `This report presents a comprehensive assessment of damages, losses, and needs resulting from the devastating floods that affected Khyber Pakhtunkhwa in ${year}. The assessment covers infrastructure damage, property losses, agricultural impacts, and human casualties across affected regions. The data represents the most current information available and provides a foundation for recovery planning and resource allocation.`;
}

// Data fetching functions
async function getRegionDamageLossNeeds(params: { year: number; hazard: string; provinces: string[] }) {
  try {
    // Get cumulative dashboard data for KP totals
    const cumulativeData = await getCumulativeDashboard();
    
    // Get monetary loss data for damage calculations
    const monetaryLossData = await fetchMonetaryLossData();
    
    // Get compensation data for loss calculations
    const compensationData = await getCompensationSummary();
    
    // Calculate KP totals
    const kpDamage = (monetaryLossData.totalLossInBillions || 0) * 1e9; // Convert to PKR
    const kpLoss = (compensationData.totalCompensation || 0);
    const kpNeeds = kpDamage + kpLoss;
    
    return [
      {
        region: 'Khyber Pakhtunkhwa',
        damagePKR: kpDamage,
        lossPKR: kpLoss,
        needsPKR: kpNeeds,
      }
    ];
  } catch (error) {
    console.error('Failed to fetch region damage/loss/needs data:', error);
    // Return default KP row with zeros
    return [
      {
        region: 'Khyber Pakhtunkhwa',
        damagePKR: 0,
        lossPKR: 0,
        needsPKR: 0,
      }
    ];
  }
}

async function getSectorBreakdown(params: { year: number; hazard: string; province: string }) {
  try {
    const [infraData, agriData, livestockData, compensationData] = await Promise.all([
      getInfrastructureDamage(),
      getAgricultureImpacts(),
      getLivestockSummary(),
      getCompensationSummary(),
    ]);

    const sectors = [];

    // Infrastructure sector
    if (infraData?.data) {
      const totalInfraDamage = infraData.data.reduce((sum, district) => 
        sum + (district.HousesFullyDamaged + district.HousesPartiallyDamaged) * 5000000, // Estimate 5M PKR per house
        0
      );
      sectors.push({
        name: 'Housing and Infrastructure',
        summary: `Significant damage to residential and commercial structures, roads, bridges, and public facilities. Estimated damage value: ${toBillion(totalInfraDamage)} billion PKR.`,
        damageValue: toBillion(totalInfraDamage),
      });
    }

    // Agriculture sector
    if (agriData) {
      const agriLoss = agriData.totalEstimatedLossesMillionPKR / 1000; // Convert to billions
      sectors.push({
        name: 'Agriculture and Livestock',
        summary: `Extensive crop damage and livestock losses affecting food security and rural livelihoods. Estimated losses: ${agriLoss.toFixed(2)} billion PKR.`,
        damageValue: agriLoss,
      });
    }

    // Human impact sector
    if (compensationData) {
      const humanImpact = (compensationData.totalCompensation || 0) / 1e9; // Convert to billions
      sectors.push({
        name: 'Human Impact and Social Services',
        summary: `Casualties, displacement, and disruption of essential services requiring immediate humanitarian response and long-term recovery support.`,
        damageValue: humanImpact,
      });
    }

    return sectors;
  } catch (error) {
    console.error('Failed to fetch sector breakdown:', error);
    return [];
  }
}

async function getVulnerableSegmentsNotes(year: number, province: string) {
  try {
    const [compensationData, agriData] = await Promise.all([
      getCompensationSummary(),
      getAgricultureImpacts(),
    ]);

    const notes = [];

    if (compensationData?.totalDeaths || compensationData?.totalInjured) {
      notes.push(`Human casualties: ${compensationData.totalDeaths || 0} deaths and ${compensationData.totalInjured || 0} injuries reported.`);
    }

    if (compensationData?.totalHousesDamaged) {
      notes.push(`Housing displacement: ${compensationData.totalHousesDamaged} houses damaged, affecting thousands of families.`);
    }

    if (agriData?.affectedDistricts) {
      notes.push(`Agricultural impact: ${agriData.affectedDistricts} districts affected, with significant crop and livestock losses.`);
    }

    return notes;
  } catch (error) {
    console.error('Failed to fetch vulnerable segments notes:', error);
    return ['Assessment of vulnerable segments is ongoing.'];
  }
}

async function getGovtResponseNotes(year: number, province: string) {
  try {
    const compensationData = await getCompensationSummary();
    
    const notes = [];
    
    if (compensationData?.totalCompensation) {
      notes.push(`Compensation disbursed: ${(compensationData.totalCompensation / 1e9).toFixed(2)} billion PKR allocated for immediate relief.`);
    }
    
    notes.push('Emergency response operations ongoing with coordination between federal and provincial authorities.');
    notes.push('Recovery and reconstruction planning in progress with international support mobilization.');
    
    return notes;
  } catch (error) {
    console.error('Failed to fetch government response notes:', error);
    return ['Government response assessment is ongoing.'];
  }
}

async function getMapSpecForReport(year: number, province: string) {
  // Default KP province bounds
  return {
    bounds: [31.0, 69.0, 37.0, 74.0], // [south, west, north, east]
    center: [34.9526, 71.7340], // KP center coordinates
    zoom: 8,
    markers: [], // Will be populated with incident data if available
  };
}

// Main export function
export async function buildAnnexIII2025Payload() {
  try {
    // 1) Region-level totals (KP-only row required)
    const regionRows = await getRegionDamageLossNeeds({ 
      year: 2025, 
      hazard: 'flood', 
      provinces: ['Khyber Pakhtunkhwa'] 
    });

    // 2) Sector group summaries
    const sectors = await getSectorBreakdown({ 
      year: 2025, 
      hazard: 'flood', 
      province: 'Khyber Pakhtunkhwa' 
    });

    // 3) Narrative bits
    const vulnerable = await getVulnerableSegmentsNotes(2025, 'Khyber Pakhtunkhwa');
    const responseNotes = await getGovtResponseNotes(2025, 'Khyber Pakhtunkhwa');

    // 4) Map snapshot input
    const mapSpec = await getMapSpecForReport(2025, 'Khyber Pakhtunkhwa');

    // 5) Calculate totals
    const totals = computeTotals(regionRows.map(r => ({
      damageBPKR: toBillion(r.damagePKR),
      lossBPKR: toBillion(r.lossPKR),
      needsBPKR: toBillion(r.needsPKR),
    })));

    return {
              title: "KP D3 IMPACT ASSESSMENT — Annex III",
      generatedOn: new Date().toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      introText: makeIntroFromStats(2025),
      mapSpec,
      tableRegionRows: regionRows.map(r => ({
        region: r.region,
        damageBPKR: toBillion(r.damagePKR),
        lossBPKR: toBillion(r.lossPKR),
        needsBPKR: toBillion(r.needsPKR),
      })),
      totals,
      notes: [
        "Damages: direct physical destruction of assets and infrastructure",
        "Losses: changes in economic flows due to the disaster",
        "Needs: financing required for recovery and reconstruction"
      ],
      sectors,
      vulnerable,
      responseNotes,
    };
  } catch (error) {
    console.error('Failed to build Annex III 2025 payload:', error);
    throw new Error(`Failed to build Annex III 2025 payload: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Export types for use in other modules
export interface AnnexIII2025Data {
  title: string;
  generatedOn: string;
  introText: string;
  mapSpec: {
    bounds: [number, number, number, number];
    center: [number, number];
    zoom: number;
    markers: Array<{ lat: number; lng: number; severity: string }>;
  };
  tableRegionRows: Array<{
    region: string;
    damageBPKR: number;
    lossBPKR: number;
    needsBPKR: number;
  }>;
  totals: {
    damageBPKR: number;
    lossBPKR: number;
    needsBPKR: number;
  };
  notes: string[];
  sectors: Array<{
    name: string;
    summary: string;
    damageValue: number;
  }>;
  vulnerable: string[];
  responseNotes: string[];
} 