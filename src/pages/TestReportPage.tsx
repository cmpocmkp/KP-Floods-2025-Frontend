import React from 'react';
import { ExportReportButtons } from '@/components/reports/ExportReportButtons';

const TestReportPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">KP Floods 2025 Report Export Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Annex III 2025 Impact Assessment</h2>
          <p className="text-gray-600 mb-6">
            This page demonstrates the working PDF and DOCX export functionality for the 
            KP Floods 2025 Impact Assessment — Annex III report.
          </p>
          
          <ExportReportButtons />
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
            <ol className="list-decimal list-inside text-blue-700 space-y-1 text-sm">
              <li>Click "Preview Report" to load the report data</li>
              <li>Click "Export PDF" to generate a PDF (opens print dialog)</li>
              <li>Click "Export DOCX" to preview the Word document format</li>
              <li>Use browser print functionality to save as PDF</li>
            </ol>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Features:</h3>
            <ul className="list-disc list-inside text-green-700 space-y-1 text-sm">
              <li>Professional Annex III format matching Pakistan Floods 2022 structure</li>
              <li>Complete damage, loss, and needs tables with PKR and USD values</li>
              <li>Sector breakdown and vulnerable segments analysis</li>
              <li>Government response documentation</li>
              <li>Print-optimized layout for A4 paper</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestReportPage; 