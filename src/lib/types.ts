// Core data types for KP Floods 2025 Dashboard

export interface ToplineMetrics {
  totalDeaths: number
  totalInjured: number
  housesDamaged: number
  livestockLost: number
  lastUpdated: string
  reportPeriod: {
    start: string
    end: string
  }
}

export interface TrendData {
  date: string
  deaths: number
  injured: number
  housesDamaged: number
}

export interface DamageDistribution {
  deaths: number
  injured: number
  housesDamaged: number
  livestockLost: number
}

export interface DivisionSummary {
  division: string
  deaths: number
  injured: number
  housesDamaged: number
  schoolsDamaged: number
  livestockLost: number
}

export interface MapMarker {
  id: string
  lat: number
  lng: number
  deaths: number
  severity: 'high' | 'medium' | 'low' | 'infrastructure'
  location: string
}

// Incident Reports
export interface IncidentReport {
  id: string
  district: string
  deaths: number
  injured: number
  housesDamaged: number
  cause: string
  date: string
  description?: string
}

export interface IncidentDetail {
  title: string
  date: string
  description: string
  stats: {
    deaths: number
    injured: number
    housesDamaged: number
  }
}

// Infrastructure
export interface InfrastructureMetrics {
  roadsDamaged: number
  bridgesDamaged: number
  culvertsDamaged: number
  totalRoadsKm: number
  totalBridgesMeters: number
  totalCulvertsMeters: number
}

export interface InfrastructureByDistrict {
  district: string
  roadsDamaged: number
  bridgesDamaged: number
  culvertsDamaged: number
  totalLengthKm: number
  restorationProgress: number // 0-100
}

export interface RoadSituation {
  id: string
  title: string
  date: string
  description: string
  status: 'in_progress' | 'completed' | 'pending'
}

export interface InfrastructureRestoration {
  category: 'roads' | 'bridges' | 'culverts'
  fullyRestored: number
  partiallyRestored: number
  notRestored: number
}

// Warehouse
export interface WarehouseMetrics {
  totalItemsAvailable: number
  totalItemsIssued: number
  itemsRequested: number
}

export interface WarehouseItem {
  item: string
  available: number
  issued: number
  remaining: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
}

export interface StockByDivision {
  division: string
  stock: number
  percentage: number
}

export interface IssuedTrendItem {
  item: string
  quantity: number
}

// Relief Camps
export interface CampsMetrics {
  totalCamps: number
  districtsWithCamps: number
  estimatedCapacity: number
}

export interface CampsByDistrict {
  district: string
  numberOfCamps: number
  estimatedCapacity: number
  currentOccupancy: number
  facilitiesAvailable: string
}

export interface CampDistrictChart {
  district: string
  camps: number
}

// Compensation
export interface CompensationMetrics {
  beneficiariesPaid: number
  amountDisbursed: number // in PKR
  pendingCases: number
  totalRequired: number
}

export interface CompensationByDistrict {
  district: string
  deaths: number
  injured: number
  housesDamaged: number
  livestockLost: number
  totalCompensation: number // in PKR
}

export interface CompensationPolicy {
  type: string
  amount: number // in PKR
  eligibleCases: number
  estimatedCompensation: number
}

// API Response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Chart data types
export type ChartDataPoint = {
  [key: string]: string | number
}

// Filter types
export interface BaseFilters {
  dateRange?: {
    start: string
    end: string
  }
  districts?: string[]
}

export interface IncidentFilters extends BaseFilters {
  causes?: string[]
  severity?: string[]
}

// Component prop types
export interface KpiCardProps {
  title: string
  value: number | string
  icon: React.ComponentType<{ className?: string }>
  color: 'red' | 'orange' | 'blue' | 'green'
  subtitle?: string
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
}

export interface DataTableColumn<T> {
  key: keyof T
  label: string
  render?: (value: any, row: T) => React.ReactNode
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
}

export interface ProgressBarProps {
  value: number
  max: number
  color?: 'blue' | 'green' | 'yellow' | 'red'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export interface StatBadgeProps {
  label: string
  value: number
  color: 'red' | 'orange' | 'blue' | 'green'
  size?: 'sm' | 'md' | 'lg'
}

// Error types
export interface ApiError {
  message: string
  code?: string | number
  details?: any
}