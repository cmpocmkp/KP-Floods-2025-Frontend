import { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronDown,
  Calendar,
  MapPin,
  Filter,
  RotateCcw,
  Copy,
  Settings
} from 'lucide-react';
import { VisualizeFilters as VisualizeFiltersType } from '@/pages/VisualizePage';
import { DSRAggregates } from '@/api/dsr';

interface VisualizeFiltersProps {
  filters: VisualizeFiltersType;
  onFiltersChange: (filters: VisualizeFiltersType) => void;
  onCopyBrief: () => void;
  aggregates?: DSRAggregates | null;
}

export function VisualizeFilters({ filters, onFiltersChange, onCopyBrief, aggregates }: VisualizeFiltersProps) {
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [isDivisionDropdownOpen, setIsDivisionDropdownOpen] = useState(false);

  // Get available districts and divisions from data
  const availableDistricts = useMemo(() => {
    if (!aggregates) return [];
    return [...new Set(Object.keys(aggregates.narratives).concat(
      aggregates.severityRecords.map(r => r.district)
    ))].sort();
  }, [aggregates]);

  const availableDivisions = useMemo(() => {
    // In a real implementation, you'd extract divisions from the data
    // For now, we'll use some common KP divisions
    return ['Peshawar', 'Malakand', 'Hazara', 'Bannu', 'Dera Ismail Khan', 'Kohat', 'Mardan'].sort();
  }, []);

  const updateFilters = (updates: Partial<VisualizeFiltersType>) => {
    onFiltersChange({
      ...filters,
      ...updates
    });
  };

  const handleDistrictToggle = (district: string) => {
    const newDistricts = filters.districts.includes(district)
      ? filters.districts.filter(d => d !== district)
      : [...filters.districts, district];
    updateFilters({ districts: newDistricts });
  };

  const handleDivisionToggle = (division: string) => {
    const newDivisions = filters.divisions.includes(division)
      ? filters.divisions.filter(d => d !== division)
      : [...filters.divisions, division];
    updateFilters({ divisions: newDivisions });
  };

  const handleCategoryToggle = (category: keyof typeof filters.categories) => {
    updateFilters({
      categories: {
        ...filters.categories,
        [category]: !filters.categories[category]
      }
    });
  };

  const handleReset = () => {
    updateFilters({
      dateRange: {
        start: '2025-08-01',
        end: '2025-08-15',
        granularity: 'day'
      },
      divisions: [],
      districts: [],
      categories: {
        houses: true,
        schools: true,
        roads: true,
        bridges: true,
        services: true,
        warehouse: true,
        relief: true,
        compensation: true
      }
    });
  };

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    updateFilters({
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    });
  };

  const handleGranularityChange = (granularity: 'day' | 'week' | 'month') => {
    updateFilters({
      dateRange: {
        ...filters.dateRange,
        granularity
      }
    });
  };

  const selectAllDistricts = () => updateFilters({ districts: availableDistricts });
  const clearAllDistricts = () => updateFilters({ districts: [] });

  const selectAllDivisions = () => updateFilters({ divisions: availableDivisions });
  const clearAllDivisions = () => updateFilters({ divisions: [] });

  const activeFiltersCount = filters.districts.length + filters.divisions.length +
    Object.values(filters.categories).filter(Boolean).length;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left side - Filter controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Date Range */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Label htmlFor="date-start" className="text-sm">From:</Label>
                  <Input
                    id="date-start"
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => handleDateChange('start', e.target.value)}
                    className="w-32 h-8"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Label htmlFor="date-end" className="text-sm">To:</Label>
                  <Input
                    id="date-end"
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => handleDateChange('end', e.target.value)}
                    className="w-32 h-8"
                  />
                </div>
              </div>
            </div>

            {/* Granularity Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['day', 'week', 'month'] as const).map((granularity) => (
                  <Button
                    key={granularity}
                    variant={filters.dateRange.granularity === granularity ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleGranularityChange(granularity)}
                    className="px-3 py-1 text-xs capitalize"
                  >
                    {granularity}
                  </Button>
                ))}
              </div>
            </div>

            {/* Divisions Multi-Select */}
            <DropdownMenu open={isDivisionDropdownOpen} onOpenChange={setIsDivisionDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Divisions
                  {filters.divisions.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {filters.divisions.length}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Divisions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="flex gap-2 p-2">
                  <Button variant="outline" size="sm" onClick={selectAllDivisions} className="flex-1">
                    All
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearAllDivisions} className="flex-1">
                    Clear
                  </Button>
                </div>
                <DropdownMenuSeparator />
                {availableDivisions.map((division) => (
                  <DropdownMenuCheckboxItem
                    key={division}
                    checked={filters.divisions.includes(division)}
                    onCheckedChange={() => handleDivisionToggle(division)}
                  >
                    {division}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Districts Multi-Select */}
            <DropdownMenu open={isDistrictDropdownOpen} onOpenChange={setIsDistrictDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Districts
                  {filters.districts.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {filters.districts.length}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto">
                <DropdownMenuLabel>Districts</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="flex gap-2 p-2">
                  <Button variant="outline" size="sm" onClick={selectAllDistricts} className="flex-1">
                    All
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearAllDistricts} className="flex-1">
                    Clear
                  </Button>
                </div>
                <DropdownMenuSeparator />
                {availableDistricts.map((district) => (
                  <DropdownMenuCheckboxItem
                    key={district}
                    checked={filters.districts.includes(district)}
                    onCheckedChange={() => handleDistrictToggle(district)}
                  >
                    {district}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Categories */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Categories
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Impact Categories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries({
                  houses: 'Houses',
                  schools: 'Schools',
                  roads: 'Roads',
                  bridges: 'Bridges',
                  services: 'Services',
                  warehouse: 'Warehouse',
                  relief: 'Relief',
                  compensation: 'Compensation'
                }).map(([key, label]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={filters.categories[key as keyof typeof filters.categories]}
                    onCheckedChange={() => handleCategoryToggle(key as keyof typeof filters.categories)}
                  >
                    {label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="mr-2">
                {activeFiltersCount} active
              </Badge>
            )}

            <Button variant="outline" size="sm" onClick={handleReset} className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>

            <Button variant="outline" size="sm" onClick={onCopyBrief} className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Copy Brief
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.divisions.length > 0 || filters.districts.length > 0) && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 mr-2">Active filters:</span>
              {filters.divisions.map((division) => (
                <Badge
                  key={division}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleDivisionToggle(division)}
                >
                  Division: {division} ×
                </Badge>
              ))}
              {filters.districts.map((district) => (
                <Badge
                  key={district}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleDistrictToggle(district)}
                >
                  District: {district} ×
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}