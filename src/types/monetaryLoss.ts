export interface LossRate {
  type: string;
  value: number;
}

export interface MonetaryLossCategory {
  category: string;
  items: MonetaryLossItem[];
  totalLoss: number;
}

export interface MonetaryLossItem {
  type: string;
  totalLoss: number;
  percentage: number;
}

export interface MonetaryLossSummary {
  categories: MonetaryLossCategory[];
  totalLossInBillions: number;
  totalLossInRupees: number;
}

// Categories for grouping different types of losses
export enum LossCategory {
  INFRASTRUCTURE = "Infrastructure Damage",
  PROPERTY = "Property Damage",
  VEHICLES = "Vehicle Damage",
  LIVESTOCK = "Livestock & Feed",
  AGRICULTURE = "Agricultural Losses",
  SERVICES = "Essential Services",
  GOVERNMENT = "Government Facilities"
}