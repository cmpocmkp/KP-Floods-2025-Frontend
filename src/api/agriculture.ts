export interface AgricultureImpactRecord {
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
  notes: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface AgricultureSummary {
  totalStructuralDamages: number;
  totalCropMaskAcre: number;
  totalDamagedAreaGisAcre: number;
  totalOngroundVerifiedAcre: number;
  totalEstimatedLossesMillionPKR: number;
  affectedDistricts: number;
  affectedDivisions: number;
  districtsWithImpacts: Array<{
    district: string;
    division: string;
    structural_damages_no: number;
    crop_mask_acre: number;
    damaged_area_gis_acre: number;
    onground_verified_acre: number;
    estimated_losses_million_pkr: number;
  }>;
  topImpactedDistricts: Array<{
    district: string;
    division: string;
    total_loss: number;
    structural_damages: number;
    area_affected: number;
  }>;
  divisionWiseImpact: Array<{
    division: string;
    districts_count: number;
    total_structural_damages: number;
    total_crop_mask_acre: number;
    total_damaged_area_gis_acre: number;
    total_onground_verified_acre: number;
    total_estimated_losses_million_pkr: number;
  }>;
  impactSeverityData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  lossDistributionData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export const getAgricultureImpacts = async (): Promise<AgricultureImpactRecord[]> => {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const url = `${baseUrl}/floods/agriculture-impacts`;

  const response = await fetch(url, {
    headers: {
      'Accept': '*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch agriculture impacts: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

export const getAgricultureSummary = async (): Promise<AgricultureSummary> => {
  const data = await getAgricultureImpacts();

  // Calculate basic totals
  const summary: AgricultureSummary = {
    totalStructuralDamages: data.reduce((sum, record) => sum + record.structural_damages_no, 0),
    totalCropMaskAcre: data.reduce((sum, record) => sum + record.crop_mask_acre, 0),
    totalDamagedAreaGisAcre: data.reduce((sum, record) => sum + record.damaged_area_gis_acre, 0),
    totalOngroundVerifiedAcre: data.reduce((sum, record) => sum + record.onground_verified_acre, 0),
    totalEstimatedLossesMillionPKR: data.reduce((sum, record) => sum + record.estimated_losses_million_pkr, 0),
    affectedDistricts: new Set(data.filter(record => record.structural_damages_no > 0 || record.crop_mask_acre > 0).map(record => record.district.name)).size,
    affectedDivisions: new Set(data.filter(record => record.structural_damages_no > 0 || record.crop_mask_acre > 0).map(record => record.division.name)).size,
    districtsWithImpacts: data
      .filter(record => record.structural_damages_no > 0 || record.crop_mask_acre > 0)
      .map(record => ({
        district: record.district.name,
        division: record.division.name,
        structural_damages_no: record.structural_damages_no,
        crop_mask_acre: record.crop_mask_acre,
        damaged_area_gis_acre: record.damaged_area_gis_acre,
        onground_verified_acre: record.onground_verified_acre,
        estimated_losses_million_pkr: record.estimated_losses_million_pkr,
      }))
      .sort((a, b) => b.estimated_losses_million_pkr - a.estimated_losses_million_pkr),

    topImpactedDistricts: data
      .filter(record => record.estimated_losses_million_pkr > 0)
      .map(record => ({
        district: record.district.name,
        division: record.division.name,
        total_loss: record.estimated_losses_million_pkr,
        structural_damages: record.structural_damages_no,
        area_affected: record.damaged_area_gis_acre
      }))
      .sort((a, b) => b.total_loss - a.total_loss)
      .slice(0, 10),

    divisionWiseImpact: Array.from(
      data.reduce((acc, record) => {
        const divisionName = record.division.name;
        if (!acc.has(divisionName)) {
          acc.set(divisionName, {
            division: divisionName,
            districts_count: 0,
            total_structural_damages: 0,
            total_crop_mask_acre: 0,
            total_damaged_area_gis_acre: 0,
            total_onground_verified_acre: 0,
            total_estimated_losses_million_pkr: 0
          });
        }

        const divisionData = acc.get(divisionName)!;
        if (record.structural_damages_no > 0 || record.crop_mask_acre > 0) {
          divisionData.districts_count += 1;
        }
        divisionData.total_structural_damages += record.structural_damages_no;
        divisionData.total_crop_mask_acre += record.crop_mask_acre;
        divisionData.total_damaged_area_gis_acre += record.damaged_area_gis_acre;
        divisionData.total_onground_verified_acre += record.onground_verified_acre;
        divisionData.total_estimated_losses_million_pkr += record.estimated_losses_million_pkr;

        return acc;
      }, new Map<string, any>()).values()
    ).sort((a, b) => b.total_estimated_losses_million_pkr - a.total_estimated_losses_million_pkr),

    impactSeverityData: [
      {
        name: 'High Impact (>100M PKR)',
        value: data.filter(record => record.estimated_losses_million_pkr > 100).length,
        color: '#ef4444'
      },
      {
        name: 'Medium Impact (10-100M PKR)',
        value: data.filter(record => record.estimated_losses_million_pkr >= 10 && record.estimated_losses_million_pkr <= 100).length,
        color: '#f97316'
      },
      {
        name: 'Low Impact (<10M PKR)',
        value: data.filter(record => record.estimated_losses_million_pkr > 0 && record.estimated_losses_million_pkr < 10).length,
        color: '#eab308'
      },
      {
        name: 'No Impact',
        value: data.filter(record => record.estimated_losses_million_pkr === 0).length,
        color: '#22c55e'
      }
    ].filter(item => item.value > 0),

    lossDistributionData: [
      {
        name: 'Structural Damages',
        value: data.reduce((sum, record) => sum + record.structural_damages_no, 0),
        color: '#ef4444'
      },
      {
        name: 'Crop Mask Area',
        value: data.reduce((sum, record) => sum + record.crop_mask_acre, 0),
        color: '#f97316'
      },
      {
        name: 'GIS Damaged Area',
        value: data.reduce((sum, record) => sum + record.damaged_area_gis_acre, 0),
        color: '#eab308'
      },
      {
        name: 'On-ground Verified',
        value: data.reduce((sum, record) => sum + record.onground_verified_acre, 0),
        color: '#22c55e'
      }
    ].filter(item => item.value > 0)
  };

  return summary;
};