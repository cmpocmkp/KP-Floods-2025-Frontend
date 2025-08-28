import { CompensationItem, CompensationCategory, CompensationPolicySummary, CompensationCategoryType } from '../types/compensation';

export const COMPENSATION_DATA: CompensationItem[] = [
  {
    type: "Death",
    compensation: 2000000,
    count: 406,
    total: 812000000
  },
  {
    type: "Injury",
    compensation: 500000,
    count: 248,
    total: 124000000
  },
  {
    type: "Partial damaged Houses",
    compensation: 300000,
    count: 2683,
    total: 804900000
  },
  {
    type: "Fully Damaged Houses",
    compensation: 1000000,
    count: 978,
    total: 978000000
  },
  {
    type: "Shops, Kiosk or other business establishment Fully Damaged",
    compensation: 500000,
    count: 1288,
    total: 644000000
  },
  {
    type: "Vehicle Fully Damaged",
    compensation: 300000,
    count: 100,
    total: 30000000
  },
  {
    type: "Big Cattles (cows,buffalos,Horse)",
    compensation: 80000,
    count: 3972,
    total: 317760000
  },
  {
    type: "Small Cattles(Donkey,Goat, Sheep",
    compensation: 20000,
    count: 8782,
    total: 175640000
  },
  {
    type: "Crops per acre",
    compensation: 5000,
    count: 57892.5,
    total: 289462500
  }
];

export const COMPENSATION_CATEGORIES = {
  [CompensationCategoryType.HUMAN_LOSS]: [
    "Death",
    "Injury"
  ],
  [CompensationCategoryType.PROPERTY_DAMAGE]: [
    "Partial damaged Houses",
    "Fully Damaged Houses",
    "Shops, Kiosk or other business establishment Fully Damaged"
  ],
  [CompensationCategoryType.VEHICLE_DAMAGE]: [
    "Vehicle Fully Damaged"
  ],
  [CompensationCategoryType.LIVESTOCK_LOSS]: [
    "Big Cattles (cows,buffalos,Horse)",
    "Small Cattles(Donkey,Goat, Sheep"
  ],
  [CompensationCategoryType.AGRICULTURAL_LOSS]: [
    "Crops per acre"
  ]
};

export const processCompensationData = (): CompensationPolicySummary => {
  const categories = Object.entries(COMPENSATION_CATEGORIES).map(([category, types]) => {
    const items = COMPENSATION_DATA.filter(item => types.includes(item.type));
    const totalCompensation = items.reduce((sum, item) => sum + item.total, 0);
    const totalCount = items.reduce((sum, item) => sum + item.count, 0);
    
    return {
      category,
      items,
      totalCompensation,
      totalCount
    };
  });

  const totalCompensation = categories.reduce((sum, cat) => sum + cat.totalCompensation, 0);
  const totalBeneficiaries = categories.reduce((sum, cat) => sum + cat.totalCount, 0);

  return {
    categories,
    totalCompensation,
    totalBeneficiaries
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-PK').format(num);
}; 