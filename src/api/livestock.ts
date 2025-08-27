export interface LivestockLossRecord {
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
  cattles_perished: number;
  big_cattles: number;
  small_cattles: number;
  other: number;
  fodder_roughages_ton: number;
  fodder_concentrates_kg: number;
  shelters_damaged: number;
  notes: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface LivestockSummary {
  totalCattlesPerished: number;
  totalBigCattles: number;
  totalSmallCattles: number;
  totalOther: number;
  totalFodderRoughagesTon: number;
  totalFodderConcentratesKg: number;
  totalSheltersDamaged: number;
  affectedDistricts: number;
  affectedDivisions: number;
  districtsWithLosses: Array<{
    district: string;
    division: string;
    cattles_perished: number;
    big_cattles: number;
    small_cattles: number;
    other: number;
    fodder_roughages_ton: number;
    fodder_concentrates_kg: number;
    shelters_damaged: number;
  }>;
}

export const getLivestockLosses = async (): Promise<LivestockLossRecord[]> => {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const url = `${baseUrl}/floods/livestock-losses`;

  const response = await fetch(url, {
    headers: {
      'Accept': '*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch livestock losses: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

export const getLivestockSummary = async (): Promise<LivestockSummary> => {
  const data = await getLivestockLosses();

  const summary: LivestockSummary = {
    totalCattlesPerished: data.reduce((sum, record) => sum + record.cattles_perished, 0),
    totalBigCattles: data.reduce((sum, record) => sum + record.big_cattles, 0),
    totalSmallCattles: data.reduce((sum, record) => sum + record.small_cattles, 0),
    totalOther: data.reduce((sum, record) => sum + record.other, 0),
    totalFodderRoughagesTon: data.reduce((sum, record) => sum + record.fodder_roughages_ton, 0),
    totalFodderConcentratesKg: data.reduce((sum, record) => sum + record.fodder_concentrates_kg, 0),
    totalSheltersDamaged: data.reduce((sum, record) => sum + record.shelters_damaged, 0),
    affectedDistricts: new Set(data.filter(record => record.cattles_perished > 0).map(record => record.district.name)).size,
    affectedDivisions: new Set(data.filter(record => record.cattles_perished > 0).map(record => record.division.name)).size,
    districtsWithLosses: data
      .filter(record => record.cattles_perished > 0)
      .map(record => ({
        district: record.district.name,
        division: record.division.name,
        cattles_perished: record.cattles_perished,
        big_cattles: record.big_cattles,
        small_cattles: record.small_cattles,
        other: record.other,
        fodder_roughages_ton: record.fodder_roughages_ton,
        fodder_concentrates_kg: record.fodder_concentrates_kg,
        shelters_damaged: record.shelters_damaged,
      }))
      .sort((a, b) => b.cattles_perished - a.cattles_perished)
  };

  return summary;
};