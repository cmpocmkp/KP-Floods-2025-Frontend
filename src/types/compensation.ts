export interface CompensationItem {
  type: string;
  compensation: number;
  count: number;
  total: number;
}

export interface CompensationSummary {
  Summary: CompensationItem[];
  "Summary (Formatted)": CompensationItem[];
}

export interface CompensationCategory {
  category: string;
  items: CompensationItem[];
  totalCompensation: number;
  totalCount: number;
}

export interface CompensationPolicySummary {
  categories: CompensationCategory[];
  totalCompensation: number;
  totalBeneficiaries: number;
}

export enum CompensationCategoryType {
  HUMAN_LOSS = "Human Losses",
  PROPERTY_DAMAGE = "Property Damage",
  VEHICLE_DAMAGE = "Vehicle Damage",
  LIVESTOCK_LOSS = "Livestock Losses",
  AGRICULTURAL_LOSS = "Agricultural Losses"
} 