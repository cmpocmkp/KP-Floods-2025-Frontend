import puppeteer from 'puppeteer';

export interface AnnexIIIPDFData {
  generatedOn: string;
  introText: string;
  mapPng?: string;
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
}

/**
 * Generate Annex III PDF report using Puppeteer
 * Renders a dedicated print page and generates PDF with proper A4 formatting
 */
export async function generateAnnexIIIPDF(data: AnnexIIIPDFData): Promise<Buffer> {
  let browser;
  
  try {
    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set viewport to A4 dimensions
    await page.setViewport({
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height in pixels at 96 DPI
      deviceScaleFactor: 1
    });

    // Generate HTML content for the report
    const htmlContent = generateReportHTML(data);
    
    // Set content and wait for any images to load
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Wait for any dynamic content to render
    await page.waitForTimeout(1000);

    // Generate PDF with A4 specifications
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '18mm',
        right: '18mm',
        bottom: '20mm',
        left: '18mm'
      },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>', // Empty header
      footerTemplate: `
        <div style="
          font-size: 10px; 
          color: #666; 
          text-align: center; 
          width: 100%; 
          padding: 5mm 0;
          border-top: 1px solid #ccc;
        ">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      `,
      preferCSSPageSize: true
    });

    return pdfBuffer;
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Generate HTML content for the Annex III report
 */
function generateReportHTML(data: AnnexIIIPDFData): string {
  const { generatedOn, introText, mapPng, tableRegionRows, totals, notes } = data;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Annex III Report</title>
      <style>
        @page {
          size: A4;
          margin: 18mm 18mm 20mm 18mm;
        }
        
        body {
          font-family: "Times New Roman", "Noto Serif", serif;
          line-height: 1.35;
          font-size: 11pt;
          color: #000;
          margin: 0;
          padding: 0;
        }
        
        .report-page {
          min-height: 297mm;
          padding: 0;
          margin: 0;
          position: relative;
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
        
        .map-section {
          text-align: center;
          margin-bottom: 15mm;
        }
        
        .map-image {
          width: 100%;
          max-height: 95mm;
          object-fit: contain;
          border: 1px solid #ccc;
          break-inside: avoid;
        }
        
        .map-caption {
          font-size: 10pt;
          font-weight: bold;
          margin-top: 3mm;
          text-align: center;
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
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin: 6mm 0 10mm 0;
          break-inside: avoid;
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
        
        .region-name {
          font-weight: 500;
          text-align: left;
        }
        
        .numeric-value {
          text-align: right;
          font-family: "Courier New", monospace;
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
        }
        
        /* Print-specific styles */
        @media print {
          .report-page {
            page-break-after: always;
          }
          
          .report-page:last-child {
            page-break-after: auto;
          }
          
          .data-table thead {
            display: table-header-group;
          }
          
          .data-table tbody tr {
            break-inside: avoid;
          }
          
          .section-title {
            break-after: avoid;
            break-inside: avoid;
          }
          
          .note-item {
            break-inside: avoid;
          }
          
          .map-image {
            break-inside: avoid;
            max-width: 100%;
            height: auto;
          }
        }
      </style>
    </head>
    <body>
      <!-- Page 1: Title and Introduction -->
      <div class="report-page">
        <div class="report-header">
          <h1 class="report-title">
            PAKISTAN FLOODS 2022 IMPACT ASSESSMENT — Annex III
          </h1>
          <div class="generated-date">
            Generated on: ${generatedOn}
          </div>
        </div>
        
        <div class="intro-section">
          <p class="intro-text">
            ${introText}
          </p>
        </div>
        
        ${mapPng ? `
          <div class="map-section">
            <img src="${mapPng}" alt="Affected Areas" class="map-image" />
            <div class="map-caption">Affected Areas</div>
          </div>
        ` : `
          <div class="map-section">
            <div style="width: 100%; height: 95mm; background-color: #f5f5f5; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; color: #666; font-style: italic;">
              Map data unavailable
            </div>
            <div class="map-caption">Affected Areas</div>
          </div>
        `}
      </div>
      
      <!-- Page 2+: Data Tables -->
      <div class="report-page">
        <div class="section-rule"></div>
        
        <h2 class="section-title">
          Damage, Loss, and Needs by Region
        </h2>
        
        <table class="data-table">
          <thead>
            <tr>
              <th>Region</th>
              <th>Damages (B PKR)</th>
              <th>Loss (B PKR)</th>
              <th>Needs (B PKR)</th>
            </tr>
          </thead>
          <tbody>
            ${tableRegionRows.map(row => `
              <tr>
                <td class="region-name">${row.region}</td>
                <td class="numeric-value">${row.damageBPKR.toFixed(2)}</td>
                <td class="numeric-value">${row.lossBPKR.toFixed(2)}</td>
                <td class="numeric-value">${row.needsBPKR.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="notes-section">
          <h2 class="section-title">Notes</h2>
          <ul class="notes-list">
            ${notes.map(note => `
              <li class="note-item">${note}</li>
            `).join('')}
          </ul>
        </div>
      </div>
    </body>
    </html>
  `;
} 