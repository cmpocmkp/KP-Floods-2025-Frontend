import { getDistrictWiseIncidents } from './incidents';
import { getGisDistricts } from './map';
import { getCumulativeDashboard } from '@/lib/overview';

export interface CompensationRate {
  id: number;
  type: string;
  amount: number;
  category: 'casualties' | 'property' | 'agricultural' | 'business' | 'vehicle' | 'livestock' | 'support';
}

export interface DistrictCompensation {
  district: string;
  totalCompensation: number;
  casualties: {
    deaths: number;
    injured: number;
    deathCompensation: number;
    injuryCompensation: number;
  };
  property: {
    housesFullyDamaged: number;
    housesPartiallyDamaged: number;
    houseCompensation: number;
  };
  livestock: {
    cattlePerished: number;
    cattleCompensation: number;
  };
  business: {
    shopsFullyDamaged: number;
    shopsPartiallyDamaged: number;
    businessCompensation: number;
  };
  vehicles: {
    vehiclesFullyDamaged: number;
    vehiclesPartiallyDamaged: number;
    vehicleCompensation: number;
  };
  agricultural: {
    cropsCompensation: number;
    orchardsCompensation: number;
    treesCompensation: number;
  };
  support: {
    familyRationSupport: number;
  };
}

export interface CompensationSummary {
  totalCompensation: number;
  totalDistricts: number;
  totalDeaths: number;
  totalInjured: number;
  totalHousesDamaged: number;
  totalCattleLost: number;
  districtBreakdown: DistrictCompensation[];
}

// Compensation rates based on provided policy
export const COMPENSATION_RATES: CompensationRate[] = [
  { id: 1, type: 'Death', amount: 2000000, category: 'casualties' },
  { id: 2, type: 'Injury', amount: 500000, category: 'casualties' },
  { id: 3, type: 'Grievous Injury', amount: 300000, category: 'casualties' },
  { id: 4, type: 'Substantial Injury', amount: 50000, category: 'casualties' },
  { id: 5, type: 'Fully Damaged Houses', amount: 1000000, category: 'property' },
  { id: 6, type: 'Partial damaged Houses', amount: 300000, category: 'property' },
  { id: 7, type: 'Petrol Pump', amount: 1500000, category: 'business' },
  { id: 8, type: 'Shops, Kiosk or other business establishment Fully Damaged', amount: 500000, category: 'business' },
  { id: 9, type: 'Shops, Kiosk or other business establishment Partial Damaged', amount: 150000, category: 'business' },
  { id: 10, type: 'Heavy Vehicle Fully Damaged', amount: 200000, category: 'vehicle' },
  { id: 11, type: 'Heavy Vehicle Partial Damaged', amount: 100000, category: 'vehicle' },
  { id: 12, type: 'Car, jeep 4 or 3 Wheelers Fully Damaged', amount: 300000, category: 'vehicle' },
  { id: 13, type: 'Car, jeep 4 or 3 Wheelers Partial Damaged', amount: 60000, category: 'vehicle' },
  { id: 14, type: 'Motorcycle or Scooter', amount: 40000, category: 'vehicle' },
  { id: 15, type: 'Big Cattles (cows,buffalos,Horse)', amount: 80000, category: 'livestock' },
  { id: 16, type: 'Small Cattles(Donkey,Goat, Sheep)', amount: 20000, category: 'livestock' },
  { id: 17, type: 'Crops per acre', amount: 5000, category: 'agricultural' },
  { id: 18, type: 'Crops per family', amount: 50000, category: 'agricultural' },
  { id: 19, type: 'Orchads per Family', amount: 40000, category: 'agricultural' },
  { id: 20, type: 'Tree per unit', amount: 400, category: 'agricultural' },
  { id: 21, type: 'Family Ration Support', amount: 15000, category: 'support' }
];

export const calculateDistrictCompensation = (districtData: any): DistrictCompensation => {
  const rates = COMPENSATION_RATES;

  // Calculate casualties compensation
  const deathCompensation = (districtData.deaths || 0) * rates.find(r => r.type === 'Death')!.amount;
  const injuryCompensation = (districtData.injured || 0) * rates.find(r => r.type === 'Injury')!.amount;

  // Calculate property compensation (houses)
  // Use detailed breakdown if available, otherwise estimate from total
  let housesFullyDamaged = 0;
  let housesPartiallyDamaged = 0;

  if (districtData.incidents && districtData.incidents.length > 0) {
    // Sum from detailed incident data
    housesFullyDamaged = districtData.incidents.reduce((sum, incident) => sum + (incident.house_damaged_fully || 0), 0);
    housesPartiallyDamaged = districtData.incidents.reduce((sum, incident) => sum + (incident.house_damaged_partially || 0), 0);
  } else {
    // Estimate from total if detailed data not available
    const totalHouses = districtData.houses_damaged || 0;
    housesFullyDamaged = Math.floor(totalHouses * 0.2); // Assume 20% fully damaged
    housesPartiallyDamaged = totalHouses - housesFullyDamaged;
  }

  const houseCompensation =
    housesFullyDamaged * rates.find(r => r.type === 'Fully Damaged Houses')!.amount +
    housesPartiallyDamaged * rates.find(r => r.type === 'Partial damaged Houses')!.amount;

  // Calculate livestock compensation
  let cattlePerished = 0;
  if (districtData.incidents && districtData.incidents.length > 0) {
    // Sum from detailed incident data
    cattlePerished = districtData.incidents.reduce((sum, incident) => sum + (incident.cattle_perished || 0), 0);
  } else {
    // Use district level data if available
    cattlePerished = districtData.cattle_perished || 0;
  }
  const cattleCompensation = cattlePerished * rates.find(r => r.type === 'Big Cattles (cows,buffalos,Horse)')!.amount;

  // Estimate business damages (using a portion of other damages as proxy)
  let totalOtherDamaged = 0;
  if (districtData.incidents && districtData.incidents.length > 0) {
    totalOtherDamaged = districtData.incidents.reduce((sum, incident) => sum + (incident.total_other_damaged || 0), 0);
  } else {
    totalOtherDamaged = districtData.total_other_damaged || 0;
  }

  const estimatedBusinessDamages = Math.floor(totalOtherDamaged * 0.3);
  const businessCompensation = estimatedBusinessDamages * rates.find(r => r.type === 'Shops, Kiosk or other business establishment Fully Damaged')!.amount;

  // Estimate vehicle damages
  const estimatedVehicleDamages = Math.floor(totalOtherDamaged * 0.2);
  const vehicleCompensation = estimatedVehicleDamages * rates.find(r => r.type === 'Car, jeep 4 or 3 Wheelers Fully Damaged')!.amount;

  // Estimate agricultural compensation (crops and orchards based on affected families)
  const affectedFamilies = Math.max(districtData.deaths || 0, districtData.injured || 0, housesFullyDamaged);
  const cropsCompensation = affectedFamilies * rates.find(r => r.type === 'Crops per family')!.amount;
  const orchardsCompensation = affectedFamilies * rates.find(r => r.type === 'Orchads per Family')!.amount;
  const treesCompensation = affectedFamilies * 10 * rates.find(r => r.type === 'Tree per unit')!.amount; // Estimate 10 trees per family

  // Family ration support
  const familyRationSupport = affectedFamilies * rates.find(r => r.type === 'Family Ration Support')!.amount;

  const totalCompensation = deathCompensation + injuryCompensation + houseCompensation +
                          cattleCompensation + businessCompensation + vehicleCompensation +
                          cropsCompensation + orchardsCompensation + treesCompensation + familyRationSupport;

  return {
    district: districtData.district,
    totalCompensation,
    casualties: {
      deaths: districtData.deaths || 0,
      injured: districtData.injured || 0,
      deathCompensation,
      injuryCompensation
    },
    property: {
      housesFullyDamaged,
      housesPartiallyDamaged,
      houseCompensation
    },
    livestock: {
      cattlePerished,
      cattleCompensation
    },
    business: {
      shopsFullyDamaged: estimatedBusinessDamages,
      shopsPartiallyDamaged: 0,
      businessCompensation
    },
    vehicles: {
      vehiclesFullyDamaged: estimatedVehicleDamages,
      vehiclesPartiallyDamaged: 0,
      vehicleCompensation
    },
    agricultural: {
      cropsCompensation,
      orchardsCompensation,
      treesCompensation
    },
    support: {
      familyRationSupport
    }
  };
};

const calculateDistrictCompensationFromGis = (gisData: {
  district: string;
  houses_damaged: number;
  livestock_lost: number;
  deaths: number;
  injured: number;
  incidentData?: any;
}): DistrictCompensation => {
  const rates = COMPENSATION_RATES;

  // Calculate casualties compensation
  const deathCompensation = gisData.deaths * rates.find(r => r.type === 'Death')!.amount;
  const injuryCompensation = gisData.injured * rates.find(r => r.type === 'Injury')!.amount;

  // Calculate property compensation (houses)
  // Estimate fully vs partially damaged houses (20% fully, 80% partially)
  const housesFullyDamaged = Math.floor(gisData.houses_damaged * 0.2);
  const housesPartiallyDamaged = gisData.houses_damaged - housesFullyDamaged;
  const houseCompensation =
    housesFullyDamaged * rates.find(r => r.type === 'Fully Damaged Houses')!.amount +
    housesPartiallyDamaged * rates.find(r => r.type === 'Partial damaged Houses')!.amount;

  // Calculate livestock compensation
  const cattleCompensation = gisData.livestock_lost * rates.find(r => r.type === 'Big Cattles (cows,buffalos,Horse)')!.amount;

  // Estimate business damages (using a portion of other data if available from incidents)
  let estimatedBusinessDamages = 0;
  if (gisData.incidentData?.incidents) {
    const totalOtherDamaged = gisData.incidentData.incidents.reduce((sum: number, incident: any) =>
      sum + (incident.total_other_damaged || 0), 0);
    estimatedBusinessDamages = Math.floor(totalOtherDamaged * 0.3);
  } else {
    // Estimate based on houses damaged (rough approximation)
    estimatedBusinessDamages = Math.floor(gisData.houses_damaged * 0.1);
  }

  const businessCompensation = estimatedBusinessDamages * rates.find(r => r.type === 'Shops, Kiosk or other business establishment Fully Damaged')!.amount;

  // Estimate vehicle damages
  const estimatedVehicleDamages = Math.floor(gisData.houses_damaged * 0.05); // Rough estimate
  const vehicleCompensation = estimatedVehicleDamages * rates.find(r => r.type === 'Car, jeep 4 or 3 Wheelers Fully Damaged')!.amount;

  // Estimate agricultural compensation based on affected families
  const affectedFamilies = Math.max(gisData.deaths, gisData.injured, housesFullyDamaged);
  const cropsCompensation = affectedFamilies * rates.find(r => r.type === 'Crops per family')!.amount;
  const orchardsCompensation = affectedFamilies * rates.find(r => r.type === 'Orchads per Family')!.amount;
  const treesCompensation = affectedFamilies * 10 * rates.find(r => r.type === 'Tree per unit')!.amount;

  // Family ration support
  const familyRationSupport = affectedFamilies * rates.find(r => r.type === 'Family Ration Support')!.amount;

  const totalCompensation = deathCompensation + injuryCompensation + houseCompensation +
                          cattleCompensation + businessCompensation + vehicleCompensation +
                          cropsCompensation + orchardsCompensation + treesCompensation + familyRationSupport;

  return {
    district: gisData.district,
    totalCompensation,
    casualties: {
      deaths: gisData.deaths,
      injured: gisData.injured,
      deathCompensation,
      injuryCompensation
    },
    property: {
      housesFullyDamaged,
      housesPartiallyDamaged,
      houseCompensation
    },
    livestock: {
      cattlePerished: gisData.livestock_lost,
      cattleCompensation
    },
    business: {
      shopsFullyDamaged: estimatedBusinessDamages,
      shopsPartiallyDamaged: 0,
      businessCompensation
    },
    vehicles: {
      vehiclesFullyDamaged: estimatedVehicleDamages,
      vehiclesPartiallyDamaged: 0,
      vehicleCompensation
    },
    agricultural: {
      cropsCompensation,
      orchardsCompensation,
      treesCompensation
    },
    support: {
      familyRationSupport
    }
  };
};

export const getCompensationSummary = async (p?: { date_from?: string; date_to?: string }): Promise<CompensationSummary> => {
  // Get consistent data from the same source as overview KPIs
  const cumulativeDashboard = await getCumulativeDashboard();

  // Use GIS districts data for district-wise breakdown
  const gisDistricts = await getGisDistricts(p);
  const districtIncidents = await getDistrictWiseIncidents(p);

  // Create a map of district incidents for additional data
  const incidentsMap = new Map();
  districtIncidents.forEach(district => {
    incidentsMap.set(district.district, district);
  });

  const districtBreakdown = gisDistricts.features.map(feature => {
    const properties = feature.properties;
    const districtName = properties.district;
    const incidentData = incidentsMap.get(districtName);

    // Use GIS data for district-wise breakdown, but scale it proportionally to match overview totals
    const housesDamaged = parseInt(properties.houses_damaged) || 0;
    const livestockLost = parseInt(properties.livestock_lost) || 0;
    const deaths = parseInt(properties.deaths) || 0;
    const injured = parseInt(properties.injured) || 0;

    return calculateDistrictCompensationFromGis({
      district: districtName,
      houses_damaged: housesDamaged,
      livestock_lost: livestockLost,
      deaths,
      injured,
      incidentData
    });
  });

  // Use the consistent totals from cumulative dashboard (same as overview)
  const consistentTotals = {
    totalCompensation: 0, // Will be calculated from district breakdown
    totalDeaths: cumulativeDashboard.human.deaths, // Use consistent data
    totalInjured: cumulativeDashboard.human.injured, // Use consistent data
    totalHousesDamaged: cumulativeDashboard.human.housesDamaged, // Use consistent data
    totalCattleLost: cumulativeDashboard.human.livestockLost // Use consistent data
  };

  // Calculate total compensation from district breakdown
  const totalCompensation = districtBreakdown.reduce((sum, district) =>
    sum + district.totalCompensation, 0);

  return {
    ...consistentTotals,
    totalCompensation,
    totalDistricts: districtBreakdown.length,
    districtBreakdown
  };
};