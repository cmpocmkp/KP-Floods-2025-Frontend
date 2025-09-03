import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileDown, Eye, FileText, FileSpreadsheet } from 'lucide-react';
import { AnnexIIIReport } from './AnnexIIIReport';
import { useReportData } from '@/adapters/reportData';
import { exportReportToPDF, exportReportToDOCX, getMapSnapshot } from '@/features/reports/export';
import { useToast } from '@/components/ui/use-toast';

export function ExportReportButtons() {
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [mapPng, setMapPng] = useState<string | undefined>();
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const reportData = useReportData();

  const generateFilename = (extension: string) => {
    const date = new Date().toISOString().slice(0, 10);
    return `flood-impact-${date}.${extension}`;
  };

  // Generate map snapshot when preview is opened
  const handlePreviewOpen = useCallback(async () => {
    try {
      const snapshot = await getMapSnapshot({
        center: [34.9526, 71.7340], // KP province center
        size: { width: 400, height: 250 }, // Much smaller size to prevent overflow
        dpi: 72 // Very low DPI for smaller file size
      });
      setMapPng(snapshot.png);
      setShowPreview(true);
    } catch (error) {
      console.warn('Failed to generate map snapshot:', error);
      setMapPng(undefined);
      setShowPreview(true);
    }
  }, []);

  const exportToPDF = useCallback(async () => {
    if (!reportRef.current || !reportData) return;
    
    setIsExporting(true);
    try {
      const filename = generateFilename('pdf');
      await exportReportToPDF(reportRef.current, filename, mapPng);
      toast({
        title: "Export Successful",
        description: `PDF exported as ${filename}`,
        variant: "default",
      });
    } catch (error) {
      console.error('PDF export failed:', error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to export PDF",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  }, [reportData, mapPng, toast]);

  const exportToDOCX = useCallback(async () => {
    if (!reportData) return;
    
    setIsExporting(true);
    try {
      const filename = generateFilename('docx');
      await exportReportToDOCX(reportData, filename, mapPng);
      toast({
        title: "Export Successful",
        description: `DOCX exported as ${filename}`,
        variant: "default",
      });
    } catch (error) {
      console.error('DOCX export failed:', error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to export DOCX",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  }, [reportData, mapPng, toast]);

  if (!reportData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Annex-Style Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Loading report data...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Annex-Style Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Generate a professional report in the style of "Annex III – Pakistan Floods 2022" 
            with current data from the system and interactive map visualization.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handlePreviewOpen}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview Report
            </Button>
            
            <Button
              onClick={exportToPDF}
              disabled={isExporting}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
            >
              <FileDown className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </Button>
            
            <Button
              onClick={exportToDOCX}
              disabled={isExporting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <FileSpreadsheet className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export DOCX'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Report Preview - Annex III Style</DialogTitle>
          </DialogHeader>
          <div 
            className="mt-4 overflow-x-auto overflow-y-auto max-h-[calc(90vh-120px)]"
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div 
              className="min-w-0 max-w-full"
              style={{
                maxWidth: '100%',
                overflow: 'hidden'
              }}
            >
              <AnnexIIIReport 
                ref={reportRef}
                data={reportData}
                mapPng={mapPng}
                data-modal="true"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 