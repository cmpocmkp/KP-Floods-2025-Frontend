import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileDown, Eye, FileText, FileSpreadsheet } from 'lucide-react';
import { AnnexIII2025Print } from '@/features/reports/annexIII2025';
import { useToast } from '@/components/ui/use-toast';

interface AnnexIII2025Data {
  title: string;
  generatedOn: string;
  introText: string;
  mapSpec: {
    bounds: [number, number, number, number];
    center: [number, number];
    zoom: number;
    markers: Array<{ lat: number; lng: number; severity: string }>;
  };
  tableRegionRows: Array<{
    region: string;
    damageBPKR: number;
    lossBPKR: number;
    needsBPKR: number;
  }>;
  totals: {
    damageBPKR: number;
    lossBPKR: number;
    needsBPKR: number;
  };
  notes: string[];
  sectors: Array<{
    name: string;
    summary: string;
    damageValue: number;
  }>;
  vulnerable: string[];
  responseNotes: string[];
}

export function ExportReportButtons() {
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [reportData, setReportData] = useState<AnnexIII2025Data | null>(null);
  const { toast } = useToast();
  
  // Get the base URL for API calls
  const getBaseUrl = () => {
    // In development, use localhost:3001, in production use relative URLs
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3001';
    }
    return '';
  };

  // Set body attribute when modal is open to help with CSS targeting
  useEffect(() => {
    if (showPreview) {
      document.body.setAttribute('data-modal-open', 'true');
    } else {
      document.body.removeAttribute('data-modal-open');
    }
    
    return () => {
      document.body.removeAttribute('data-modal-open');
    };
  }, [showPreview]);

  const sampleData: AnnexIII2025Data = {
    title: "KP FLOODS 2025 IMPACT ASSESSMENT — Annex III",
    generatedOn: "15 January 2025",
    introText: "This report presents a comprehensive assessment of damages, losses, and needs resulting from the devastating floods that affected Khyber Pakhtunkhwa in 2025.",
    mapSpec: { bounds: [31.0, 69.0, 37.0, 74.0], center: [34.9526, 71.7340], zoom: 8, markers: [] },
    tableRegionRows: [{ region: "Khyber Pakhtunkhwa", damageBPKR: 245.97, lossBPKR: 172.4, needsBPKR: 204.36 }],
    totals: { damageBPKR: 245.97, lossBPKR: 172.4, needsBPKR: 204.36 },
    notes: ["Damages: direct physical destruction of assets and infrastructure", "Losses: changes in economic flows due to the disaster", "Needs: financing required for recovery and reconstruction"],
          sectors: [
        { name: "Housing and Infrastructure", summary: "Significant damage to residential and commercial structures.", damageValue: 125.50 },
        { name: "Agriculture and Livestock", summary: "Extensive crop damage and livestock losses affecting food security.", damageValue: 89.25 },
        { name: "Transport and Communications", summary: "Major damage to roads, bridges, and communication infrastructure.", damageValue: 75.30 },
        { name: "Health and Education", summary: "Damage to healthcare facilities and educational institutions.", damageValue: 25.40 },
        { name: "Energy and Power", summary: "Disruption to power generation and distribution systems.", damageValue: 20.80 },
        { name: "Water and Sanitation", summary: "Damage to water supply and sanitation infrastructure.", damageValue: 15.72 }
      ],
    vulnerable: ["Human casualties: 156 deaths and 342 injuries reported."],
    responseNotes: ["Compensation disbursed: 172.40 billion PKR allocated for immediate relief."]
  };

  const handlePreviewOpen = () => {
    setReportData(sampleData);
    setShowPreview(true);
  };

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
      console.log('PDF response headers:', response.headers);
      
      if (response.ok) {
        const blob = await response.blob();
        console.log('PDF blob size:', blob.size);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `annex-iii-2025-${new Date().toISOString().slice(0, 10)}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast({ title: "Export Successful", description: "PDF exported successfully", variant: "default" });
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
      console.log('DOCX response headers:', response.headers);
      
      if (response.ok) {
        const blob = await response.blob();
        console.log('DOCX blob size:', blob.size);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `annex-iii-2025-${new Date().toISOString().slice(0, 10)}.docx`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast({ title: "Export Successful", description: "DOCX exported successfully", variant: "default" });
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Flood 2025 Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button onClick={handlePreviewOpen} variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview Report
            </Button>
            <Button onClick={exportToPDF} disabled={isExporting || !reportData} className="flex items-center gap-2 bg-red-600 hover:bg-red-700">
              <FileDown className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </Button>
            <Button onClick={exportToDOCX} disabled={isExporting || !reportData} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <FileSpreadsheet className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export DOCX'}
            </Button>
          </div>
          {!reportData && (
            <p className="text-sm text-muted-foreground">
              Click "Preview Report" to generate the Annex III 2025 report data first.
            </p>
          )}
        </CardContent>
      </Card>

      {showPreview && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPreview(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-2xl max-w-6xl w-[95vw] max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold">Annex III 2025 Report Preview</h2>
                <p className="text-sm text-muted-foreground">
                  This is a preview of the KP Floods 2025 Impact Assessment — Annex III report.
                </p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
              {reportData ? (
                <AnnexIII2025Print data={reportData} />
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p>No report data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 