import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnnexIII2025Print } from './AnnexIII2025Print';

// Sample data for demonstration
const sampleData = {
          title: "KPD3 IMPACT ASSESSMENT — Annex III",
  generatedOn: "15 January 2025",
  introText: "This report presents a comprehensive assessment of damages, losses, and needs resulting from the devastating floods that affected Khyber Pakhtunkhwa in 2025. The assessment covers infrastructure damage, property losses, agricultural impacts, and human casualties across affected regions. The data represents the most current information available and provides a foundation for recovery planning and resource allocation.",
  mapSpec: {
    bounds: [31.0, 69.0, 37.0, 74.0],
    center: [34.9526, 71.7340],
    zoom: 8,
    markers: [],
  },
  tableRegionRows: [
    {
      region: "Khyber Pakhtunkhwa",
      damageBPKR: 245.97,
      lossBPKR: 172.4,
      needsBPKR: 204.36,
    }
  ],
  totals: {
    damageBPKR: 245.97,
    lossBPKR: 172.4,
    needsBPKR: 204.36,
  },
  notes: [
    "Damages: direct physical destruction of assets and infrastructure",
    "Losses: changes in economic flows due to the disaster",
    "Needs: financing required for recovery and reconstruction"
  ],
  sectors: [
    {
      name: "Housing and Infrastructure",
      summary: "Significant damage to residential and commercial structures, roads, bridges, and public facilities. Estimated damage value: 125.50 billion PKR.",
      damageValue: 125.50,
    },
    {
      name: "Agriculture and Livestock",
      summary: "Extensive crop damage and livestock losses affecting food security and rural livelihoods. Estimated losses: 89.25 billion PKR.",
      damageValue: 89.25,
    },
    {
      name: "Human Impact and Social Services",
      summary: "Casualties, displacement, and disruption of essential services requiring immediate humanitarian response and long-term recovery support.",
      damageValue: 31.22,
    }
  ],
  vulnerable: [
    "Human casualties: 156 deaths and 342 injuries reported.",
    "Housing displacement: 12,450 houses damaged, affecting thousands of families.",
    "Agricultural impact: 18 districts affected, with significant crop and livestock losses."
  ],
  responseNotes: [
    "Compensation disbursed: 172.40 billion PKR allocated for immediate relief.",
    "Emergency response operations ongoing with coordination between federal and provincial authorities.",
    "Recovery and reconstruction planning in progress with international support mobilization."
  ],
};

export const AnnexIII2025Demo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'preview' | 'data'>('overview');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value * 1e9); // Convert billions to actual PKR
  };

  return (
    <div className="annex-iii-2025-demo min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            KPD3 Impact Assessment
          </h1>
          <p className="text-xl text-gray-600">
            Annex III Report System Demo
          </p>
          <Badge variant="secondary" className="mt-2">
            Development Preview
          </Badge>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('overview')}
              className="rounded-md"
            >
              Overview
            </Button>
            <Button
              variant={activeTab === 'preview' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('preview')}
              className="rounded-md"
            >
              Report Preview
            </Button>
            <Button
              variant={activeTab === 'data' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('data')}
              className="rounded-md"
            >
              Data Structure
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Damages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {formatCurrency(sampleData.totals.damageBPKR)}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Direct physical destruction of assets
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Economic Losses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {formatCurrency(sampleData.totals.lossBPKR)}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Changes in economic flows
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recovery Needs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(sampleData.totals.needsBPKR)}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Financing required for recovery
                </p>
              </CardContent>
            </Card>

            {/* Sector Breakdown */}
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Sector Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sampleData.sectors.map((sector, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {sector.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {sector.summary}
                      </p>
                      <Badge variant="outline">
                        {sector.damageValue.toFixed(2)} B PKR
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Quick Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">18</div>
                    <div className="text-sm text-gray-500">Districts Affected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">12,450</div>
                    <div className="text-sm text-gray-500">Houses Damaged</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">156</div>
                    <div className="text-sm text-gray-500">Fatalities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">342</div>
                    <div className="text-sm text-gray-500">Injuries</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'preview' && (
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
              <p className="text-sm text-gray-500">
                This is a preview of how the Annex III 2025 report will look when exported.
              </p>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-white">
                <AnnexIII2025Print data={sampleData} />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'data' && (
          <Card>
            <CardHeader>
              <CardTitle>Data Structure</CardTitle>
              <p className="text-sm text-gray-500">
                The underlying data structure used by the Annex III 2025 system.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Report Metadata</h4>
                  <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                    <div>Title: {sampleData.title}</div>
                    <div>Generated: {sampleData.generatedOn}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Regional Data</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border border-gray-300 px-3 py-2 text-left">Region</th>
                          <th className="border border-gray-300 px-3 py-2 text-right">Damages (B PKR)</th>
                          <th className="border border-gray-300 px-3 py-2 text-right">Loss (B PKR)</th>
                          <th className="border border-gray-300 px-3 py-2 text-right">Needs (B PKR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleData.tableRegionRows.map((row, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 px-3 py-2">{row.region}</td>
                            <td className="border border-gray-300 px-3 py-2 text-right">{row.damageBPKR.toFixed(2)}</td>
                            <td className="border border-gray-300 px-3 py-2 text-right">{row.lossBPKR.toFixed(2)}</td>
                            <td className="border border-gray-300 px-3 py-2 text-right">{row.needsBPKR.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Definitions</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {sampleData.notes.map((note, index) => (
                      <li key={index} className="text-gray-700">{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>This is a demonstration of the Annex III 2025 report system.</p>
          <p className="text-sm mt-2">
            Use the tabs above to explore different aspects of the system.
          </p>
        </div>
      </div>
    </div>
  );
}; 