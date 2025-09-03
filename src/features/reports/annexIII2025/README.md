# KPD3 Impact Assessment — Annex III

This module provides a comprehensive system for generating Annex III reports for the KPD3 impact assessment. The system follows the standardized Annex III format used for reporting damage, loss, and needs assessments following major disasters.

## Overview

Annex III is a standardized format that provides a comprehensive framework for documenting the impact of floods and other natural hazards. This implementation specifically targets the 2025 KP floods and generates reports that include:

- Executive summary and introduction
- Damage, loss, and needs by region
- Sector-by-sector analysis
- Vulnerable segments assessment
- Government response overview

## Components

### Frontend Components

- **`AnnexIII2025Page.tsx`** - Main page component with report generation interface
- **`AnnexIII2025Print.tsx`** - Print-optimized component for PDF generation and printing
- **`index.ts`** - Export file for easy importing

### Backend Services

- **`annexIII2025Data.ts`** - Data assembly service that fetches and processes KP 2025 data
- **`annexIII2025PDF.ts`** - PDF export service using Puppeteer
- **`annexIII2025DOCX.ts`** - DOCX export service using the docx library
- **`index.ts`** - Service exports

### API Endpoints

- **`GET /api/reports/annex-iii-2025/preview`** - Get preview data for the report
- **`POST /api/reports/annex-iii-2025/pdf`** - Generate PDF report
- **`POST /api/reports/annex-iii-2025/docx`** - Generate DOCX report

## Data Structure

The system uses the `AnnexIII2025Data` interface:

```typescript
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
```

## Usage

### 1. Generate Report Data

```typescript
import { buildAnnexIII2025Payload } from "@/server/services/annexIII2025";

const reportData = await buildAnnexIII2025Payload();
```

### 2. Display Report

```typescript
import { AnnexIII2025Page } from "@/features/reports/annexIII2025";

function App() {
  return <AnnexIII2025Page />;
}
```

### 3. Export to PDF

```typescript
import { generateAnnexIII2025PDF } from "@/server/services/annexIII2025";

const pdfBuffer = await generateAnnexIII2025PDF(reportData);
```

### 4. Export to DOCX

```typescript
import { generateAnnexIII2025DOCX } from "@/server/services/annexIII2025";

const docxBuffer = await generateAnnexIII2025DOCX(reportData);
```

## Data Sources

The system integrates with existing KPD3 data sources:

- **Infrastructure Damage** - Housing, roads, bridges, public facilities
- **Monetary Losses** - Economic impact calculations
- **Compensation Data** - Government relief disbursements
- **Agriculture Impacts** - Crop damage and livestock losses
- **Human Impact** - Casualties, displacement, social services

## Export Features

### PDF Export

- A4 format with proper margins (18mm top/right/left, 20mm bottom)
- Print-optimized styling with Times New Roman font
- Automatic page breaks and repeating table headers
- Page numbering (Page X of Y)

### DOCX Export

- Clean Word document format
- Proper table structure with borders and shading
- Section headers and formatting
- Compatible with Microsoft Word and LibreOffice

### Print Support

- Browser-optimized print layout
- CSS print media queries
- Proper page breaks and styling

## Styling

The system uses a combination of:

- **Tailwind CSS** for the main interface
- **CSS-in-JS** for print-specific styles
- **Print media queries** for A4 optimization
- **Serif fonts** (Times New Roman) for professional appearance

## Print Optimization

Key print features:

- **Page Breaks**: Controlled using CSS `page-break-*` properties
- **Table Headers**: Repeat on page breaks using `display: table-header-group`
- **A4 Dimensions**: Optimized for 210mm × 297mm paper
- **Margins**: 18mm on all sides except 20mm bottom
- **Font Sizes**: 11pt body, 18pt title, 14pt section headers

## Testing

Unit tests are available for:

- Number formatting (billions with 2 decimal places)
- Totals calculations
- Data structure validation
- Error handling

Run tests with:

```bash
npm test -- annexIII2025Data.test.ts
```

## Dependencies

### Frontend

- React 18+
- Tailwind CSS
- UI components from `@/components/ui`

### Backend

- Puppeteer (PDF generation)
- docx library (DOCX generation)
- Express.js (API routes)

## Configuration

### Environment Variables

- `VITE_MAPTILER_API_KEY` - For map snapshot generation (optional)

### API Configuration

- Base URL: Configured in individual API modules
- Timeout: Default 30 seconds for data fetching
- Retry logic: Implemented for failed API calls

## Error Handling

The system includes comprehensive error handling:

- **API Failures**: Graceful fallbacks with default values
- **Export Errors**: Detailed error messages and logging
- **Data Validation**: Input validation for required fields
- **Network Issues**: Retry logic and timeout handling

## Performance Considerations

- **Lazy Loading**: Components load only when needed
- **Data Caching**: React Query for efficient data fetching
- **Export Optimization**: Background processing for large reports
- **Memory Management**: Proper cleanup of browser instances

## Future Enhancements

Potential improvements:

- **Real-time Updates**: Live data integration
- **Custom Templates**: User-configurable report layouts
- **Batch Processing**: Multiple report generation
- **Advanced Mapping**: Interactive map integration
- **Data Validation**: Enhanced input validation and error checking

## Support

For issues or questions:

1. Check the test files for usage examples
2. Review the API endpoints documentation
3. Examine the component props and interfaces
4. Check the console for error messages and logging

## License

This module is part of the KP Floods 2025 Frontend project and follows the same licensing terms.
