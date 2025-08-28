export interface AgricultureData {
  id: number | null;
  division: string;
  district: string;
  department: string;
  structuralDamages: number;
  cropMask: number;
  damagedAreaGIS: number;
  ongroundVerified: number;
  estimatedLosses: number;
}

export const AGRICULTURE_DATA: AgricultureData[] = [
  {
    id: 1,
    division: "Peshawar",
    district: "Peshawar",
    department: "Agriculture",
    structuralDamages: 0,
    cropMask: 0,
    damagedAreaGIS: 0,
    ongroundVerified: 0,
    estimatedLosses: 0
  },
  {
    id: 1,
    division: "Peshawar",
    district: "Charsadda",
    department: "Agriculture",
    structuralDamages: 3,
    cropMask: 121462.25,
    damagedAreaGIS: 87,
    ongroundVerified: 497.5,
    estimatedLosses: 8.7
  },
  {
    id: 1,
    division: "Peshawar",
    district: "Nowhsera",
    department: "Agriculture",
    structuralDamages: 1,
    cropMask: 48021.74,
    damagedAreaGIS: 130,
    ongroundVerified: 130,
    estimatedLosses: 13
  },
  {
    id: 1,
    division: "Peshawar",
    district: "Mohmand",
    department: "Agriculture",
    structuralDamages: 0,
    cropMask: 0,
    damagedAreaGIS: 0,
    ongroundVerified: 0,
    estimatedLosses: 0
  },
  {
    id: 2,
    division: "Malakand",
    district: "Swat",
    department: "Agriculture",
    structuralDamages: 137,
    cropMask: 392127.32,
    damagedAreaGIS: 3556.8,
    ongroundVerified: 3737.5,
    estimatedLosses: 355.68
  },
  {
    id: 2,
    division: "Malakand",
    district: "Buner",
    department: "Agriculture",
    structuralDamages: 20,
    cropMask: 126308.39,
    damagedAreaGIS: 23637,
    ongroundVerified: 26141,
    estimatedLosses: 2363.7
  },
  {
    id: 4,
    division: "Hazara",
    district: "Battagram",
    department: "Agriculture",
    structuralDamages: 14,
    cropMask: 52954,
    damagedAreaGIS: 190,
    ongroundVerified: 4.696,
    estimatedLosses: 19
  },
  {
    id: 2,
    division: "Malakand",
    district: "Dir Lower",
    department: "Agriculture",
    structuralDamages: 6,
    cropMask: 82784.52,
    damagedAreaGIS: 5053.62,
    ongroundVerified: 567,
    estimatedLosses: 505.362
  },
  {
    id: 2,
    division: "Malakand",
    district: "Dir Upper",
    department: "Agriculture",
    structuralDamages: 0,
    cropMask: 41127.97,
    damagedAreaGIS: 293,
    ongroundVerified: 0,
    estimatedLosses: 29.3
  },
  {
    id: 2,
    division: "Malakand",
    district: "Shangla",
    department: "Agriculture",
    structuralDamages: 29,
    cropMask: 99400.21,
    damagedAreaGIS: 81.8,
    ongroundVerified: 520,
    estimatedLosses: 8.18
  },
  {
    id: 2,
    division: "Malakand",
    district: "Malakand",
    department: "Agriculture",
    structuralDamages: 1,
    cropMask: 47540.09,
    damagedAreaGIS: 5288,
    ongroundVerified: 11,
    estimatedLosses: 528.8
  },
  {
    id: 2,
    division: "Malakand",
    district: "Bajaur",
    department: "Agriculture",
    structuralDamages: 19,
    cropMask: 34797,
    damagedAreaGIS: 11404,
    ongroundVerified: 214.32,
    estimatedLosses: 1140.4
  },
  {
    id: 2,
    division: "Malakand",
    district: "Chitral Upper",
    department: "Agriculture",
    structuralDamages: 0,
    cropMask: 23866,
    damagedAreaGIS: 55.2,
    ongroundVerified: 55.2,
    estimatedLosses: 5.52
  },
  {
    id: 2,
    division: "Malakand",
    district: "Chitral Lower",
    department: "Agriculture",
    structuralDamages: 0,
    cropMask: 0,
    damagedAreaGIS: 0,
    ongroundVerified: 0,
    estimatedLosses: 0
  },
  {
    id: 3,
    division: "Bannu",
    district: "Bannu",
    department: "Agriculture",
    structuralDamages: 0,
    cropMask: 0,
    damagedAreaGIS: 0,
    ongroundVerified: 0,
    estimatedLosses: 0
  },
  {
    id: 3,
    division: "Bannu",
    district: "North Waziristan",
    department: "Agriculture",
    structuralDamages: 0,
    cropMask: 0,
    damagedAreaGIS: 0,
    ongroundVerified: 0,
    estimatedLosses: 0
  },
  {
    id: 4,
    division: "Hazara",
    district: "Mansehra",
    department: "Agriculture",
    structuralDamages: 41,
    cropMask: 131307.67,
    damagedAreaGIS: 7778.03,
    ongroundVerified: 88.735,
    estimatedLosses: 777.803
  },
  {
    id: 4,
    division: "Hazara",
    district: "Kohistan Lower",
    department: "Agriculture",
    structuralDamages: 0,
    cropMask: 0,
    damagedAreaGIS: 0,
    ongroundVerified: 0,
    estimatedLosses: 0
  },
  {
    id: 4,
    division: "Hazara",
    district: "Haripur",
    department: "Agriculture",
    structuralDamages: 0,
    cropMask: 0,
    damagedAreaGIS: 0,
    ongroundVerified: 0,
    estimatedLosses: 0
  },
  {
    id: 4,
    division: "Hazara",
    district: "Torghar",
    department: "Agriculture",
    structuralDamages: 0,
    cropMask: 4293.28,
    damagedAreaGIS: 335.92,
    ongroundVerified: 0,
    estimatedLosses: 33.592
  },
  {
    id: 4,
    division: "Hazara",
    district: "Abbotabad",
    department: "Agriculture",
    structuralDamages: 0,
    cropMask: 0,
    damagedAreaGIS: 0,
    ongroundVerified: 0,
    estimatedLosses: 0
  },
  {
    id: 5,
    division: "Mardan",
    district: "Mardan",
    department: "Agriculture",
    structuralDamages: 0,
    cropMask: 0,
    damagedAreaGIS: 0,
    ongroundVerified: 0,
    estimatedLosses: 0
  },
  {
    id: 5,
    division: "Mardan",
    district: "Swabi",
    department: "Agriculture",
    structuralDamages: 0,
    cropMask: 84924,
    damagedAreaGIS: 6296,
    ongroundVerified: 1855.5,
    estimatedLosses: 629.6
  },
  {
    id: 6,
    division: "Dera Ismail Khan",
    district: "Dera Ismail Khan",
    department: "Agriculture",
    structuralDamages: 0,
    cropMask: 0,
    damagedAreaGIS: 0,
    ongroundVerified: 0,
    estimatedLosses: 0
  },
  {
    id: 6,
    division: "Dera Ismail Khan",
    district: "South Waziristan",
    department: "Agriculture",
    structuralDamages: 0,
    cropMask: 0,
    damagedAreaGIS: 0,
    ongroundVerified: 0,
    estimatedLosses: 0
  },
  {
    id: 7,
    division: "Kohat",
    district: "Karak",
    department: "Agriculture",
    structuralDamages: 0,
    cropMask: 11702.86,
    damagedAreaGIS: 2.125,
    ongroundVerified: 2.125,
    estimatedLosses: 0.2125
  },
  {
    id: 7,
    division: "Kohat",
    district: "Lakki Marwat",
    department: "Agriculture",
    structuralDamages: 0,
    cropMask: 0,
    damagedAreaGIS: 0,
    ongroundVerified: 0,
    estimatedLosses: 0
  },
  {
    id: 7,
    division: "Kohat",
    district: "Kurram",
    department: "Agriculture",
    structuralDamages: 0,
    cropMask: 0,
    damagedAreaGIS: 0,
    ongroundVerified: 0,
    estimatedLosses: 0
  }
];

export const getAgricultureSummary = () => {
  const totalStructuralDamages = AGRICULTURE_DATA.reduce((sum, item) => sum + item.structuralDamages, 0);
  const totalCropMask = AGRICULTURE_DATA.reduce((sum, item) => sum + item.cropMask, 0);
  const totalDamagedAreaGIS = AGRICULTURE_DATA.reduce((sum, item) => sum + item.damagedAreaGIS, 0);
  const totalOngroundVerified = AGRICULTURE_DATA.reduce((sum, item) => sum + item.ongroundVerified, 0);
  const totalEstimatedLosses = AGRICULTURE_DATA.reduce((sum, item) => sum + item.estimatedLosses, 0);

  return {
    totalStructuralDamages,
    totalCropMask,
    totalDamagedAreaGIS,
    totalOngroundVerified,
    totalEstimatedLosses
  };
};

export const getDivisionSummary = () => {
  const divisionData = AGRICULTURE_DATA.reduce((acc, item) => {
    if (!acc[item.division]) {
      acc[item.division] = {
        division: item.division,
        structuralDamages: 0,
        cropMask: 0,
        damagedAreaGIS: 0,
        ongroundVerified: 0,
        estimatedLosses: 0,
        districts: 0
      };
    }
    
    acc[item.division].structuralDamages += item.structuralDamages;
    acc[item.division].cropMask += item.cropMask;
    acc[item.division].damagedAreaGIS += item.damagedAreaGIS;
    acc[item.division].ongroundVerified += item.ongroundVerified;
    acc[item.division].estimatedLosses += item.estimatedLosses;
    acc[item.division].districts += 1;
    
    return acc;
  }, {} as Record<string, any>);

  return Object.values(divisionData);
};

export const getTopDistricts = () => {
  return AGRICULTURE_DATA
    .filter(item => item.estimatedLosses > 0)
    .sort((a, b) => b.estimatedLosses - a.estimatedLosses)
    .slice(0, 10);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount * 1_000_000); // Convert millions to actual currency
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-PK').format(num);
}; 