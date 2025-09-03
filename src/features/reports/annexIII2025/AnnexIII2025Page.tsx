import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnnexIII2025Print } from './AnnexIII2025Print';
import { AnnexIII2025Data } from '../../../../server/services/annexIII2025';
import { getMapSnapshot } from '../../reports/export';

interface AnnexIII2025PageProps {
  className?: string;
}

export const AnnexIII2025Page: React.FC<AnnexIII2025PageProps> = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<AnnexIII2025Data | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Mock data for development - replace with actual API call
  const generateReportData = async (): Promise<AnnexIII2025Data> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate map snapshot
    const mapSnapshot = await getMapSnapshot({
      center: [34.9526, 71.7340], // KP center
      size: { width: 1200, height: 700 },
      dpi: 300,
    });

    return {
      title: "KP FLOODS 2025 IMPACT ASSESSMENT — Annex III",
      generatedOn: new Date().toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
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
  };

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      const data = await generateReportData();
      setReportData(data);
      setShowPreview(true);
    } catch (error) {
      console.error('Failed to generate report:', error);
      // Handle error - show toast notification
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!reportData) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/reports/annex-iii-2025/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `annex-iii-2025-report-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('PDF export failed:', error);
      // Handle error - show toast notification
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportDOCX = async () => {
    if (!reportData) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/reports/annex-iii-2025/docx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `annex-iii-2025-report-${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('DOCX export failed:', error);
      // Handle error - show toast notification
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      window.print();
    }
  };

  return (
    <div className={`annex-iii-2025-page ${className}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            KP Floods 2025 Impact Assessment — Annex III
          </h1>
          <p className="text-gray-600 text-lg">
            Generate comprehensive reports for damage, loss, and needs assessment following the Annex III format.
          </p>
        </div>

        {/* Control Panel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Report Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleGenerateReport}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Generating...' : 'Generate Report'}
              </Button>
              
              {reportData && (
                <>
                  <Button 
                    onClick={handleExportPDF}
                    disabled={isLoading}
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    Export PDF
                  </Button>
                  
                  <Button 
                    onClick={handleExportDOCX}
                    disabled={isLoading}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Export DOCX
                  </Button>
                  
                  <Button 
                    onClick={handlePrint}
                    disabled={isLoading}
                    variant="outline"
                    className="border-gray-600 text-gray-600 hover:bg-gray-50"
                  >
                    Print
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Report Preview */}
        {showPreview && reportData && (
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
              <p className="text-sm text-gray-500">
                This is a preview of the Annex III 2025 report. Use the export buttons above to download PDF or DOCX versions.
              </p>
            </CardHeader>
            <CardContent>
              <div ref={printRef}>
                <AnnexIII2025Print data={reportData} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {!showPreview && (
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">What is Annex III?</h3>
                  <p className="text-gray-600">
                    Annex III is a standardized format for reporting damage, loss, and needs assessments following major disasters. 
                    It provides a comprehensive framework for documenting the impact of floods and other natural hazards.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Report Contents</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Executive summary and introduction</li>
                    <li>Damage, loss, and needs by region</li>
                    <li>Sector-by-sector analysis</li>
                    <li>Vulnerable segments assessment</li>
                    <li>Government response overview</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Export Options</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li><strong>PDF:</strong> Print-ready A4 format with proper page breaks</li>
                    <li><strong>DOCX:</strong> Editable Word document for further customization</li>
                    <li><strong>Print:</strong> Direct browser printing with optimized layout</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <style jsx>{`
        .annex-iii-2025-page {
          min-height: 100vh;
          background-color: #f8fafc;
        }
        
        @media print {
          .annex-iii-2025-page {
            background-color: white;
          }
          
          .container {
            padding: 0;
            margin: 0;
          }
          
          .mb-8, .mb-4 {
            margin-bottom: 0 !important;
          }
          
          .py-8, .px-4 {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}; 