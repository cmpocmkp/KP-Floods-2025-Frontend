import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Download, FileText, Eye, Printer } from 'lucide-react';

interface AnnexIII2025Data {
  title: string;
  generatedOn: string;
  introText: string;
  mapPng: string;
  tableRegionRows: Array<{
    region: string;
    damageBPKR: number;
    lossBPKR: number;
    needsBPKR: number;
    damageUSD?: number;
    lossUSD?: number;
    needsUSD?: number;
  }>;
  totals: {
    damageBPKR: number;
    lossBPKR: number;
    needsBPKR: number;
    damageUSD?: number;
    lossUSD?: number;
    needsUSD?: number;
  };
  notes: string[];
  sectors: Array<{
    name: string;
    summary: string;
  }>;
  vulnerable: string[];
  responseNotes: string[];
}

export const ExportReportButtons: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportData, setReportData] = useState<AnnexIII2025Data | null>(null);

  const getBaseUrl = () => {
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3001';
    }
    return '';
  };

  useEffect(() => {
    // Set data-modal-open attribute for CSS targeting
    if (isModalOpen) {
      document.body.setAttribute('data-modal-open', 'true');
    } else {
      document.body.removeAttribute('data-modal-open');
    }

    return () => {
      document.body.removeAttribute('data-modal-open');
    };
  }, [isModalOpen]);

  const exportToPDF = async () => {
    if (!reportData) return;
    setIsExporting(true);
    try {
      console.log('Exporting PDF with data:', reportData);
      const response = await fetch(`${getBaseUrl()}/api/reports/annex-iii-2025/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });

      console.log('PDF response status:', response.status);

      if (response.ok) {
        const html = await response.text();
        
        // Create a new window with the HTML content
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          
          // Wait for content to load then print
          printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
          };
        }
        
        toast({ title: "Export Successful", description: "PDF generation initiated", variant: "default" });
      } else {
        const errorText = await response.text();
        console.error('PDF export failed:', response.status, errorText);
        toast({
          title: "Export Failed",
          description: `PDF export failed: ${response.status} - ${errorText}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Export Failed",
        description: `PDF export error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToDOCX = async () => {
    if (!reportData) return;
    setIsExporting(true);
    try {
      console.log('Exporting DOCX with data:', reportData);
      const response = await fetch(`${getBaseUrl()}/api/reports/annex-iii-2025/docx`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });

      console.log('DOCX response status:', response.status);

      if (response.ok) {
        const html = await response.text();
        
        // Create a new window with the HTML content for DOCX preview
        const docxWindow = window.open('', '_blank');
        if (docxWindow) {
          docxWindow.document.write(html);
          docxWindow.document.close();
        }
        
        toast({ title: "Export Successful", description: "DOCX preview opened", variant: "default" });
      } else {
        const errorText = await response.text();
        console.error('DOCX export failed:', response.status, errorText);
        toast({
          title: "Export Failed",
          description: `DOCX export failed: ${response.status} - ${errorText}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('DOCX export error:', error);
      toast({
        title: "Export Failed",
        description: `DOCX export error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const previewReport = async () => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/reports/annex-iii-2025/data`);
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
        setIsModalOpen(true);
      } else {
        toast({
          title: "Preview Failed",
          description: "Could not load report data",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Preview Failed",
        description: "Error loading report data",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={previewReport}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          Preview Report
        </Button>
        
        <Button
          onClick={exportToPDF}
          disabled={isExporting || !reportData}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
        >
          <Printer className="h-4 w-4" />
          {isExporting ? 'Generating...' : 'Export PDF'}
        </Button>
        
        <Button
          onClick={exportToDOCX}
          disabled={isExporting || !reportData}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <FileText className="h-4 w-4" />
          {isExporting ? 'Generating...' : 'Export DOCX'}
        </Button>
      </div>

      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 className="text-xl font-semibold">KPD3 Impact Assessment — Annex III</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {reportData && (
                <div className="prose max-w-none">
                  <div className="text-center mb-6">
                    <p className="text-sm font-bold text-gray-600">ANNEXURE - III</p>
                    <h1 className="text-2xl font-bold">{reportData.title}</h1>
                  </div>
                  
                  <p className="text-justify mb-4">{reportData.introText}</p>
                  
                  <h2 className="text-lg font-bold mb-3">Table 1: Damage, Loss, and Needs by Region</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2" rowSpan={2}>Region</th>
                          <th className="border border-gray-300 p-2" colSpan={2}>Damages</th>
                          <th className="border border-gray-300 p-2" colSpan={2}>Loss</th>
                          <th className="border border-gray-300 p-2" colSpan={2}>Needs</th>
                        </tr>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2">(B PKR)</th>
                          <th className="border border-gray-300 p-2">(Million US$)</th>
                          <th className="border border-gray-300 p-2">(B PKR)</th>
                          <th className="border border-gray-300 p-2">(Million US$)</th>
                          <th className="border border-gray-300 p-2">(B PKR)</th>
                          <th className="border border-gray-300 p-2">(Million US$)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.tableRegionRows.map((row, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 p-2">{row.region}</td>
                            <td className="border border-gray-300 p-2 text-right">{row.damageBPKR.toFixed(2)}</td>
                            <td className="border border-gray-300 p-2 text-right">{row.damageUSD?.toLocaleString()}</td>
                            <td className="border border-gray-300 p-2 text-right">{row.lossBPKR.toFixed(2)}</td>
                            <td className="border border-gray-300 p-2 text-right">{row.lossUSD?.toLocaleString()}</td>
                            <td className="border border-gray-300 p-2 text-right">{row.needsBPKR.toFixed(2)}</td>
                            <td className="border border-gray-300 p-2 text-right">{row.needsUSD?.toLocaleString()}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 font-bold">
                          <td className="border border-gray-300 p-2">Total</td>
                          <td className="border border-gray-300 p-2 text-right">{reportData.totals.damageBPKR.toFixed(2)}</td>
                          <td className="border border-gray-300 p-2 text-right">{reportData.totals.damageUSD?.toLocaleString()}</td>
                          <td className="border border-gray-300 p-2 text-right">{reportData.totals.lossBPKR.toFixed(2)}</td>
                          <td className="border border-gray-300 p-2 text-right">{reportData.totals.lossUSD?.toLocaleString()}</td>
                          <td className="border border-gray-300 p-2 text-right">{reportData.totals.needsBPKR.toFixed(2)}</td>
                          <td className="border border-gray-300 p-2 text-right">{reportData.totals.needsUSD?.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6 text-sm text-gray-600">
                    <p><strong>Generated on:</strong> {reportData.generatedOn}</p>
                    <p><strong>Source:</strong> KPD3 Impact Assessment</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 