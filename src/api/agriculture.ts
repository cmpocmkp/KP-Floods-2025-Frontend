export interface AgricultureImpact {
  _id: string;
  report_date: string;
  division: {
    _id: string;
    name: string;
  };
  district: {
    _id: string;
    name: string;
  };
  department: string;
  structural_damages_no: number;
  crop_mask_acre: number;
  damaged_area_gis_acre: number;
  onground_verified_acre: number;
  estimated_losses_million_pkr: number;
}

export interface ProcessedAgricultureData {
  divisionBreakdown: Array<{
    division: string;
    total_estimated_losses_million_pkr: number;
  }>;
  districtBreakdown: Array<{
    district: string;
    division: string;
    crop_mask_acre: number;
    damaged_area_gis_acre: number;
    onground_verified_acre: number;
    structural_damages_no: number;
    estimated_losses_million_pkr: number;
  }>;
  impactSeverity: {
    highImpact: number;
    mediumImpact: number;
    lowImpact: number;
    noImpact: number;
  };
  summary: {
    totalStructuralDamages: number;
    totalCropMaskAcre: number;
    totalDamagedAreaGIS: number;
    totalOngroundVerified: number;
    totalEstimatedLossesMillionPKR: number;
    affectedDistricts: number;
  };
}

export async function getAgricultureImpacts(): Promise<ProcessedAgricultureData> {
  const response = await fetch('https://kp-floods-2025-mongo-backend-production.up.railway.app/floods/agriculture-impacts');
  if (!response.ok) {
    throw new Error(`Failed to fetch agriculture impacts: ${response.status} ${response.statusText}`);
  }
  const rawData: AgricultureImpact[] = await response.json();

  // Process the raw data into the required format
  const divisionMap = new Map<string, number>();
  const districtData: ProcessedAgricultureData['districtBreakdown'] = [];
  let totalStructuralDamages = 0;
  let totalCropMaskAcre = 0;
  let totalDamagedAreaGIS = 0;
  let totalOngroundVerified = 0;
  let totalEstimatedLosses = 0;
  let affectedDistricts = 0;

  rawData.forEach(record => {
    // Update division totals
    const divisionName = record.division.name;
    const currentDivisionTotal = divisionMap.get(divisionName) || 0;
    divisionMap.set(divisionName, currentDivisionTotal + record.estimated_losses_million_pkr);

    // Add to district breakdown
    if (record.estimated_losses_million_pkr > 0 || record.damaged_area_gis_acre > 0) {
      districtData.push({
        district: record.district.name,
        division: record.division.name,
        crop_mask_acre: record.crop_mask_acre,
        damaged_area_gis_acre: record.damaged_area_gis_acre,
        onground_verified_acre: record.onground_verified_acre,
        structural_damages_no: record.structural_damages_no,
        estimated_losses_million_pkr: record.estimated_losses_million_pkr
      });
      affectedDistricts++;
    }

    // Update totals
    totalStructuralDamages += record.structural_damages_no;
    totalCropMaskAcre += record.crop_mask_acre;
    totalDamagedAreaGIS += record.damaged_area_gis_acre;
    totalOngroundVerified += record.onground_verified_acre;
    totalEstimatedLosses += record.estimated_losses_million_pkr;
  });

  // Calculate impact severity
  const highImpact = districtData.filter(d => d.estimated_losses_million_pkr > 100).length;
  const mediumImpact = districtData.filter(d => d.estimated_losses_million_pkr >= 10 && d.estimated_losses_million_pkr <= 100).length;
  const lowImpact = districtData.filter(d => d.estimated_losses_million_pkr > 0 && d.estimated_losses_million_pkr < 10).length;
  const noImpact = rawData.length - (highImpact + mediumImpact + lowImpact);

  return {
    divisionBreakdown: Array.from(divisionMap.entries()).map(([division, total]) => ({
      division,
      total_estimated_losses_million_pkr: total
    })),
    districtBreakdown: districtData,
    impactSeverity: {
      highImpact,
      mediumImpact,
      lowImpact,
      noImpact
    },
    summary: {
      totalStructuralDamages,
      totalCropMaskAcre,
      totalDamagedAreaGIS,
      totalOngroundVerified,
      totalEstimatedLossesMillionPKR: totalEstimatedLosses,
      affectedDistricts
    }
  };
}