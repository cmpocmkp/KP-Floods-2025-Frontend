import React, { useState } from 'react';
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

  const sampleData: AnnexIII2025Data = {
    title: "KP FLOODS 2025 IMPACT ASSESSMENT — Annex III",
    generatedOn: "15 January 2025",
    introText: "This report presents a comprehensive assessment of damages, losses, and needs resulting from the devastating floods that affected Khyber Pakhtunkhwa in 2025.",
    mapSpec: { bounds: [31.0, 69.0, 37.0, 74.0], center: [34.9526, 71.7340], zoom: 8, markers: [] },
    tableRegionRows: [{ region: "Khyber Pakhtunkhwa", damageBPKR: 245.97, lossBPKR: 172.4, needsBPKR: 204.36 }],
    totals: { damageBPKR: 245.97, lossBPKR: 172.4, needsBPKR: 204.36 },
    notes: ["Damages: direct physical destruction of assets and infrastructure", "Losses: changes in economic flows due to the disaster", "Needs: financing required for recovery and reconstruction"],
    sectors: [{ name: "Housing and Infrastructure", summary: "Significant damage to residential and commercial structures.", damageValue: 125.50 }],
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
      const response = await fetch('/api/reports/annex-iii-2025/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `annex-iii-2025-${new Date().toISOString().slice(0, 10)}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast({ title: "Export Successful", description: "PDF exported successfully", variant: "default" });
      }
    } catch (error) {
      toast({ title: "Export Failed", description: "Failed to export PDF", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToDOCX = async () => {
    if (!reportData) return;
    setIsExporting(true);
    try {
      const response = await fetch('/api/reports/annex-iii-2025/docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `annex-iii-2025-${new Date().toISOString().slice(0, 10)}.docx`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast({ title: "Export Successful", description: "DOCX exported successfully", variant: "default" });
      }
    } catch (error) {
      toast({ title: "Export Failed", description: "Failed to export DOCX", variant: "destructive" });
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
            Export Annex III 2025 Report
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

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Annex III 2025 Report Preview</DialogTitle>
            <p className="text-sm text-muted-foreground">
              This is a preview of the KP Floods 2025 Impact Assessment — Annex III report.
            </p>
          </DialogHeader>
          <div className="mt-4 overflow-x-auto overflow-y-auto max-h-[calc(95vh-140px)]">
            {reportData && <AnnexIII2025Print data={reportData} />}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 