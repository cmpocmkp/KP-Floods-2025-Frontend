import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { getDistrictWiseIncidents, type DistrictIncidentSummary } from '@/api/incidents';
import { useState } from 'react';

export default function IncidentsPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<DistrictIncidentSummary | null>(null);

  const { data: incidents, isLoading, error } = useQuery({
    queryKey: ['district-wise-incidents'],
    queryFn: () => getDistrictWiseIncidents(),
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const getCauseBadgeColor = (cause: string) => {
    switch (cause.toLowerCase()) {
      case 'floods':
        return 'bg-blue-100 text-blue-800';
      case 'flash flood':
        return 'bg-red-100 text-red-800';
      case 'river overflow':
        return 'bg-blue-100 text-blue-800';
      case 'landslide':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (districtIncident: DistrictIncidentSummary) => {
    console.log('View Details clicked for:', districtIncident.district);
    console.log('Incident data:', districtIncident.incidents);

    setSelectedIncident(districtIncident);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedIncident(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Incidents</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-pulse">Loading incidents data...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Recent Incidents</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center text-red-500">
              <div>
                <div className="font-semibold">Error loading incidents data</div>
                <div className="text-sm mt-1">{error.message}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }



  return (
    <div className="space-y-6">

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="px-3 py-1 bg-white">All</Badge>
        <Badge variant="outline" className="px-3 py-1">Peshawar</Badge>
        <Badge variant="outline" className="px-3 py-1">Charsadda</Badge>
        <Badge variant="outline" className="px-3 py-1">Nowshera</Badge>
      </div>

      {/* Incidents Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Recent Incidents</h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>District</TableHead>
                <TableHead className="text-right">Deaths</TableHead>
                <TableHead className="text-right">Injured</TableHead>
                <TableHead className="text-right">Houses Damaged</TableHead>
                <TableHead>Cause</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents && incidents.length > 0 ? (
                incidents.map((districtIncident: DistrictIncidentSummary) => (
                  <TableRow key={districtIncident.district_id}>
                    <TableCell className="font-medium">{districtIncident.district}</TableCell>
                    <TableCell className="text-right">{districtIncident.deaths.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{districtIncident.injured.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{districtIncident.houses_damaged.toLocaleString()}</TableCell>
                  <TableCell>
                      <Badge className={getCauseBadgeColor(districtIncident.cause)}>
                        {districtIncident.cause}
                    </Badge>
                  </TableCell>
                    <TableCell>
                      {districtIncident.date
                        ? format(new Date(districtIncident.date), 'MMM d, yyyy')
                        : 'N/A'
                      }
                    </TableCell>
                  <TableCell className="text-right">
                    <button
                      className="text-blue-600 hover:text-blue-800 underline"
                      onClick={() => handleViewDetails(districtIncident)}
                    >
                      View Details
                    </button>
                  </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No incidents data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Incident Details Modal */}
      {showModal && selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedIncident.cause} in {selectedIncident.district}
                  </h2>
                  <p className="text-blue-100 text-lg">
                    {selectedIncident.date
                      ? format(new Date(selectedIncident.date), 'MMMM d, yyyy')
                      : 'Date not available'
                    }
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseModal}
                  className="text-white hover:bg-white/20 rounded-full w-10 h-10 p-0"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-red-600 text-sm font-medium">Total Deaths</div>
                  <div className="text-2xl font-bold text-red-700">{selectedIncident.deaths}</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="text-orange-600 text-sm font-medium">Total Injured</div>
                  <div className="text-2xl font-bold text-orange-700">{selectedIncident.injured}</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-blue-600 text-sm font-medium">Houses Damaged</div>
                  <div className="text-2xl font-bold text-blue-700">{selectedIncident.houses_damaged}</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-purple-600 text-sm font-medium">Cause</div>
                  <div className="text-lg font-bold text-purple-700">{selectedIncident.cause}</div>
                </div>
              </div>

              {/* Detailed Incident Breakdown */}
              {selectedIncident.incidents && selectedIncident.incidents.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Incident Breakdown</h3>

                  {selectedIncident.incidents.map((incident, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      {/* Date Header */}
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-700">Incident Report #{index + 1}</h4>
                        <div className="text-sm text-gray-500">
                          Last Updated: {format(new Date(incident.last_updated), 'MMM d, yyyy h:mm a')}
                        </div>
                      </div>

                      {/* Statistics Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {/* Deaths Breakdown */}
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <div className="text-red-700 font-medium text-sm mb-2">Deaths Breakdown</div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-red-600">Male:</span>
                              <span className="font-semibold">{incident.male_deaths}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-red-600">Female:</span>
                              <span className="font-semibold">{incident.female_deaths}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-red-600">Child:</span>
                              <span className="font-semibold">{incident.child_deaths}</span>
                            </div>
                            <div className="border-t border-red-300 pt-1 flex justify-between font-semibold">
                              <span className="text-red-700">Total:</span>
                              <span>{incident.total_deaths}</span>
                            </div>
                          </div>
                        </div>

                        {/* Injuries Breakdown */}
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <div className="text-orange-700 font-medium text-sm mb-2">Injuries Breakdown</div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-orange-600">Male:</span>
                              <span className="font-semibold">{incident.male_injured}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-orange-600">Female:</span>
                              <span className="font-semibold">{incident.female_injured}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-orange-600">Child:</span>
                              <span className="font-semibold">{incident.child_injured}</span>
                            </div>
                            <div className="border-t border-orange-300 pt-1 flex justify-between font-semibold">
                              <span className="text-orange-700">Total:</span>
                              <span>{incident.total_injured}</span>
                            </div>
                          </div>
                        </div>

                        {/* Housing Damage */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="text-blue-700 font-medium text-sm mb-2">Housing Damage</div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-blue-600">Fully Damaged:</span>
                              <span className="font-semibold">{incident.house_damaged_fully}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-600">Partially Damaged:</span>
                              <span className="font-semibold">{incident.house_damaged_partially}</span>
                            </div>
                            <div className="border-t border-blue-300 pt-1 flex justify-between font-semibold">
                              <span className="text-blue-700">Total:</span>
                              <span>{incident.total_houses_damaged}</span>
                            </div>
                          </div>
                        </div>

                        {/* Other Damages */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="text-green-700 font-medium text-sm mb-2">Other Damages</div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-green-600">Schools:</span>
                              <span className="font-semibold">{incident.total_school_damaged}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-600">Livestock:</span>
                              <span className="font-semibold">{incident.cattle_perished}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-600">Other:</span>
                              <span className="font-semibold">{incident.total_other_damaged}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Report Date */}
                      {incident.report_date && (
                        <div className="text-xs text-gray-500 bg-white rounded px-2 py-1 inline-block">
                          Report Date: {incident.report_date === null ? 'Not specified' : format(new Date(incident.report_date), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-2">📊</div>
                  <div className="text-gray-600">No detailed incident data available for this district.</div>
                  <div className="text-sm text-gray-400 mt-1">The API returned an empty incidents array.</div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end">
              <Button
                onClick={handleCloseModal}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Close
              </Button>
            </div>
          </div>
      </div>
      )}

    </div>
  );
}