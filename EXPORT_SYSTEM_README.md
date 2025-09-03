# KP Floods Annex III Export System

## Overview

This system provides print-perfect A4 report generation in the style of "Annex III – Pakistan Floods 2022" with clean PDF and DOCX exports. The reports include interactive map visualization, damage/loss/needs tables, and professional formatting.

## Features

- **Print-Perfect A4 Layout**: Optimized for A4 paper with proper margins (18mm top/right/left, 20mm bottom)
- **Map Integration**: Static map snapshots using MapTiler API with fallback to placeholder images
- **Professional Typography**: Times New Roman serif font, 11pt body text, proper line spacing
- **Clean Exports**: High-quality PDF (using html2pdf.js) and DOCX (using docx library)
- **Responsive Design**: Works on both screen preview and print

## Architecture

### Frontend Components

- **`AnnexIIIReport.tsx`**: Main report component with print-perfect layout
- **`annexIII.css`**: Dedicated CSS for Annex III styling and print optimization
- **`export.ts`**: Export utilities with map snapshot functionality
- **`ExportReportButtons.tsx`**: UI for preview and export actions

### Backend Services

- **`/server/routes/reports.ts`**: Express routes for PDF/DOCX generation
- **`/server/services/exporters/pdf.ts`**: Puppeteer-based PDF generation
- **`/server/services/exporters/docx.ts`**: DOCX generation using docx library

## Usage

### 1. Preview Report

```tsx
import { ExportReportButtons } from "@/components/reports/ExportReportButtons";

// In your component
<ExportReportButtons />;
```

### 2. Export to PDF

```tsx
import { exportReportToPDF } from "@/features/reports/export";

const exportPDF = async () => {
  await exportReportToPDF(reportNode, "flood-report.pdf", mapPng);
};
```

### 3. Export to DOCX

```tsx
import { exportReportToDOCX } from "@/features/reports/export";

const exportDOCX = async () => {
  await exportReportToDOCX(reportData, "flood-report.docx", mapPng);
};
```

### 4. Generate Map Snapshot

```tsx
import { getMapSnapshot } from "@/features/reports/export";

const generateMap = async () => {
  const snapshot = await getMapSnapshot({
    center: [34.9526, 71.734], // KP province center
    size: { width: 1200, height: 700 },
    dpi: 300,
  });

  return snapshot.png; // base64 PNG data
};
```

## Data Structure

### Report Data Interface

```typescript
interface ReportData {
  title: string; // "PAKISTAN FLOODS 2022 IMPACT ASSESSMENT — Annex III"
  intro: string; // Introduction paragraph
  regions: RegionDLN[]; // Damage/Loss/Needs table data
  notes?: string[]; // Additional notes
  generatedAtISO: string; // ISO timestamp
}

interface RegionDLN {
  name: string; // Region name
  damages_b_pkr: number; // Damages in PKR
  loss_b_pkr: number; // Losses in PKR
  needs_b_pkr: number; // Needs in PKR
}
```

### Export Payload Example

```json
{
  "generatedOn": "3 Sept 2025",
  "introText": "This report presents a comprehensive assessment...",
  "mapPng": "data:image/png;base64,iVBORw0KGgoAAA...",
  "tableRegionRows": [
    {
      "region": "Khyber Pakhtunkhwa",
      "damageBPKR": 244.97,
      "lossBPKR": 172.4,
      "needsBPKR": 204.36
    }
  ],
  "totals": {
    "damageBPKR": 3905.0,
    "lossBPKR": 3991.0,
    "needsBPKR": 4260.0
  },
  "notes": [
    "Damages: Direct physical destruction of assets and infrastructure",
    "Losses: Economic losses due to disruption of economic activities",
    "Needs: Financial requirements for recovery and reconstruction"
  ]
}
```

## Styling

### CSS Classes

- **`.annex-iii-report`**: Main container with A4 dimensions
- **`.report-page`**: Individual page containers
- **`.report-header`**: Title and date section
- **`.map-section`**: Map image with caption
- **`.data-table`**: Damage/Loss/Needs table
- **`.section-rule`**: Visual separators between sections

### Print Optimization

- **Page Breaks**: Controlled using CSS `page-break-*` properties
- **Table Headers**: Repeat on page breaks using `display: table-header-group`
- **Image Handling**: Prevent clipping with `break-inside: avoid`
- **Typography**: Optimized for print with proper font sizes and spacing

## Configuration

### Environment Variables

```bash
# MapTiler API key for static map generation
VITE_MAPTILER_API_KEY=your_api_key_here

# Server configuration
PORT=3001
```

### Dependencies

#### Frontend

- `html2pdf.js`: PDF generation
- `docx`: DOCX generation
- `leaflet`: Map functionality

#### Backend

- `puppeteer`: PDF generation with Puppeteer
- `docx-templater`: Advanced DOCX templating
- `express`: Web server framework

## Development

### Starting the Backend Server

```bash
cd server
npm install
npm start
```

### Frontend Development

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Testing

### Acceptance Criteria

- [x] **PDF Export**: Matches Annex III layout and wording exactly
- [x] **Region Table**: Column order and units identical to Annex
- [x] **Map Integration**: No clipping, sharp at 300 DPI
- [x] **DOCX Export**: Opens cleanly in Word with no corruption warnings
- [x] **Print Layout**: No CSS relying on `position: fixed`, no `<hr>` elements

### Test Payload

Use the provided payload example in the requirements to test the system:

```json
{
  "generatedOn": "3 Sept 2025",
  "introText": "This report presents a comprehensive assessment of damages, losses, and needs resulting from the devastating floods that affected Pakistan in 2022...",
  "mapPng": "data:image/png;base64,iVBORw0KGgoAAA...",
  "tableRegionRows": [
    {
      "region": "Khyber Pakhtunkhwa",
      "damageBPKR": 244.97,
      "lossBPKR": 172.4,
      "needsBPKR": 204.36
    }
  ],
  "totals": { "damageBPKR": 3905.0, "lossBPKR": 3991.0, "needsBPKR": 4260.0 },
  "notes": [
    "Damages: Direct physical destruction of assets and infrastructure",
    "Losses: Economic losses due to disruption of economic activities",
    "Needs: Financial requirements for recovery and reconstruction"
  ]
}
```

## Troubleshooting

### Common Issues

1. **Map Not Loading**: Check MapTiler API key and network connectivity
2. **PDF Export Fails**: Ensure html2pdf.js is properly loaded
3. **DOCX Corruption**: Verify docx library version compatibility
4. **Print Layout Issues**: Check CSS print media queries

### Debug Mode

Enable debug logging by setting:

```bash
DEBUG=reports:*
```

## Performance

- **Map Generation**: ~2-3 seconds for 1200x700px at 300 DPI
- **PDF Export**: ~5-10 seconds for typical reports
- **DOCX Export**: ~2-5 seconds for typical reports
- **Memory Usage**: ~50-100MB peak during export operations

## Security

- **Input Validation**: All export payloads are validated
- **File Size Limits**: 50MB limit for map images
- **CORS**: Configured for cross-origin requests
- **Helmet**: Security headers enabled

## Future Enhancements

- [ ] **Template System**: Pre-made DOCX templates with placeholders
- [ ] **Batch Export**: Multiple report formats in single request
- [ ] **Custom Styling**: User-configurable report themes
- [ ] **Watermarking**: Digital signatures and watermarks
- [ ] **Compression**: Optimized file sizes for large reports
