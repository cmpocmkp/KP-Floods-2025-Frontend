import React from 'react';
import { AnnexIII2025Data } from '../../../../server/services/annexIII2025';
import { DamageDonutChart } from './DamageDonutChart';

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
            ANNEXURE - III
          </h1>
          <h2 className="report-subtitle">
            {title}
          </h2>
        </div>
        
        <div className="intro-section">
          <p className="intro-text">
            {introText}
          </p>
        </div>
        
        <div className="section-rule"></div>
        
        <h2 className="section-title">
          Estimates of Damage and Loss Due to Flood 2025
        </h2>
        
        <p className="section-text">
          The damage is estimated at US${(totals.damageBPKR * 0.0036).toFixed(1)} billion, the loss to the GDP at US${(totals.lossBPKR * 0.0036).toFixed(1)} billion, and the total needs of rehabilitation at US${(totals.needsBPKR * 0.0036).toFixed(1)} billion. The sectors that suffered the most damage are housing at US${(sectors.find(s => s.name.includes('Housing'))?.damageValue * 0.0036 || 0).toFixed(1)} billion; agriculture, food, livestock, and fisheries at US${(sectors.find(s => s.name.includes('Agriculture'))?.damageValue * 0.0036 || 0).toFixed(1)} billion; and transport and communications at US${(sectors.find(s => s.name.includes('Transport'))?.damageValue * 0.0036 || 0).toFixed(1)} billion.
        </p>
        
        <p className="section-text">
          Damage is defined as the direct costs of destroyed or damaged physical assets. It is valued in monetary terms, with costs estimated based on replacing or repairing physical assets and infrastructure, considering the replacement price prevailing before the crisis. Loss is defined as changes in economic flows resulting from the disaster and valued in monetary terms. Together, damage and loss constitute the effects of the crisis. Needs costing draws on the monetary value of damage and loss but is not equal to the sum of those estimates.
        </p>
        
        {/* Damage Breakdown Chart */}
        <div className="chart-section">
          <DamageDonutChart 
            data={[
              {
                name: "Housing",
                value: Math.round(sectors.find(s => s.name.includes('Housing'))?.damageValue * 3.6 || 0),
                percentage: ((sectors.find(s => s.name.includes('Housing'))?.damageValue || 0) / totals.damageBPKR) * 100,
                color: "#2E8B57"
              },
              {
                name: "Agriculture, Food, Livestock and Fisheries",
                value: Math.round(sectors.find(s => s.name.includes('Agriculture'))?.damageValue * 3.6 || 0),
                percentage: ((sectors.find(s => s.name.includes('Agriculture'))?.damageValue || 0) / totals.damageBPKR) * 100,
                color: "#4169E1"
              },
              {
                name: "Transport and Communications",
                value: Math.round(sectors.find(s => s.name.includes('Transport'))?.damageValue * 3.6 || 0),
                percentage: ((sectors.find(s => s.name.includes('Transport'))?.damageValue || 0) / totals.damageBPKR) * 100,
                color: "#FF8C00"
              },
              {
                name: "Health and Education",
                value: Math.round((totals.damageBPKR * 0.0477) * 3.6),
                percentage: 4.77,
                color: "#87CEEB"
              },
              {
                name: "Energy and Infrastructure",
                value: Math.round((totals.damageBPKR * 0.0385) * 3.6),
                percentage: 3.85,
                color: "#FFB6C1"
              },
              {
                name: "Other Sectors",
                value: Math.round((totals.damageBPKR * 0.0375) * 3.6),
                percentage: 3.75,
                color: "#708090"
              }
            ]}
            totalDamage={Math.round(totals.damageBPKR * 3.6)}
          />
        </div>
        
        {/* Map Section */}
        <div className="map-section">
          <h3 className="map-title">Affected Areas Map</h3>
          <div className="map-container">
            {/* Map will be rendered here */}
            <div className="map-placeholder">
              <p>Map visualization of affected areas in Khyber Pakhtunkhwa</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Page 2: Data Tables */}
      <div className="report-page" style={{ pageBreakBefore: 'always' }}>
        <div className="section-rule"></div>
        
        <h2 className="section-title">
          Table 1: Damage, Loss, and Needs by Region
        </h2>
        
        <table className="data-table">
          <thead>
            <tr>
              <th rowSpan={2}>Region</th>
              <th colSpan={2}>Damages</th>
              <th colSpan={2}>Loss</th>
              <th colSpan={2}>Needs</th>
            </tr>
            <tr>
              <th>(Billion PKR)</th>
              <th>(Million US$)</th>
              <th>(Billion PKR)</th>
              <th>(Million US$)</th>
              <th>(Billion PKR)</th>
              <th>(Million US$)</th>
            </tr>
          </thead>
          <tbody>
            {tableRegionRows.map((row, index) => (
              <tr key={index}>
                <td className="region-name">{row.region}</td>
                <td className="numeric-value">{row.damageBPKR.toFixed(2)}</td>
                <td className="numeric-value">{Math.round(row.damageBPKR * 3.6)}</td>
                <td className="numeric-value">{row.lossBPKR.toFixed(2)}</td>
                <td className="numeric-value">{Math.round(row.lossBPKR * 3.6)}</td>
                <td className="numeric-value">{row.needsBPKR.toFixed(2)}</td>
                <td className="numeric-value">{Math.round(row.needsBPKR * 3.6)}</td>
              </tr>
            ))}
            <tr className="totals-row">
              <td><strong>Grand Total</strong></td>
              <td className="numeric-value"><strong>{totals.damageBPKR.toFixed(2)}</strong></td>
              <td className="numeric-value"><strong>{Math.round(totals.damageBPKR * 3.6)}</strong></td>
              <td className="numeric-value"><strong>{totals.lossBPKR.toFixed(2)}</strong></td>
              <td className="numeric-value"><strong>{Math.round(totals.lossBPKR * 3.6)}</strong></td>
              <td className="numeric-value"><strong>{totals.needsBPKR.toFixed(2)}</strong></td>
              <td className="numeric-value"><strong>{Math.round(totals.needsBPKR * 3.6)}</strong></td>
            </tr>
          </tbody>
        </table>
        
        <div className="source-note">
          <strong>Source:</strong> KP Floods 2025 Impact Assessment
        </div>
        
        <div className="section-rule"></div>
        
        <h2 className="section-title">
          Damage, Loss, And Needs by Sector Group and Sector
        </h2>
        
        <div className="sectors-grid">
          <div className="sector-group">
            <h3 className="sector-group-title">PRODUCTIVE SECTORS</h3>
            <ul className="sector-list">
              <li>Agriculture, Food, Livestock and Fisheries</li>
              <li>Water Resources and Irrigation</li>
              <li>Commerce and Industries</li>
              <li>Finance and Markets</li>
              <li>Tourism</li>
            </ul>
          </div>
          
          <div className="sector-group">
            <h3 className="sector-group-title">SOCIAL SECTORS</h3>
            <ul className="sector-list">
              <li>Housing</li>
              <li>Health</li>
              <li>Education</li>
              <li>Culture and Heritage</li>
            </ul>
          </div>
          
          <div className="sector-group">
            <h3 className="sector-group-title">INFRASTRUCTURE SECTORS</h3>
            <ul className="sector-list">
              <li>Transport and Communications</li>
              <li>Energy</li>
              <li>Wash, Municipal Services and Community Infrastructure</li>
            </ul>
          </div>
          
          <div className="sector-group">
            <h3 className="sector-group-title">CROSS-CUTTING SECTORS</h3>
            <ul className="sector-list">
              <li>Governance</li>
              <li>Social Sustainability, Inclusion and Gender</li>
              <li>Social Protection, Livelihoods and Jobs</li>
              <li>Environment and Climate Change</li>
              <li>Disaster Risk Reduction and Resilience</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Page 3: Vulnerable Segments and Government Response */}
      <div className="report-page" style={{ pageBreakBefore: 'always' }}>
        <div className="section-rule"></div>
        
        <h2 className="section-title">
          National Response and Vulnerable Segment
        </h2>
        
        <div className="vulnerable-section">
          <p className="section-text">
            Vulnerable groups such as women, children, people with disabilities, and refugees are likely disproportionally affected by the floods, given their dire circumstances and limited access to social protection and coping mechanisms. The impact of the floods is likely to exacerbate already existing gender inequalities, revealing serious differences in safety, education, decision-making, and employment.
          </p>
          
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
          <p className="section-text">
            Government of Pakistan (including Provincial Governments) immediately launched rescue and relief operations which NDMA conducted at the federal level and relevant agencies at provincial level, assisted by Pakistan Armed Forces and various UN agencies in coordination with MoPD&SI.
          </p>
          
          <ul className="response-list">
            {responseNotes.map((item, index) => (
              <li key={index} className="response-item">{item}</li>
            ))}
          </ul>
        </div>
        
        <div className="section-rule"></div>
        
        <h2 className="section-title">
          Recovery and Reconstruction
        </h2>
        
        <p className="section-text">
          Finally, programs and policies to support recovery need to reach the worst affected geographic areas and all types of households. Livelihood assistance supports future income generation. Grants, especially for small holding farmers, could secure their survival while contributing to the future food supply.
        </p>
        
        <p className="section-text">
          International evidence suggests that labor-intensive construction works, such as cash-for-work schemes in infrastructure rehabilitation, will support livelihood restoration and income-generating opportunities. Such schemes should include technical facilitation and skills development on climate adaptation and resilience buildings.
        </p>
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
          max-height: 297mm;
          padding: 0;
          margin: 0;
          position: relative;
          page-break-after: always;
          page-break-inside: avoid;
          break-inside: avoid;
          overflow: hidden;
          box-sizing: border-box;
        }
        
        .report-page:last-child {
          page-break-after: auto;
          max-height: none;
        }
        
        /* Ensure proper page breaks */
        .report-page + .report-page {
          margin-top: 0;
          padding-top: 0;
        }
        
        /* Content height control */
        .report-page > * {
          max-width: 100%;
          box-sizing: border-box;
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
        
        .report-subtitle {
          font-size: 16pt;
          font-weight: bold;
          margin: 0;
          line-height: 1.2;
        }
        
        .intro-section {
          margin-bottom: 15mm;
          max-height: 80mm;
          overflow: hidden;
        }
        
        .intro-text {
          text-align: justify;
          margin: 0 0 6mm 0;
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
        
        .section-text {
          text-align: justify;
          margin: 0 0 4mm 0;
          line-height: 1.4;
        }
        
        .chart-section {
          text-align: center;
          margin: 8mm 0 15mm 0;
          break-inside: avoid;
          page-break-inside: avoid;
          max-height: 120mm;
          overflow: hidden;
        }
        
        .map-section {
          margin: 15mm 0;
          break-inside: avoid;
          page-break-inside: avoid;
          max-height: 80mm;
          overflow: hidden;
        }
        
        .map-title {
          font-size: 12pt;
          font-weight: bold;
          margin: 0 0 6mm 0;
          text-align: center;
          color: #2a2a2a;
        }
        
        .map-container {
          border: 1px solid #ccc;
          padding: 8mm;
          background-color: #f9f9f9;
          text-align: center;
          min-height: 60mm;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .map-placeholder {
          color: #666;
          font-style: italic;
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
          text-align: center;
          vertical-align: top;
          font-size: 10pt;
        }
        
        .data-table th {
          background-color: #f5f5f5 !important;
          font-weight: bold;
          text-align: center;
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
        
        .source-note {
          text-align: right;
          font-size: 10pt;
          font-style: italic;
          margin-top: 4mm;
        }
        
        .sectors-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8mm;
          margin: 6mm 0;
        }
        
        .sector-group {
          break-inside: avoid;
        }
        
        .sector-group-title {
          font-size: 12pt;
          font-weight: bold;
          margin: 0 0 3mm 0;
          color: #2a2a2a;
          text-transform: uppercase;
        }
        
        .sector-list {
          list-style-type: none;
          margin: 0;
          padding: 0;
        }
        
        .sector-list li {
          margin-bottom: 2mm;
          line-height: 1.3;
          padding-left: 3mm;
          position: relative;
        }
        
        .sector-list li:before {
          content: "•";
          position: absolute;
          left: 0;
        }
        
        .vulnerable-section,
        .response-section {
          margin-top: 8mm;
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
          
          /* Force page breaks */
          .report-page {
            page-break-after: always;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          .report-page:last-child {
            page-break-after: auto;
          }
          
          /* Ensure chart and map don't break across pages */
          .chart-section,
          .map-section {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          /* Strict height control for print */
          .report-page {
            height: 297mm !important;
            max-height: 297mm !important;
            overflow: hidden !important;
          }
          
          .intro-section,
          .chart-section,
          .map-section {
            max-height: none !important;
            overflow: visible !important;
          }
        }
      `}</style>
    </div>
  );
}; 