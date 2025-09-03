const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../dist')));

// Enhanced sample report data for KP Floods 2025
const sampleReportData = {
  title: "KP FLOODS 2025 IMPACT ASSESSMENT",
  subtitle: "ANNEXURE - III",
  source: "Khyber Pakhtunkhwa Economic Survey 2025-26",
  generatedOn: "15 January 2025",
  introText: "The 2025 floods have shown Khyber Pakhtunkhwa's high vulnerability to climate change despite contributing less than one percent of global greenhouse gas emissions. This disaster has demonstrated what this vulnerability looks like for the people of the province. Since July 2025, the provincial authorities have been working tirelessly to manage the ongoing massive relief efforts across KP, together with local, national, and international partners.",
  keyStats: {
    totalDamage: 245,
    totalLoss: 172.4,
    totalNeeds: 204.4,
    damageUSD: 935,
    lossUSD: 658,
    needsUSD: 780
  },
  mapPng: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  tableRegionRows: [
    {
      region: "Khyber Pakhtunkhwa",
      damageBPKR: 245,
      lossBPKR: 172.4,
      needsBPKR: 204.4,
      damageUSD: 935,
      lossUSD: 658,
      needsUSD: 780
    }
  ],
  totals: {
    damageBPKR: 245,
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
    {
      name: "Housing",
      damageUSD: 2.8,
      needsUSD: 3.2
    },
    {
      name: "Agriculture, Food, Livestock and Fisheries",
      damageUSD: 3.7,
      needsUSD: 4.0
    },
    {
      name: "Transport and Communications",
      damageUSD: 3.3,
      needsUSD: 5.0
    },
    {
      name: "Other Sectors",
      damageUSD: 2.3,
      needsUSD: 4.5
    }
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

// Routes
app.get('/api/reports/annex-iii-2025/data', (req, res) => {
  res.json(sampleReportData);
});

app.get('/api/reports/annex-iii-2025/preview', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Enhanced PDF generation endpoint with beautiful HTML template
app.post('/api/reports/annex-iii-2025/pdf', (req, res) => {
  const reportData = req.body || sampleReportData;
  
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${reportData.title} - ${reportData.subtitle}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
      :root {
        --primary-blue: #1a5276;
        --secondary-blue: #3498db;
        --accent-blue: #5dade2;
        --earth-brown: #7d6608;
        --light-brown: #d4ac0d;
        --sand: #f9e79f;
        --dark-gray: #2c3e50;
        --light-gray: #ecf0f1;
        --white: #ffffff;
        --danger: #e74c3c;
        --warning: #f39c12;
        --success: #27ae60;
      }

      body {
        font-family: "Times New Roman", Times, serif;
        line-height: 1.6;
        margin: 0;
        padding: 20px;
        background: linear-gradient(135deg, #e0f7fa 0%, #bbdefb 100%);
        color: var(--dark-gray);
      }

      .document {
        max-width: 900px;
        margin: 0 auto;
        background-color: var(--white);
        padding: 40px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        border-radius: 8px;
      }

      .header {
        text-align: center;
        margin-bottom: 30px;
        border-bottom: 2px solid var(--primary-blue);
        padding-bottom: 20px;
      }

      h1 {
        font-size: 28px;
        margin: 0;
        font-weight: bold;
        color: var(--primary-blue);
      }

      h2 {
        font-size: 22px;
        margin-top: 30px;
        margin-bottom: 15px;
        font-weight: bold;
        color: var(--secondary-blue);
        border-left: 4px solid var(--secondary-blue);
        padding-left: 10px;
      }

      h3 {
        font-size: 18px;
        margin-top: 25px;
        margin-bottom: 10px;
        font-weight: bold;
        color: var(--earth-brown);
      }

      p {
        margin-bottom: 15px;
        text-align: justify;
      }

      .page-number {
        text-align: right;
        font-size: 14px;
        margin-top: 20px;
        color: var(--dark-gray);
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        font-size: 14px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        overflow: hidden;
      }

      th,
      td {
        border: 1px solid #ddd;
        padding: 12px;
        text-align: right;
      }

      th:first-child,
      td:first-child {
        text-align: left;
      }

      th {
        background-color: var(--secondary-blue);
        color: white;
        font-weight: bold;
      }

      tr:nth-child(even) {
        background-color: var(--light-gray);
      }

      .sector-groups {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 20px 0;
      }

      .sector-group {
        width: 48%;
        margin-bottom: 15px;
        background-color: var(--light-gray);
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .sector-group h4 {
        font-size: 16px;
        margin-top: 0;
        margin-bottom: 10px;
        font-weight: bold;
        text-decoration: underline;
        color: var(--primary-blue);
      }

      .sector-group ul {
        margin: 0;
        padding-left: 20px;
      }

      .sector-group li {
        margin-bottom: 5px;
      }

      .highlight {
        font-weight: bold;
        background-color: var(--sand);
      }

      .source {
        font-style: italic;
        text-align: right;
        font-size: 14px;
      }

      .chart-container {
        margin: 30px 0;
        padding: 20px;
        background-color: var(--white);
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .chart-title {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 15px;
        color: var(--primary-blue);
      }

      .chart-wrapper {
        position: relative;
        height: 300px;
        width: 100%;
      }

      .key-stat {
        display: flex;
        justify-content: space-around;
        margin: 20px 0;
        flex-wrap: wrap;
      }

      .stat-card {
        width: 30%;
        background: linear-gradient(
          135deg,
          var(--secondary-blue),
          var(--accent-blue)
        );
        color: white;
        padding: 15px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 15px;
      }

      .stat-value {
        font-size: 24px;
        font-weight: bold;
        margin: 5px 0;
      }

      .stat-label {
        font-size: 14px;
      }

      .stat-card.damage {
        background: linear-gradient(135deg, var(--danger), #e57373);
      }

      .stat-card.loss {
        background: linear-gradient(135deg, var(--warning), #ffb74d);
      }

      .stat-card.needs {
        background: linear-gradient(135deg, var(--success), #81c784);
      }

      @media print {
        body { background: white; }
        .document { box-shadow: none; }
        .chart-container { break-inside: avoid; }
        table { break-inside: avoid; }
      }
    </style>
  </head>
  <body>
    <div class="document">
      <div class="header">
        <h1>${reportData.title}</h1>
        <h2>${reportData.subtitle}</h2>
        <h3>${reportData.source}</h3>
      </div>

      <p>
        ${reportData.introText}
      </p>

      <p>
        The floods have disproportionately hit the poorest households in the
        poorest areas. Those areas of the province, where human development
        outcomes were lowest even before the floods have been hardest hit. As
        the province recovers from this terrible disaster, there is an
        opportunity to do things differently and create a better future,
        especially for areas that have not benefited from the development of the
        last two decades. Enhancing KP's resilience to shocks and stresses
        amidst climate change, especially for the poorest, by addressing the
        underlying drivers of vulnerability and building back better is
        essential for the province's future.
      </p>

      <h2>Estimates of Damage and Loss Due to Flood 2025</h2>

      <div class="key-stat">
        <div class="stat-card damage">
          <div class="stat-label">Total Damage</div>
          <div class="stat-value">$${(reportData.keyStats.damageUSD / 1000).toFixed(1)}B</div>
        </div>
        <div class="stat-card loss">
          <div class="stat-label">GDP Loss</div>
          <div class="stat-value">$${(reportData.keyStats.lossUSD / 1000).toFixed(1)}B</div>
        </div>
        <div class="stat-card needs">
          <div class="stat-label">Rehabilitation Needs</div>
          <div class="stat-value">$${(reportData.keyStats.needsUSD / 1000).toFixed(1)}B</div>
        </div>
      </div>

      <p>
        The damage is estimated at US$${reportData.keyStats.damageUSD} million, the loss to the GDP at
        US$${reportData.keyStats.lossUSD} million, and the total needs of rehabilitation at US$${reportData.keyStats.needsUSD}
        million. The sectors that suffered the most damage include housing, agriculture, food, livestock, and fisheries, and transport and communications. The transport and communications sector have the highest reconstruction and recovery needs, followed by agriculture, food, livestock, and fisheries, and housing.
      </p>

      <p>
        ${reportData.notes[0]}. ${reportData.notes[1]}. Together, damage and loss constitute the effects of the
        crisis. ${reportData.notes[2]}.
      </p>

      <div class="chart-container">
        <div class="chart-title">
          Sectoral Damage and Needs (in Million USD)
        </div>
        <div class="chart-wrapper">
          <canvas id="sectorChart"></canvas>
        </div>
      </div>

      <h2>Table 1: Damage, Loss, and Needs by Region</h2>

      <table>
        <thead>
          <tr>
            <th>Region</th>
            <th colspan="2">Damages</th>
            <th colspan="2">Loss</th>
            <th colspan="2">Needs</th>
          </tr>
          <tr>
            <th></th>
            <th>(Billion PKR)</th>
            <th>(Million US$)</th>
            <th>(Billion PKR)</th>
            <th>(Million US$)</th>
            <th>(Billion PKR)</th>
            <th>(Million US$)</th>
          </tr>
        </thead>
        <tbody>
          ${reportData.tableRegionRows.map(row => `
          <tr>
            <td>${row.region}</td>
            <td>${row.damageBPKR}</td>
            <td>${row.damageUSD}</td>
            <td>${row.lossBPKR}</td>
            <td>${row.lossUSD}</td>
            <td>${row.needsBPKR}</td>
            <td>${row.needsUSD}</td>
          </tr>
          `).join('')}
          <tr class="highlight">
            <td>Grand Total</td>
            <td>${reportData.totals.damageBPKR}</td>
            <td>${reportData.totals.damageUSD}</td>
            <td>${reportData.totals.lossBPKR}</td>
            <td>${reportData.totals.lossUSD}</td>
            <td>${reportData.totals.needsBPKR}</td>
            <td>${reportData.totals.needsUSD}</td>
          </tr>
        </tbody>
      </table>

      <div class="chart-container">
        <div class="chart-title">
          Regional Distribution of Damage (in Million USD)
        </div>
        <div class="chart-wrapper">
          <canvas id="regionChart"></canvas>
        </div>
      </div>

      <div class="source">Source: ${reportData.source}</div>

      <h2>Damage, Loss, And Needs by Sector Group and Sector</h2>

      <div class="sector-groups">
        <div class="sector-group">
          <h4>PRODUCTIVE SECTORS</h4>
          <ul>
            <li>Agriculture, Food, Livestock and Fisheries</li>
            <li>Water Resources and Irrigation</li>
            <li>Commerce and Industries</li>
            <li>Finance and Markets</li>
            <li>Tourism</li>
          </ul>
        </div>

        <div class="sector-group">
          <h4>CROSS-CUTTING SECTORS</h4>
          <ul>
            <li>Governance</li>
            <li>Social Sustainability, Inclusion and Gender</li>
            <li>Social Protection, Livelihoods and Jobs</li>
            <li>Environment and Climate Change</li>
            <li>Disaster Risk Reduction and Resilience</li>
          </ul>
        </div>

        <div class="sector-group">
          <h4>SOCIAL SECTORS</h4>
          <ul>
            <li>Housing</li>
            <li>Health</li>
            <li>Education</li>
            <li>Culture and Heritage</li>
          </ul>
        </div>

        <div class="sector-group">
          <h4>INFRASTRUCTURE SECTORS</h4>
          <ul>
            <li>Transport and Communications</li>
            <li>Energy</li>
            <li>Wash, Municipal Services and Community Infrastructure</li>
          </ul>
        </div>
      </div>

      <div class="page-number">${reportData.title}</div>

      <h2>Provincial Response and Vulnerable Segment</h2>

      <p>
        ${reportData.vulnerable[0]}. ${reportData.vulnerable[1]}. ${reportData.vulnerable[2]}. ${reportData.vulnerable[3]}.
      </p>

      <p>
        Furthermore, people with disabilities in the calamity-hit districts are often marginalized,
        economically disempowered, and face discrimination in education,
        employment, housing and transport, and other social services.
      </p>

      <p>
        Women in particular, have suffered notable losses to their livelihoods,
        particularly associated with agriculture and livestock, with attendant
        negative impacts on their economic empowerment and wellbeing. The floods
        have increased women's vulnerability to gender-based violence (GBV) due
        to aggravated household tensions, harassment, and abuse related to
        displacement and lack of secure infrastructure.
      </p>

      <p>
        ${reportData.responseNotes[0]}. ${reportData.responseNotes[1]}. ${reportData.responseNotes[2]}. ${reportData.responseNotes[3]}.
      </p>

      <p>
        Finally, programs and policies to support recovery need to reach the
        worst affected geographic areas and all types of households. Livelihood
        assistance supports future income generation. Grants, especially for
        small holding farmers, could secure their survival while contributing to
        the future food supply.
      </p>

      <div class="page-number">Generated: ${reportData.generatedOn}</div>
    </div>

    <script>
      // Sectoral Damage and Needs Chart
      const sectorCtx = document.getElementById("sectorChart").getContext("2d");
      const sectorChart = new Chart(sectorCtx, {
        type: "bar",
        data: {
          labels: [
            "Housing",
            "Agriculture, Food, Livestock & Fisheries",
            "Transport & Communications",
            "Other Sectors",
          ],
          datasets: [
            {
              label: "Damage (Million USD)",
              data: [${reportData.sectors.map(s => s.damageUSD).join(', ')}],
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              borderColor: "rgba(231, 76, 60, 1)",
              borderWidth: 1,
            },
            {
              label: "Reconstruction Needs (Million USD)",
              data: [${reportData.sectors.map(s => s.needsUSD).join(', ')}],
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              borderColor: "rgba(46, 204, 113, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Million USD",
              },
            },
          },
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: false,
            },
          },
        },
      });

      // Regional Distribution Chart
      const regionCtx = document.getElementById("regionChart").getContext("2d");
      const regionChart = new Chart(regionCtx, {
        type: "pie",
        data: {
          labels: [
            "Khyber Pakhtunkhwa"
          ],
          datasets: [
            {
              data: [${reportData.totals.damageUSD}],
              backgroundColor: [
                "rgba(52, 152, 219, 0.8)"
              ],
              borderColor: [
                "rgba(52, 152, 219, 1)"
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.label || "";
                  if (label) {
                    label += ": ";
                  }
                  label += context.formattedValue + " Million USD";
                  return label;
                },
              },
            },
          },
        },
      });

      // Auto-print after charts load
      window.onload = function() {
        setTimeout(() => {
          window.print();
        }, 1000);
      };
    </script>
  </body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Enhanced DOCX generation endpoint (returns HTML for now)
app.post('/api/reports/annex-iii-2025/docx', (req, res) => {
  const reportData = req.body || sampleReportData;
  
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${reportData.title} - ${reportData.subtitle} (DOCX Preview)</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
      /* Same CSS as PDF but optimized for screen viewing */
      :root {
        --primary-blue: #1a5276;
        --secondary-blue: #3498db;
        --accent-blue: #5dade2;
        --earth-brown: #7d6608;
        --light-brown: #d4ac0d;
        --sand: #f9e79f;
        --dark-gray: #2c3e50;
        --light-gray: #ecf0f1;
        --white: #ffffff;
        --danger: #e74c3c;
        --warning: #f39c12;
        --success: #27ae60;
      }

      body {
        font-family: "Times New Roman", Times, serif;
        line-height: 1.6;
        margin: 0;
        padding: 20px;
        background: linear-gradient(135deg, #e0f7fa 0%, #bbdefb 100%);
        color: var(--dark-gray);
      }

      .document {
        max-width: 900px;
        margin: 0 auto;
        background-color: var(--white);
        padding: 40px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        border-radius: 8px;
      }

      .header {
        text-align: center;
        margin-bottom: 30px;
        border-bottom: 2px solid var(--primary-blue);
        padding-bottom: 20px;
      }

      h1 {
        font-size: 28px;
        margin: 0;
        font-weight: bold;
        color: var(--primary-blue);
      }

      h2 {
        font-size: 22px;
        margin-top: 30px;
        margin-bottom: 15px;
        font-weight: bold;
        color: var(--secondary-blue);
        border-left: 4px solid var(--secondary-blue);
        padding-left: 10px;
      }

      h3 {
        font-size: 18px;
        margin-top: 25px;
        margin-bottom: 10px;
        font-weight: bold;
        color: var(--earth-brown);
      }

      p {
        margin-bottom: 15px;
        text-align: justify;
      }

      .page-number {
        text-align: right;
        font-size: 14px;
        margin-top: 20px;
        color: var(--dark-gray);
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        font-size: 14px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        overflow: hidden;
      }

      th,
      td {
        border: 1px solid #ddd;
        padding: 12px;
        text-align: right;
      }

      th:first-child,
      td:first-child {
        text-align: left;
      }

      th {
        background-color: var(--secondary-blue);
        color: white;
        font-weight: bold;
      }

      tr:nth-child(even) {
        background-color: var(--light-gray);
      }

      .sector-groups {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 20px 0;
      }

      .sector-group {
        width: 48%;
        margin-bottom: 15px;
        background-color: var(--light-gray);
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .sector-group h4 {
        font-size: 16px;
        margin-top: 0;
        margin-bottom: 10px;
        font-weight: bold;
        text-decoration: underline;
        color: var(--primary-blue);
      }

      .sector-group ul {
        margin: 0;
        padding-left: 20px;
      }

      .sector-group li {
        margin-bottom: 5px;
      }

      .highlight {
        font-weight: bold;
        background-color: var(--sand);
      }

      .source {
        font-style: italic;
        text-align: right;
        font-size: 14px;
      }

      .chart-container {
        margin: 30px 0;
        padding: 20px;
        background-color: var(--white);
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .chart-title {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 15px;
        color: var(--primary-blue);
      }

      .chart-wrapper {
        position: relative;
        height: 300px;
        width: 100%;
      }

      .key-stat {
        display: flex;
        justify-content: space-around;
        margin: 20px 0;
        flex-wrap: wrap;
      }

      .stat-card {
        width: 30%;
        background: linear-gradient(
          135deg,
          var(--secondary-blue),
          var(--accent-blue)
        );
        color: white;
        padding: 15px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 15px;
      }

      .stat-value {
        font-size: 24px;
        font-weight: bold;
        margin: 5px 0;
      }

      .stat-label {
        font-size: 14px;
      }

      .stat-card.damage {
        background: linear-gradient(135deg, var(--danger), #e57373);
      }

      .stat-card.loss {
        background: linear-gradient(135deg, var(--warning), #ffb74d);
      }

      .stat-card.needs {
        background: linear-gradient(135deg, var(--success), #81c784);
      }

      .docx-header {
        background: var(--primary-blue);
        color: white;
        padding: 20px;
        text-align: center;
        border-radius: 8px;
        margin-bottom: 20px;
      }

      .docx-header h1 {
        color: white;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div class="document">
      <div class="docx-header">
        <h1>📄 ${reportData.title} - ${reportData.subtitle}</h1>
        <p>This is a preview of the Word document format. Use browser print to save as PDF.</p>
      </div>

      <div class="header">
        <h1>${reportData.title}</h1>
        <h2>${reportData.subtitle}</h2>
        <h3>${reportData.source}</h3>
      </div>

      <p>
        ${reportData.introText}
      </p>

      <p>
        The floods have disproportionately hit the poorest households in the
        poorest areas. Those areas of the province, where human development
        outcomes were lowest even before the floods have been hardest hit. As
        the province recovers from this terrible disaster, there is an
        opportunity to do things differently and create a better future,
        especially for areas that have not benefited from the development of the
        last two decades. Enhancing KP's resilience to shocks and stresses
        amidst climate change, especially for the poorest, by addressing the
        underlying drivers of vulnerability and building back better is
        essential for the province's future.
      </p>

      <h2>Estimates of Damage and Loss Due to Flood 2025</h2>

      <div class="key-stat">
        <div class="stat-card damage">
          <div class="stat-label">Total Damage</div>
          <div class="stat-value">$${(reportData.keyStats.damageUSD / 1000).toFixed(1)}B</div>
        </div>
        <div class="stat-card loss">
          <div class="stat-label">GDP Loss</div>
          <div class="stat-value">$${(reportData.keyStats.lossUSD / 1000).toFixed(1)}B</div>
        </div>
        <div class="stat-card needs">
          <div class="stat-label">Rehabilitation Needs</div>
          <div class="stat-value">$${(reportData.keyStats.needsUSD / 1000).toFixed(1)}B</div>
        </div>
      </div>

      <p>
        The damage is estimated at US$${reportData.keyStats.damageUSD} million, the loss to the GDP at
        US$${reportData.keyStats.lossUSD} million, and the total needs of rehabilitation at US$${reportData.keyStats.needsUSD}
        million. The sectors that suffered the most damage include housing, agriculture, food, livestock, and fisheries, and transport and communications. The transport and communications sector have the highest reconstruction and recovery needs, followed by agriculture, food, livestock, and fisheries, and housing.
      </p>

      <p>
        ${reportData.notes[0]}. ${reportData.notes[1]}. Together, damage and loss constitute the effects of the
        crisis. ${reportData.notes[2]}.
      </p>

      <div class="chart-container">
        <div class="chart-title">
          Sectoral Damage and Needs (in Million USD)
        </div>
        <div class="chart-wrapper">
          <canvas id="sectorChart"></canvas>
        </div>
      </div>

      <h2>Table 1: Damage, Loss, and Needs by Region</h2>

      <table>
        <thead>
          <tr>
            <th>Region</th>
            <th colspan="2">Damages</th>
            <th colspan="2">Loss</th>
            <th colspan="2">Needs</th>
          </tr>
          <tr>
            <th></th>
            <th>(Billion PKR)</th>
            <th>(Million US$)</th>
            <th>(Billion PKR)</th>
            <th>(Million US$)</th>
            <th>(Billion PKR)</th>
            <th>(Million US$)</th>
          </tr>
        </thead>
        <tbody>
          ${reportData.tableRegionRows.map(row => `
          <tr>
            <td>${row.region}</td>
            <td>${row.damageBPKR}</td>
            <td>${row.damageUSD}</td>
            <td>${row.lossBPKR}</td>
            <td>${row.lossUSD}</td>
            <td>${row.needsBPKR}</td>
            <td>${row.needsUSD}</td>
          </tr>
          `).join('')}
          <tr class="highlight">
            <td>Grand Total</td>
            <td>${reportData.totals.damageBPKR}</td>
            <td>${reportData.totals.damageUSD}</td>
            <td>${reportData.totals.lossBPKR}</td>
            <td>${reportData.totals.lossUSD}</td>
            <td>${reportData.totals.needsBPKR}</td>
            <td>${reportData.totals.needsUSD}</td>
          </tr>
        </tbody>
      </table>

      <div class="chart-container">
        <div class="chart-title">
          Regional Distribution of Damage (in Million USD)
        </div>
        <div class="chart-wrapper">
          <canvas id="regionChart"></canvas>
        </div>
      </div>

      <div class="source">Source: ${reportData.source}</div>

      <h2>Damage, Loss, And Needs by Sector Group and Sector</h2>

      <div class="sector-groups">
        <div class="sector-group">
          <h4>PRODUCTIVE SECTORS</h4>
          <ul>
            <li>Agriculture, Food, Livestock and Fisheries</li>
            <li>Water Resources and Irrigation</li>
            <li>Commerce and Industries</li>
            <li>Finance and Markets</li>
            <li>Tourism</li>
          </ul>
        </div>

        <div class="sector-group">
          <h4>CROSS-CUTTING SECTORS</h4>
          <ul>
            <li>Governance</li>
            <li>Social Sustainability, Inclusion and Gender</li>
            <li>Social Protection, Livelihoods and Jobs</li>
            <li>Environment and Climate Change</li>
            <li>Disaster Risk Reduction and Resilience</li>
          </ul>
        </div>

        <div class="sector-group">
          <h4>SOCIAL SECTORS</h4>
          <ul>
            <li>Housing</li>
            <li>Health</li>
            <li>Education</li>
            <li>Culture and Heritage</li>
          </ul>
        </div>

        <div class="sector-group">
          <h4>INFRASTRUCTURE SECTORS</h4>
          <ul>
            <li>Transport and Communications</li>
            <li>Energy</li>
            <li>Wash, Municipal Services and Community Infrastructure</li>
          </ul>
        </div>
      </div>

      <div class="page-number">${reportData.title}</div>

      <h2>Provincial Response and Vulnerable Segment</h2>

      <p>
        ${reportData.vulnerable[0]}. ${reportData.vulnerable[1]}. ${reportData.vulnerable[2]}. ${reportData.vulnerable[3]}.
      </p>

      <p>
        Furthermore, people with disabilities in the calamity-hit districts are often marginalized,
        economically disempowered, and face discrimination in education,
        employment, housing and transport, and other social services.
      </p>

      <p>
        Women in particular, have suffered notable losses to their livelihoods,
        particularly associated with agriculture and livestock, with attendant
        negative impacts on their economic empowerment and wellbeing. The floods
        have increased women's vulnerability to gender-based violence (GBV) due
        to aggravated household tensions, harassment, and abuse related to
        displacement and lack of secure infrastructure.
      </p>

      <p>
        ${reportData.responseNotes[0]}. ${reportData.responseNotes[1]}. ${reportData.responseNotes[2]}. ${reportData.responseNotes[3]}.
      </p>

      <p>
        Finally, programs and policies to support recovery need to reach the
        worst affected geographic areas and all types of households. Livelihood
        assistance supports future income generation. Grants, especially for
        small holding farmers, could secure their survival while contributing to
        the future food supply.
      </p>

      <div class="page-number">Generated: ${reportData.generatedOn}</div>
    </div>

    <script>
      // Sectoral Damage and Needs Chart
      const sectorCtx = document.getElementById("sectorChart").getContext("2d");
      const sectorChart = new Chart(sectorCtx, {
        type: "bar",
        data: {
          labels: [
            "Housing",
            "Agriculture, Food, Livestock & Fisheries",
            "Transport & Communications",
            "Other Sectors",
          ],
          datasets: [
            {
              label: "Damage (Million USD)",
              data: [${reportData.sectors.map(s => s.damageUSD).join(', ')}],
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              borderColor: "rgba(231, 76, 60, 1)",
              borderWidth: 1,
            },
            {
              label: "Reconstruction Needs (Million USD)",
              data: [${reportData.sectors.map(s => s.needsUSD).join(', ')}],
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              borderColor: "rgba(46, 204, 113, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Million USD",
              },
            },
          },
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: false,
            },
          },
        },
      });

      // Regional Distribution Chart
      const regionCtx = document.getElementById("regionChart").getContext("2d");
      const regionChart = new Chart(regionCtx, {
        type: "pie",
        data: {
          labels: [
            "Khyber Pakhtunkhwa"
          ],
          datasets: [
            {
              data: [${reportData.totals.damageUSD}],
              backgroundColor: [
                "rgba(52, 152, 219, 0.8)"
              ],
              borderColor: [
                "rgba(52, 152, 219, 1)"
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.label || "";
                  if (label) {
                    label += ": ";
                  }
                  label += context.formattedValue + " Million USD";
                  return label;
                },
              },
            },
          },
        },
      });
    </script>
  </body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'KP Floods Reports Server is running'
  });
});

// Serve the main app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`KP Floods Reports Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Reports API: http://localhost:${PORT}/api/reports`);
}); 