import { LossRate, LossCategory } from '../types/monetaryLoss';

export const LOSS_RATES: LossRate[] = [
  { type: "House Fully", value: 7352000000.0 },
  { type: "House Partially", value: 8589000000.0 },
  { type: "Big cattles", value: 937763103.9599999 },
  { type: "small Cattles", value: 351280000.0 },
  { type: "Educational Facilities Damaged fully", value: 2083000000.0 },
  { type: "Educational Facilities Damaged Partially", value: 987000000.0 },
  { type: "HED facilities Damaged", value: 14400000.0 },
  { type: "Public Offices", value: 603000000.0 },
  { type: "Shops", value: 3220000000.0 },
  { type: "Roads in Km restoration", value: 463303536.0 },
  { type: "Roads in Km rehabiliation", value: 2701011831.0 },
  { type: "Bridges in meter restoration", value: 6226780.0 },
  { type: "Bridges in meter rehabiliation", value: 49483704.0 },
  { type: "Culverts in Meter restoration", value: 1628175.0 },
  { type: "Culverts in Meter rehabiliation", value: 5780225.0 },
  { type: "Vehicles", value: 300000000.0 },
  { type: "Health facilities", value: 320000000.0 },
  { type: "Fodders roughes", value: 126270000.0 },
  { type: "Fodders concentrate", value: 20842500.0 },
  { type: "Shelters", value: 252000000.0 },
  { type: "Crops destruction", value: 6418850000.0 },
  { type: "Transformers", value: 2000000000.0 },
  { type: "services", value: 100658000.0 },
  { type: "Local government", value: 1008000000.0 },
  { type: "Energy and Power", value: 402000000.0 },
  { type: "irrigation", value: 9227000000.0 },
  { type: "public health", value: 1070000000.0 }
];

export const LOSS_CATEGORIES = {
  [LossCategory.INFRASTRUCTURE]: [
    "Roads in Km restoration",
    "Roads in Km rehabiliation",
    "Bridges in meter restoration",
    "Bridges in meter rehabiliation",
    "Culverts in Meter restoration",
    "Culverts in Meter rehabiliation",
    "Transformers",
    "Energy and Power",
    "irrigation"
  ],
  [LossCategory.PROPERTY]: [
    "House Fully",
    "House Partially",
    "Shops",
    "Shelters"
  ],
  [LossCategory.VEHICLES]: [
    "Vehicles"
  ],
  [LossCategory.LIVESTOCK]: [
    "Big cattles",
    "small Cattles",
    "Fodders roughes",
    "Fodders concentrate"
  ],
  [LossCategory.AGRICULTURE]: [
    "Crops destruction"
  ],
  [LossCategory.SERVICES]: [
    "services"
  ],
  [LossCategory.GOVERNMENT]: [
    "Educational Facilities Damaged fully",
    "Educational Facilities Damaged Partially",
    "HED facilities Damaged",
    "Public Offices",
    "Health facilities",
    "Local government",
    "public health"
  ]
};