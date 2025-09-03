import React from 'react';
import { DamageDonutChart } from './DamageDonutChart';

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

interface AnnexIII2025PrintProps {
  data: AnnexIII2025Data;
}

export const AnnexIII2025Print: React.FC<AnnexIII2025PrintProps> = ({ data }) => {
  // Sample data for demonstration - replace with actual data
  const sampleData = {
            title: "KPD3 IMPACT ASSESSMENT — Annex III",
    generatedOn: "15 January 2025",
    introText: "The 2025 floods have shown Khyber Pakhtunkhwa's high vulnerability to climate change despite contributing less than one percent of global greenhouse gas emissions. This disaster has demonstrated what this vulnerability looks like for the people of the province. Since July 2025, the provincial authorities have been working tirelessly to manage the ongoing massive relief efforts across KP, together with local, national, and international partners.",
    mapPng: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    tableRegionRows: [
      {
        region: "Khyber Pakhtunkhwa",
        damageBPKR: 245.0,
        lossBPKR: 172.4,
        needsBPKR: 204.4,
        damageUSD: 935,
        lossUSD: 658,
        needsUSD: 780
      }
    ],
    totals: {
      damageBPKR: 245.0,
      lossBPKR: 172.4,
      needsBPKR: 204.4,
      damageUSD: 935,
      lossUSD: 658,
      needsUSD: 780
    },
    notes: [
      "Damages: direct physical destruction of assets and infrastructure",
      "Losses: changes in economic flows resulting from the disaster",
      "Needs: financing required for recovery and reconstruction"
    ],
    sectors: [
      { name: "Housing", summary: "US$2.8 billion in reconstruction needs" },
      { name: "Agriculture, Food, Livestock and Fisheries", summary: "US$4.0 billion in recovery needs" },
      { name: "Transport and Communications", summary: "US$5.0 billion in reconstruction needs" }
    ],
    vulnerable: [
      "Women, children, people with disabilities disproportionately affected",
      "Limited access to social protection and coping mechanisms",
      "Increased vulnerability to gender-based violence",
      "Over 800,000 Afghan refugees in affected districts"
    ],
    responseNotes: [
      "Provincial government immediately launched rescue and relief operations",
      "Over 20,000 security personnel deployed in relief operations",
      "Medical camps established across affected areas",
      "Comprehensive health plan implemented with international support"
    ]
  };

  const reportData = data || sampleData;

  return (
    <div className="annex-iii-print">
      {/* Header */}
      <div className="report-header">
        <p className="annex-label">ANNEXURE - III</p>
        <h1 className="report-title">{reportData.title}</h1>
      </div>

      {/* Introduction */}
      <div className="report-intro">
        <p>{reportData.introText}</p>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <img 
          src={reportData.mapPng} 
          alt="Affected Areas Map" 
          className="map-image"
        />
        <p className="map-caption">Figure 1: Affected Areas in Khyber Pakhtunkhwa</p>
      </div>

      {/* Damage and Loss Estimates */}
      <div className="estimates-section">
        <h2>Estimates of Damage and Loss Due to Flood 2025</h2>
        <p>
          The damage is estimated at US${reportData.totals.damageUSD} million, the loss to the GDP at US${reportData.totals.lossUSD} million, 
          and the total needs of rehabilitation at US${reportData.totals.needsUSD} million. The sectors that suffered the most damage 
          include housing, agriculture, food, livestock, and fisheries, and transport and communications.
        </p>
      </div>

      {/* Definitions */}
      <div className="definitions-section">
        <p>
          <strong>Damage</strong> is defined as the direct costs of destroyed or damaged physical assets. 
          It is valued in monetary terms, with costs estimated based on replacing or repairing physical assets 
          and infrastructure, considering the replacement price prevailing before the crisis.
        </p>
        <p>
          <strong>Loss</strong> is defined as changes in economic flows resulting from the disaster and valued in monetary terms. 
          Together, damage and loss constitute the effects of the crisis.
        </p>
        <p>
          <strong>Needs</strong> costing draws on the monetary value of damage and loss but is not equal to the sum of those estimates.
        </p>
      </div>

      {/* Damage Table */}
      <div className="table-section">
        <h2>Table 1: Damage, Loss, and Needs by Region</h2>
        <table className="damage-table">
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
            {reportData.tableRegionRows.map((row, index) => (
              <tr key={index}>
                <td>{row.region}</td>
                <td className="text-right">{row.damageBPKR.toFixed(2)}</td>
                <td className="text-right">{row.damageUSD?.toLocaleString()}</td>
                <td className="text-right">{row.lossBPKR.toFixed(2)}</td>
                <td className="text-right">{row.lossUSD?.toLocaleString()}</td>
                <td className="text-right">{row.needsBPKR.toFixed(2)}</td>
                <td className="text-right">{row.needsUSD?.toLocaleString()}</td>
              </tr>
            ))}
            <tr className="totals-row">
              <td><strong>Total</strong></td>
              <td className="text-right"><strong>{reportData.totals.damageBPKR.toFixed(2)}</strong></td>
              <td className="text-right"><strong>{reportData.totals.damageUSD?.toLocaleString()}</strong></td>
              <td className="text-right"><strong>{reportData.totals.lossBPKR.toFixed(2)}</strong></td>
              <td className="text-right"><strong>{reportData.totals.lossUSD?.toLocaleString()}</strong></td>
              <td className="text-right"><strong>{reportData.totals.needsBPKR.toFixed(2)}</strong></td>
              <td className="text-right"><strong>{reportData.totals.needsUSD?.toLocaleString()}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sector Breakdown */}
      <div className="sectors-section">
        <h2>Damage, Loss, and Needs by Sector Group and Sector</h2>
        <div className="sectors-grid">
          <div className="sector-column">
            <h3>PRODUCTIVE SECTORS</h3>
            <ul>
              <li>Agriculture, Food, Livestock and Fisheries</li>
              <li>Water Resources and Irrigation</li>
              <li>Commerce and Industries</li>
              <li>Finance and Markets</li>
              <li>Tourism</li>
            </ul>
          </div>
          <div className="sector-column">
            <h3>CROSS-CUTTING SECTORS</h3>
            <ul>
              <li>Governance</li>
              <li>Social Sustainability, Inclusion and Gender</li>
              <li>Social Protection, Livelihoods and Jobs</li>
              <li>Environment and Climate Change</li>
              <li>Disaster Risk Reduction and Resilience</li>
            </ul>
          </div>
          <div className="sector-column">
            <h3>SOCIAL SECTORS</h3>
            <ul>
              <li>Housing</li>
              <li>Health</li>
              <li>Education</li>
              <li>Culture and Heritage</li>
            </ul>
          </div>
          <div className="sector-column">
            <h3>INFRASTRUCTURE SECTORS</h3>
            <ul>
              <li>Transport and Communications</li>
              <li>Energy</li>
              <li>WASH, Municipal Services and Community Infrastructure</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="chart-section">
        <h2>Damage Distribution by Sector</h2>
        <DamageDonutChart
          data={[
            { name: "Housing", value: 28, percentage: 28, color: "#FF6B6B" },
            { name: "Agriculture", value: 37, percentage: 37, color: "#4ECDC4" },
            { name: "Transport", value: 33, percentage: 33, color: "#45B7D1" },
            { name: "Other", value: 2, percentage: 2, color: "#96CEB4" }
          ]}
          totalDamage={100}
          className="damage-chart"
        />
      </div>

      {/* Vulnerable Segments */}
      <div className="vulnerable-section">
        <h2>National Response and Vulnerable Segments</h2>
        <p>
          Vulnerable groups such as women, children, people with disabilities, and refugees are likely 
          disproportionally affected by the floods, given their dire circumstances and limited access to 
          social protection and coping mechanisms.
        </p>
        <ul>
          {reportData.vulnerable.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Government Response */}
      <div className="response-section">
        <h2>Government Response</h2>
        <p>
          The Government of Khyber Pakhtunkhwa (including relevant agencies) immediately launched 
          rescue and relief operations, assisted by Pakistan Armed Forces and various UN agencies.
        </p>
        <ul>
          {reportData.responseNotes.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="report-footer">
        <p>Generated on: {reportData.generatedOn}</p>
        <p>Source: KPD3 Impact Assessment</p>
      </div>

      <style jsx>{`
        .annex-iii-print {
          font-family: 'Times New Roman', serif;
          line-height: 1.6;
          color: #000;
          max-width: 210mm;
          margin: 0 auto;
          padding: 20mm;
          background: white;
        }

        .report-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .annex-label {
          font-size: 14pt;
          font-weight: bold;
          margin: 0;
          padding: 7pt 0 3pt 0;
        }

        .report-title {
          font-size: 26pt;
          font-weight: bold;
          margin: 0;
          padding: 3pt 0;
        }

        .report-intro {
          text-align: justify;
          margin-bottom: 20px;
        }

        .map-section {
          text-align: center;
          margin: 20px 0;
        }

        .map-image {
          max-width: 100%;
          height: auto;
          border: 1px solid #ccc;
        }

        .map-caption {
          font-style: italic;
          margin-top: 10px;
        }

        .estimates-section h2 {
          font-size: 14pt;
          font-weight: bold;
          margin: 20px 0 10px 0;
        }

        .definitions-section {
          margin: 20px 0;
        }

        .definitions-section p {
          margin: 10px 0;
        }

        .table-section {
          margin: 20px 0;
        }

        .table-section h2 {
          font-size: 14pt;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .damage-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10pt;
        }

        .damage-table th,
        .damage-table td {
          border: 1px solid #000;
          padding: 8px;
          text-align: center;
        }

        .damage-table th {
          background-color: #f0f0f0;
          font-weight: bold;
        }

        .text-right {
          text-align: right;
        }

        .totals-row {
          background-color: #f9f9f9;
          font-weight: bold;
        }

        .sectors-section {
          margin: 20px 0;
        }

        .sectors-section h2 {
          font-size: 14pt;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .sectors-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .sector-column h3 {
          font-size: 12pt;
          font-weight: bold;
          margin-bottom: 10px;
          color: #4F81BC;
        }

        .sector-column ul {
          list-style: none;
          padding: 0;
        }

        .sector-column li {
          margin: 5px 0;
          padding-left: 20px;
          position: relative;
        }

        .sector-column li:before {
          content: "◆";
          color: #4F81BC;
          position: absolute;
          left: 0;
        }

        .chart-section {
          margin: 20px 0;
          text-align: center;
        }

        .chart-section h2 {
          font-size: 14pt;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .vulnerable-section,
        .response-section {
          margin: 20px 0;
        }

        .vulnerable-section h2,
        .response-section h2 {
          font-size: 14pt;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .vulnerable-section ul,
        .response-section ul {
          padding-left: 20px;
        }

        .vulnerable-section li,
        .response-section li {
          margin: 8px 0;
        }

        .report-footer {
          margin-top: 30px;
          text-align: center;
          font-size: 10pt;
          color: #666;
        }

        @media print {
          .annex-iii-print {
            padding: 0;
            margin: 0;
          }
          
          .damage-table thead {
            display: table-header-group;
          }
          
          .damage-table tfoot {
            display: table-footer-group;
          }
        }
      `}</style>
    </div>
  );
}; 