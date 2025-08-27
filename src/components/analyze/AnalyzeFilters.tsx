import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  ChevronDown,
  Download,
  FileText,
  Calendar,
  MapPin,
  X
} from 'lucide-react';
import { DSRAggregates } from '@/api/dsr';

interface AnalyzeFiltersProps {
  date: string;
  onDateChange: (date: string) => void;
  selectedDistricts: string[];
  onDistrictsChange: (districts: string[]) => void;
  aggregates: DSRAggregates | null;
  onExportCSV: () => void;
  onExportPDF: () => void;
}

export function AnalyzeFilters({
  date,
  onDateChange,
  selectedDistricts,
  onDistrictsChange,
  aggregates,
  onExportCSV,
  onExportPDF
}: AnalyzeFiltersProps) {
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);

  // Get all available districts from the data
  const availableDistricts = useMemo(() => {
    if (!aggregates) return [];

    const districts = new Set<string>();
    Object.keys(aggregates.narratives).forEach(district => districts.add(district));

    // Add districts from severity records that might not have narratives
    aggregates.severityRecords.forEach(record => districts.add(record.district));

    return Array.from(districts).sort();
  }, [aggregates]);

  const handleDistrictToggle = (district: string) => {
    const newSelection = selectedDistricts.includes(district)
      ? selectedDistricts.filter(d => d !== district)
      : [...selectedDistricts, district];
    onDistrictsChange(newSelection);
  };

  const handleSelectAll = () => {
    onDistrictsChange(availableDistricts);
  };

  const handleClearAll = () => {
    onDistrictsChange([]);
  };

  const handleRemoveDistrict = (district: string) => {
    onDistrictsChange(selectedDistricts.filter(d => d !== district));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Daily Situation Report Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Selection */}
        <div className="space-y-2">
          <Label htmlFor="date-input">Report Date</Label>
          <Input
            id="date-input"
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full md:w-auto"
          />
          <p className="text-sm text-muted-foreground">
            Select the date for the Daily Situation Report analysis
          </p>
        </div>

        {/* District Multi-Select */}
        <div className="space-y-2">
          <Label>District Filter</Label>
          <DropdownMenu open={isDistrictDropdownOpen} onOpenChange={setIsDistrictDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {selectedDistricts.length === 0 ? (
                    "All Districts"
                  ) : selectedDistricts.length === availableDistricts.length ? (
                    "All Districts"
                  ) : (
                    `${selectedDistricts.length} of ${availableDistricts.length} Districts`
                  )}
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 max-h-96 overflow-y-auto">
              <DropdownMenuLabel>District Selection</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="flex gap-2 p-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="flex-1"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="flex-1"
                >
                  Clear All
                </Button>
              </div>
              <DropdownMenuSeparator />
              {availableDistricts.map((district) => (
                <DropdownMenuCheckboxItem
                  key={district}
                  checked={selectedDistricts.includes(district)}
                  onCheckedChange={() => handleDistrictToggle(district)}
                >
                  {district}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Selected Districts Display */}
          {selectedDistricts.length > 0 && selectedDistricts.length < availableDistricts.length && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedDistricts.map((district) => (
                <Badge key={district} variant="secondary" className="flex items-center gap-1">
                  {district}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveDistrict(district)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Export Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={onExportCSV} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={onExportPDF} variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate PDF Brief
          </Button>
        </div>

        {/* Summary Stats */}
        {aggregates && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{aggregates.totals.districtsReporting}</div>
              <div className="text-sm text-muted-foreground">Districts Reporting</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{aggregates.totals.incidents}</div>
              <div className="text-sm text-muted-foreground">Total Incidents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{aggregates.totals.roadsBlocked}</div>
              <div className="text-sm text-muted-foreground">Roads Blocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Object.keys(aggregates.narratives).length}</div>
              <div className="text-sm text-muted-foreground">Districts with Details</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}