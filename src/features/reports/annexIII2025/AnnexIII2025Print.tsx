import React from 'react';
import { AnnexIII2025Data } from '../../../../server/services/annexIII2025';

interface AnnexIII2025PrintProps {
  data: AnnexIII2025Data;
  className?: string;
}

export const AnnexIII2025Print: React.FC<AnnexIII2025PrintProps> = ({ 
  data, 
  className = '' 
}) => {
  const { 
    title, 
    generatedOn, 
    introText, 
    tableRegionRows, 
    totals, 
    notes, 
    sectors, 
    vulnerable, 
    responseNotes 
  } = data;

  return (
    <div className={`annex-iii-2025-print ${className}`}>
      {/* Page 1: Title and Introduction */}
      <div className="report-page">
        <div className="report-header">
          <h1 className="report-title">
            {title}
          </h1>
          <div className="generated-date">
            Generated on: {generatedOn}
          </div>
        </div>
        
        <div className="intro-section">
          <p className="intro-text">
            {introText}
          </p>
        </div>
        
        <div className="section-rule"></div>
        
        <h2 className="section-title">
          Damage, Loss, and Needs by Region
        </h2>
        
        <table className="data-table">
          <thead>
            <tr>
              <th>Region</th>
              <th>Damages (B PKR)</th>
              <th>Loss (B PKR)</th>
              <th>Needs (B PKR)</th>
            </tr>
          </thead>
          <tbody>
            {tableRegionRows.map((row, index) => (
              <tr key={index}>
                <td className="region-name">{row.region}</td>
                <td className="numeric-value">{row.damageBPKR.toFixed(2)}</td>
                <td className="numeric-value">{row.lossBPKR.toFixed(2)}</td>
                <td className="numeric-value">{row.needsBPKR.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="totals-row">
              <td><strong>Total</strong></td>
              <td className="numeric-value"><strong>{totals.damageBPKR.toFixed(2)}</strong></td>
              <td className="numeric-value"><strong>{totals.lossBPKR.toFixed(2)}</strong></td>
              <td className="numeric-value"><strong>{totals.needsBPKR.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
        
        <div className="notes-section">
          <h2 className="section-title">Definitions</h2>
          <ul className="notes-list">
            {notes.map((note, index) => (
              <li key={index} className="note-item">{note}</li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Page 2+: Sector Analysis and Additional Information */}
      <div className="report-page">
        <div className="section-rule"></div>
        
        <h2 className="section-title">
          Sector Analysis
        </h2>
        
        <div className="sectors-section">
          {sectors.map((sector, index) => (
            <div key={index} className="sector-item">
              <div className="sector-name">{sector.name}</div>
              <p className="sector-summary">{sector.summary}</p>
            </div>
          ))}
        </div>
        
        <div className="section-rule"></div>
        
        <h2 className="section-title">
          Vulnerable Segments
        </h2>
        
        <div className="vulnerable-section">
          <ul className="vulnerable-list">
            {vulnerable.map((item, index) => (
              <li key={index} className="vulnerable-item">{item}</li>
            ))}
          </ul>
        </div>
        
        <div className="section-rule"></div>
        
        <h2 className="section-title">
          Government Response
        </h2>
        
        <div className="response-section">
          <ul className="response-list">
            {responseNotes.map((item, index) => (
              <li key={index} className="response-item">{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .annex-iii-2025-print {
          font-family: "Times New Roman", "Noto Serif", serif;
          line-height: 1.35;
          font-size: 11pt;
          color: #000;
          margin: 0;
          padding: 0;
          background: white;
        }
        
        .report-page {
          min-height: 297mm;
          padding: 0;
          margin: 0;
          position: relative;
          page-break-after: always;
        }
        
        .report-page:last-child {
          page-break-after: auto;
        }
        
        .report-header {
          text-align: center;
          margin-bottom: 20mm;
          padding-top: 10mm;
        }
        
        .report-title {
          font-size: 18pt;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5pt;
          margin: 0 0 8mm 0;
          line-height: 1.2;
        }
        
        .generated-date {
          text-align: right;
          font-size: 10pt;
          color: #666;
          margin-bottom: 15mm;
        }
        
        .intro-section {
          margin-bottom: 15mm;
        }
        
        .intro-text {
          text-align: justify;
          margin: 0;
          line-height: 1.4;
        }
        
        .section-rule {
          border-top: 1px solid #2a2a2a;
          margin: 10mm 0 6mm 0;
        }
        
        .section-title {
          font-size: 14pt;
          font-weight: bold;
          margin: 0 0 6mm 0;
          color: #2a2a2a;
          break-after: avoid;
          break-inside: avoid;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin: 6mm 0 10mm 0;
          break-inside: avoid;
        }
        
        .data-table thead {
          display: table-header-group;
        }
        
        .data-table th,
        .data-table td {
          border: 1px solid #000;
          padding: 3mm 2mm;
          text-align: left;
          vertical-align: top;
        }
        
        .data-table th {
          background-color: #f5f5f5 !important;
          font-weight: bold;
          text-align: center;
          font-size: 10pt;
        }
        
        .data-table td {
          font-size: 10pt;
        }
        
        .data-table tbody tr {
          break-inside: avoid;
        }
        
        .region-name {
          font-weight: 500;
          text-align: left;
        }
        
        .numeric-value {
          text-align: right;
          font-family: "Courier New", monospace;
        }
        
        .totals-row {
          background-color: #f0f0f0;
          font-weight: bold;
        }
        
        .notes-section {
          margin-top: 8mm;
        }
        
        .notes-list {
          list-style-type: disc;
          margin: 0;
          padding-left: 6mm;
        }
        
        .note-item {
          margin-bottom: 2mm;
          line-height: 1.3;
          break-inside: avoid;
        }
        
        .sectors-section {
          margin-top: 10mm;
        }
        
        .sector-item {
          margin-bottom: 6mm;
          break-inside: avoid;
        }
        
        .sector-name {
          font-weight: bold;
          font-size: 12pt;
          margin-bottom: 2mm;
          color: #2a2a2a;
        }
        
        .sector-summary {
          margin: 0;
          line-height: 1.4;
        }
        
        .vulnerable-section,
        .response-section {
          margin-top: 10mm;
        }
        
        .vulnerable-list,
        .response-list {
          list-style-type: disc;
          margin: 0;
          padding-left: 6mm;
        }
        
        .vulnerable-item,
        .response-item {
          margin-bottom: 2mm;
          line-height: 1.3;
        }
        
        /* Print-specific styles */
        @media print {
          @page {
            size: A4;
            margin: 18mm 18mm 20mm 18mm;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .annex-iii-2025-print {
            background: white;
          }
        }
      `}</style>
    </div>
  );
}; 