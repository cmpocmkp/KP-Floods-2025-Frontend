import axios from 'axios'
import {
  ToplineMetrics,
  TrendData,
  DamageDistribution,
  DivisionSummary,
  MapMarker,
  IncidentReport,
  IncidentDetail,
  InfrastructureMetrics,
  InfrastructureByDistrict,
  RoadSituation,
  InfrastructureRestoration,
  WarehouseMetrics,
  WarehouseItem,
  StockByDivision,
  IssuedTrendItem,
  CampsMetrics,
  CampsByDistrict,
  CampDistrictChart,
  CompensationMetrics,
  CompensationByDistrict,
  CompensationPolicy,
  ApiResponse
} from './types'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Flag to determine if we should use mock data
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true // Default to true for now

// Mock data
const mockData = {
  toplineMetrics: {
    totalDeaths: 368,
    totalInjured: 187,
    housesDamaged: 1378,
    livestockLost: 4276,
    lastUpdated: '2025-08-20T10:52:00Z',
    reportPeriod: {
      start: '2025-08-14',
      end: '2025-08-20'
    }
  } as ToplineMetrics,

  trendData: [
    { date: '2025-08-14', deaths: 45, injured: 25, housesDamaged: 120 },
    { date: '2025-08-15', deaths: 85, injured: 45, housesDamaged: 280 },
    { date: '2025-08-16', deaths: 120, injured: 65, housesDamaged: 350 },
    { date: '2025-08-17', deaths: 95, injured: 35, housesDamaged: 200 },
    { date: '2025-08-18', deaths: 180, injured: 95, housesDamaged: 750 },
    { date: '2025-08-19', deaths: 65, injured: 25, housesDamaged: 180 },
    { date: '2025-08-20', deaths: 35, injured: 15, housesDamaged: 98 }
  ] as TrendData[],

  damageDistribution: {
    deaths: 368,
    injured: 187,
    housesDamaged: 1378,
    livestockLost: 4276
  } as DamageDistribution,

  divisionSummary: [
    { division: 'Malakand', deaths: 311, injured: 154, housesDamaged: 1109, schoolsDamaged: 93, livestockLost: 4273 },
    { division: 'Hazara', deaths: 30, injured: 5, housesDamaged: 198, schoolsDamaged: 0, livestockLost: 21 },
    { division: 'Mardan', deaths: 24, injured: 21, housesDamaged: 26, schoolsDamaged: 0, livestockLost: 0 },
    { division: 'Peshawar', deaths: 2, injured: 2, housesDamaged: 24, schoolsDamaged: 0, livestockLost: 1 },
    { division: 'D I Khan', deaths: 1, injured: 0, housesDamaged: 7, schoolsDamaged: 0, livestockLost: 0 },
    { division: 'Kohat', deaths: 0, injured: 0, housesDamaged: 12, schoolsDamaged: 0, livestockLost: 0 },
    { division: 'Bannu', deaths: 0, injured: 0, housesDamaged: 1, schoolsDamaged: 0, livestockLost: 0 }
  ] as DivisionSummary[],

  mapMarkers: [
    { id: '1', lat: 34.9526, lng: 72.3311, deaths: 228, severity: 'high' as const, location: 'Buner' },
    { id: '2', lat: 35.2227, lng: 72.4258, deaths: 24, severity: 'medium' as const, location: 'Swabi' },
    { id: '3', lat: 35.1677, lng: 72.4258, deaths: 20, severity: 'medium' as const, location: 'Swat' },
    { id: '4', lat: 34.9969, lng: 72.4258, deaths: 36, severity: 'medium' as const, location: 'Shangla' },
    { id: '5', lat: 34.5553, lng: 72.5747, deaths: 25, severity: 'medium' as const, location: 'Mansehra' },
    { id: '6', lat: 34.4442, lng: 72.7739, deaths: 22, severity: 'medium' as const, location: 'Bajaur' }
  ] as MapMarker[],

  incidents: [
    {
      id: '1',
      district: 'Buner',
      deaths: 228,
      injured: 120,
      housesDamaged: 737,
      cause: 'Flash Flood',
      date: '2025-08-15'
    },
    {
      id: '2',
      district: 'Swabi',
      deaths: 24,
      injured: 20,
      housesDamaged: 19,
      cause: 'Flash Flood',
      date: '2025-08-18'
    },
    {
      id: '3',
      district: 'Swat',
      deaths: 20,
      injured: 2,
      housesDamaged: 220,
      cause: 'Flash Flood',
      date: '2025-08-14'
    },
    {
      id: '4',
      district: 'Shangla',
      deaths: 36,
      injured: 24,
      housesDamaged: 95,
      cause: 'Roof Collapse',
      date: '2025-08-14'
    },
    {
      id: '5',
      district: 'Mansehra',
      deaths: 25,
      injured: 5,
      housesDamaged: 167,
      cause: 'Flash Flood',
      date: '2025-08-15'
    },
    {
      id: '6',
      district: 'Bajaur',
      deaths: 22,
      injured: 5,
      housesDamaged: 19,
      cause: 'Flash Flood',
      date: '2025-08-15'
    }
  ] as IncidentReport[],

  incidentDetails: [
    {
      title: 'Buner - Flash Flood Incident',
      date: '2025-08-15',
      description: 'In continuation of recent rain spell, 03 dead bodies have been recovered. The total number of deaths are 208. Furthermore, it has been reported that 50 persons are still missing.',
      stats: { deaths: 228, injured: 120, housesDamaged: 737 }
    },
    {
      title: 'Swabi - Flash Flood Incident',
      date: '2025-08-18',
      description: 'A total of 09 houses have been completely damaged in Dalorai and Sarkoi villages due to cloudburst, while 10 houses have been partially damaged. 17 fatalities have been confirmed.',
      stats: { deaths: 24, injured: 20, housesDamaged: 19 }
    }
  ] as IncidentDetail[],

  infrastructureMetrics: {
    roadsDamaged: 340,
    bridgesDamaged: 30,
    culvertsDamaged: 33,
    totalRoadsKm: 465.54,
    totalBridgesMeters: 1200,
    totalCulvertsMeters: 850
  } as InfrastructureMetrics,

  infrastructureByDistrict: [
    { district: 'Swat', roadsDamaged: 69, bridgesDamaged: 12, culvertsDamaged: 7, totalLengthKm: 68.15, restorationProgress: 85 },
    { district: 'Buner', roadsDamaged: 47, bridgesDamaged: 0, culvertsDamaged: 5, totalLengthKm: 162.88, restorationProgress: 45 },
    { district: 'Dir Lower', roadsDamaged: 48, bridgesDamaged: 6, culvertsDamaged: 6, totalLengthKm: 43.25, restorationProgress: 65 },
    { district: 'Dir Upper', roadsDamaged: 24, bridgesDamaged: 6, culvertsDamaged: 3, totalLengthKm: 120.74, restorationProgress: 70 },
    { district: 'Shangla', roadsDamaged: 25, bridgesDamaged: 1, culvertsDamaged: 1, totalLengthKm: 32.12, restorationProgress: 55 },
    { district: 'Haripur', roadsDamaged: 27, bridgesDamaged: 5, culvertsDamaged: 11, totalLengthKm: 38.45, restorationProgress: 40 }
  ] as InfrastructureByDistrict[],

  roadSituations: [
    {
      id: '1',
      title: 'Buner - Ghazi Banda Road Blocked',
      date: '2025-08-15',
      description: 'Due to land sliding at Ghazi Banda, main PKHA road is blocked for traffic. Heavy machinery has been mobilized to clear the road.',
      status: 'in_progress' as const
    },
    {
      id: '2',
      title: 'Shangla - Multiple Roads Blocked',
      date: '2025-08-15',
      description: 'Due to land slide/flash flood the following roads are blocked: Chaki Sar to Karrora road, Mattan road, Main road Karroa to Alpuri, Chaki Sar Dero road.',
      status: 'in_progress' as const
    }
  ] as RoadSituation[],

  infrastructureRestoration: [
    { category: 'roads' as const, fullyRestored: 85, partiallyRestored: 155, notRestored: 100 },
    { category: 'bridges' as const, fullyRestored: 8, partiallyRestored: 12, notRestored: 10 },
    { category: 'culverts' as const, fullyRestored: 15, partiallyRestored: 10, notRestored: 8 }
  ] as InfrastructureRestoration[],

  warehouseMetrics: {
    totalItemsAvailable: 113983,
    totalItemsIssued: 50882,
    itemsRequested: 0
  } as WarehouseMetrics,

  warehouseItems: [
    { item: 'Blanket', available: 20258, issued: 6800, remaining: 13458, status: 'in_stock' as const },
    { item: 'Quilt', available: 14487, issued: 0, remaining: 14487, status: 'in_stock' as const },
    { item: 'Plastic Mat', available: 11888, issued: 5000, remaining: 6888, status: 'in_stock' as const },
    { item: 'Life Saving Jacket', available: 9945, issued: 100, remaining: 9845, status: 'in_stock' as const },
    { item: 'Pillow', available: 7006, issued: 6500, remaining: 506, status: 'low_stock' as const },
    { item: 'Mosquito Net', available: 6444, issued: 7400, remaining: -956, status: 'out_of_stock' as const },
    { item: 'Tent', available: 6337, issued: 2860, remaining: 3477, status: 'in_stock' as const },
    { item: 'Kitchen Set', available: 5700, issued: 3625, remaining: 2075, status: 'in_stock' as const }
  ] as WarehouseItem[],

  stockByDivision: [
    { division: 'Malakand', stock: 45250, percentage: 52 },
    { division: 'Hazara', stock: 18500, percentage: 21 },
    { division: 'Dera Ismail Khan', stock: 8900, percentage: 10 },
    { division: 'Kohat', stock: 6200, percentage: 7 },
    { division: 'Peshawar', stock: 4850, percentage: 6 },
    { division: 'Mardan', stock: 2150, percentage: 2 },
    { division: 'Bannu', stock: 1850, percentage: 2 }
  ] as StockByDivision[],

  issuedTrend: [
    { item: 'Tarpaulin Sheet', quantity: 3200 },
    { item: 'Tent', quantity: 2900 },
    { item: 'Hygiene Kit', quantity: 2650 },
    { item: 'Blanket', quantity: 6800 },
    { item: 'Mattress', quantity: 6200 },
    { item: 'Plastic Mat', quantity: 5100 },
    { item: 'Kitchen Set', quantity: 3650 },
    { item: 'Pillow', quantity: 6500 },
    { item: 'Mosquito Net', quantity: 7400 }
  ] as IssuedTrendItem[],

  campsMetrics: {
    totalCamps: 45,
    districtsWithCamps: 8,
    estimatedCapacity: 11250
  } as CampsMetrics,

  campsByDistrict: [
    { district: 'Swat', numberOfCamps: 10, estimatedCapacity: 2500, currentOccupancy: 1850, facilitiesAvailable: 'Medical, Food, Shelter' },
    { district: 'Shangla', numberOfCamps: 10, estimatedCapacity: 2500, currentOccupancy: 2100, facilitiesAvailable: 'Medical, Food, Shelter' },
    { district: 'Mansehra', numberOfCamps: 6, estimatedCapacity: 1500, currentOccupancy: 950, facilitiesAvailable: 'Medical, Food, Shelter' },
    { district: 'Buner', numberOfCamps: 5, estimatedCapacity: 1250, currentOccupancy: 1200, facilitiesAvailable: 'Medical, Food, Shelter' },
    { district: 'Lower Dir', numberOfCamps: 5, estimatedCapacity: 1250, currentOccupancy: 800, facilitiesAvailable: 'Medical, Food, Shelter' },
    { district: 'Upper Dir', numberOfCamps: 5, estimatedCapacity: 1250, currentOccupancy: 750, facilitiesAvailable: 'Medical, Food, Shelter' },
    { district: 'Battagram', numberOfCamps: 3, estimatedCapacity: 750, currentOccupancy: 400, facilitiesAvailable: 'Medical, Food, Shelter' },
    { district: 'Torghar', numberOfCamps: 1, estimatedCapacity: 250, currentOccupancy: 150, facilitiesAvailable: 'Medical, Food, Shelter' }
  ] as CampsByDistrict[],

  campDistrictChart: [
    { district: 'Swat', camps: 10 },
    { district: 'Shangla', camps: 10 },
    { district: 'Mansehra', camps: 6 },
    { district: 'Buner', camps: 5 },
    { district: 'Lower Dir', camps: 5 },
    { district: 'Upper Dir', camps: 5 },
    { district: 'Battagram', camps: 3 },
    { district: 'Torghar', camps: 1 }
  ] as CampDistrictChart[],

  compensationMetrics: {
    beneficiariesPaid: 12450,
    amountDisbursed: 420000000, // 420 Million PKR
    pendingCases: 8650,
    totalRequired: 1080000000 // 1.08 Billion PKR
  } as CompensationMetrics,

  compensationByDistrict: [
    { district: 'Buner', deaths: 228, injured: 120, housesDamaged: 737, livestockLost: 3868, totalCompensation: 486500000 },
    { district: 'Swabi', deaths: 24, injured: 20, housesDamaged: 19, livestockLost: 0, totalCompensation: 31200000 },
    { district: 'Swat', deaths: 20, injured: 2, housesDamaged: 220, livestockLost: 163, totalCompensation: 134040000 },
    { district: 'Shangla', deaths: 36, injured: 24, housesDamaged: 95, livestockLost: 53, totalCompensation: 78860000 },
    { district: 'Mansehra', deaths: 25, injured: 5, housesDamaged: 167, livestockLost: 16, totalCompensation: 111680000 },
    { district: 'Bajaur', deaths: 22, injured: 5, housesDamaged: 19, livestockLost: 87, totalCompensation: 30960000 }
  ] as CompensationByDistrict[],

  compensationPolicy: [
    { type: 'Death', amount: 1000000, eligibleCases: 368, estimatedCompensation: 368000000 },
    { type: 'Grievous Injury', amount: 300000, eligibleCases: 45, estimatedCompensation: 13500000 },
    { type: 'Substantial Injury', amount: 50000, eligibleCases: 142, estimatedCompensation: 7100000 },
    { type: 'Fully Damaged Houses', amount: 500000, eligibleCases: 412, estimatedCompensation: 206000000 },
    { type: 'Partially Damaged Houses', amount: 150000, eligibleCases: 966, estimatedCompensation: 144900000 },
    { type: 'Big Cattles (cows, buffalo, horse)', amount: 80000, eligibleCases: 2156, estimatedCompensation: 172480000 },
    { type: 'Small Cattles (donkey, goat, sheep)', amount: 20000, eligibleCases: 2120, estimatedCompensation: 42400000 },
    { type: 'Crops per acre', amount: 5000, eligibleCases: 12450, estimatedCompensation: 62250000 },
    { type: 'Crops per family', amount: 50000, eligibleCases: 850, estimatedCompensation: 42500000 },
    { type: 'Orchads per Family', amount: 40000, eligibleCases: 620, estimatedCompensation: 24800000 }
  ] as CompensationPolicy[]
}

// API functions
export const overviewApi = {
  getToplineMetrics: async (): Promise<ApiResponse<ToplineMetrics>> => {
    if (USE_MOCK) {
      return { data: mockData.toplineMetrics, success: true }
    }
    const response = await api.get('/overview/topline')
    return response.data
  },

  getTrendData: async (): Promise<ApiResponse<TrendData[]>> => {
    if (USE_MOCK) {
      return { data: mockData.trendData, success: true }
    }
    const response = await api.get('/overview/trend')
    return response.data
  },

  getDamageDistribution: async (): Promise<ApiResponse<DamageDistribution>> => {
    if (USE_MOCK) {
      return { data: mockData.damageDistribution, success: true }
    }
    const response = await api.get('/overview/damage-distribution')
    return response.data
  },

  getDivisionSummary: async (): Promise<ApiResponse<DivisionSummary[]>> => {
    if (USE_MOCK) {
      return { data: mockData.divisionSummary, success: true }
    }
    const response = await api.get('/overview/divisions')
    return response.data
  },

  getMapMarkers: async (): Promise<ApiResponse<MapMarker[]>> => {
    if (USE_MOCK) {
      return { data: mockData.mapMarkers, success: true }
    }
    const response = await api.get('/overview/map')
    return response.data
  }
}

export const incidentsApi = {
  getIncidents: async (filters?: any): Promise<ApiResponse<IncidentReport[]>> => {
    if (USE_MOCK) {
      return { data: mockData.incidents, success: true }
    }
    const response = await api.get('/incidents/list', { params: filters })
    return response.data
  },

  getIncidentDetails: async (): Promise<ApiResponse<IncidentDetail[]>> => {
    if (USE_MOCK) {
      return { data: mockData.incidentDetails, success: true }
    }
    const response = await api.get('/incidents/details')
    return response.data
  }
}

export const infrastructureApi = {
  getMetrics: async (): Promise<ApiResponse<InfrastructureMetrics>> => {
    if (USE_MOCK) {
      return { data: mockData.infrastructureMetrics, success: true }
    }
    const response = await api.get('/infrastructure/metrics')
    return response.data
  },

  getByDistrict: async (): Promise<ApiResponse<InfrastructureByDistrict[]>> => {
    if (USE_MOCK) {
      return { data: mockData.infrastructureByDistrict, success: true }
    }
    const response = await api.get('/infrastructure/districts')
    return response.data
  },

  getRoadSituations: async (): Promise<ApiResponse<RoadSituation[]>> => {
    if (USE_MOCK) {
      return { data: mockData.roadSituations, success: true }
    }
    const response = await api.get('/infrastructure/road-situations')
    return response.data
  },

  getRestorationData: async (): Promise<ApiResponse<InfrastructureRestoration[]>> => {
    if (USE_MOCK) {
      return { data: mockData.infrastructureRestoration, success: true }
    }
    const response = await api.get('/infrastructure/restoration')
    return response.data
  }
}

export const warehouseApi = {
  getMetrics: async (): Promise<ApiResponse<WarehouseMetrics>> => {
    if (USE_MOCK) {
      return { data: mockData.warehouseMetrics, success: true }
    }
    const response = await api.get('/warehouse/metrics')
    return response.data
  },

  getItems: async (): Promise<ApiResponse<WarehouseItem[]>> => {
    if (USE_MOCK) {
      return { data: mockData.warehouseItems, success: true }
    }
    const response = await api.get('/warehouse/items')
    return response.data
  },

  getStockByDivision: async (): Promise<ApiResponse<StockByDivision[]>> => {
    if (USE_MOCK) {
      return { data: mockData.stockByDivision, success: true }
    }
    const response = await api.get('/warehouse/stock-by-division')
    return response.data
  },

  getIssuedTrend: async (): Promise<ApiResponse<IssuedTrendItem[]>> => {
    if (USE_MOCK) {
      return { data: mockData.issuedTrend, success: true }
    }
    const response = await api.get('/warehouse/issued-trend')
    return response.data
  }
}

export const campsApi = {
  getMetrics: async (): Promise<ApiResponse<CampsMetrics>> => {
    if (USE_MOCK) {
      return { data: mockData.campsMetrics, success: true }
    }
    const response = await api.get('/camps/metrics')
    return response.data
  },

  getByDistrict: async (): Promise<ApiResponse<CampsByDistrict[]>> => {
    if (USE_MOCK) {
      return { data: mockData.campsByDistrict, success: true }
    }
    const response = await api.get('/camps/by-district')
    return response.data
  },

  getDistrictChart: async (): Promise<ApiResponse<CampDistrictChart[]>> => {
    if (USE_MOCK) {
      return { data: mockData.campDistrictChart, success: true }
    }
    const response = await api.get('/camps/district-chart')
    return response.data
  }
}

export const compensationApi = {
  getMetrics: async (): Promise<ApiResponse<CompensationMetrics>> => {
    if (USE_MOCK) {
      return { data: mockData.compensationMetrics, success: true }
    }
    const response = await api.get('/compensation/metrics')
    return response.data
  },

  getByDistrict: async (): Promise<ApiResponse<CompensationByDistrict[]>> => {
    if (USE_MOCK) {
      return { data: mockData.compensationByDistrict, success: true }
    }
    const response = await api.get('/compensation/districts')
    return response.data
  },

  getPolicy: async (): Promise<ApiResponse<CompensationPolicy[]>> => {
    if (USE_MOCK) {
      return { data: mockData.compensationPolicy, success: true }
    }
    const response = await api.get('/compensation/policy')
    return response.data
  }
}

export default api