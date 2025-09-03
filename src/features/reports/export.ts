import { ReportData } from '@/types/report';

// Map snapshot interface
export interface MapSnapshotOptions {
  bounds?: [number, number, number, number]; // [south, west, north, east]
  center?: [number, number]; // [lat, lng]
  markers?: Array<{ lat: number; lng: number; severity: string }>;
  size: { width: number; height: number };
  dpi?: number;
}

// Map snapshot result
export interface MapSnapshotResult {
  png: string; // base64 PNG data
  width: number;
  height: number;
}

/**
 * Generate a static map snapshot for export
 * Uses MapTiler Static API as fallback if leaflet-image fails
 */
export async function getMapSnapshot(options: MapSnapshotOptions): Promise<MapSnapshotResult> {
  const { bounds, center, markers, size, dpi = 300 } = options;
  
  try {
    // Try to use leaflet-image first (client-side)
    if (typeof window !== 'undefined' && window.L) {
      return await generateLeafletSnapshot(options);
    }
  } catch (error) {
    console.warn('Leaflet snapshot failed, falling back to MapTiler:', error);
  }

  // Fallback to MapTiler Static API
  return await generateMapTilerSnapshot(options);
}

/**
 * Generate map snapshot using leaflet-image
 */
async function generateLeafletSnapshot(options: MapSnapshotOptions): Promise<MapSnapshotResult> {
  const { bounds, center, markers, size, dpi = 300 } = options;
  
  // This would require leaflet-image library
  // For now, return a placeholder
  throw new Error('Leaflet-image not available');
}

/**
 * Generate map snapshot using MapTiler Static API
 */
async function generateMapTilerSnapshot(options: MapSnapshotOptions): Promise<MapSnapshotResult> {
  const { bounds, center, markers, size, dpi = 300 } = options;
  
  // Default center for KP province
  const defaultCenter: [number, number] = [34.9526, 71.7340];
  const mapCenter = center || defaultCenter;
  
  // Build MapTiler URL
  const baseUrl = 'https://api.maptiler.com/maps/streets/static';
  const apiKey = import.meta.env.VITE_MAPTILER_API_KEY || 'demo'; // Use demo key if none provided
  
  let url = `${baseUrl}/${mapCenter[1]},${mapCenter[0]},8/${size.width}x${size.height}@${dpi}dpi`;
  
  // Add markers if provided
  if (markers && markers.length > 0) {
    const markerParams = markers.map(marker => 
      `pin-${marker.severity === 'high' ? 'red' : marker.severity === 'medium' ? 'orange' : 'yellow'}+${marker.lng},${marker.lat}`
    ).join(',');
    url += `/${markerParams}`;
  }
  
  // Add API key
  url += `?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`MapTiler API error: ${response.status}`);
    }
    
    const blob = await response.blob();
    const base64 = await blobToBase64(blob);
    
    return {
      png: base64,
      width: size.width,
      height: size.height
    };
  } catch (error) {
    console.error('MapTiler snapshot failed:', error);
    // Return a placeholder image
    return generatePlaceholderImage(size);
  }
}

/**
 * Convert blob to base64
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Generate a placeholder image when map generation fails
 */
function generatePlaceholderImage(size: { width: number; height: number }): MapSnapshotResult {
  // Create a simple SVG placeholder
  const svg = `
    <svg width="${size.width}" height="${size.height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f5f5f5" stroke="#ccc" stroke-width="2"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="#666">
        Map data unavailable
      </text>
    </svg>
  `;
  
  const base64 = `data:image/svg+xml;base64,${btoa(svg)}`;
  
  return {
    png: base64,
    width: size.width,
    height: size.height
  };
}

/**
 * Enhanced PDF export with proper A4 formatting
 */
export async function exportReportToPDF(
  node: HTMLElement, 
  filename: string,
  mapPng?: string
): Promise<void> {
  try {
    // If we have a map PNG, inject it into the report
    if (mapPng) {
      const mapImg = node.querySelector('.map-image') as HTMLImageElement;
      if (mapImg) {
        mapImg.src = mapPng;
      }
    }

    // Dynamic import to keep bundle size small
    const html2pdf = (await import("html2pdf.js")).default;
    
    const opt = {
      margin: [18, 18, 20, 18], // mm - top, right, bottom, left (A4 margins)
      filename,
      image: { type: "png", quality: 1.0 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      },
      jsPDF: { 
        unit: "mm", 
        format: "a4", 
        orientation: "portrait",
        compress: true
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.report-page'
      }
    };

    await html2pdf().from(node).set(opt).save();
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Enhanced DOCX export with proper formatting
 */
export async function exportReportToDOCX(
  data: ReportData, 
  filename: string,
  mapPng?: string
): Promise<void> {
  try {
    // Dynamic import to keep bundle size small
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, ImageRun } = await import("docx");
    
    // Prepare image if available
    let imageElement = null;
    if (mapPng) {
      try {
        // Convert base64 to buffer
        const base64Data = mapPng.split(',')[1];
        const imageBuffer = Buffer.from(base64Data, 'base64');
        
        imageElement = new ImageRun({
          data: imageBuffer,
          transformation: {
            width: 500,
            height: 300
          }
        });
      } catch (error) {
        console.warn('Failed to process map image for DOCX:', error);
      }
    }
    
    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: data.title,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          // Generated date
          new Paragraph({
            children: [
              new TextRun({
                text: `Generated on: ${new Date(data.generatedAtISO).toLocaleDateString('en-GB', { 
                  timeZone: 'Asia/Karachi',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}`,
                size: 20,
                color: "666666"
              })
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 600 }
          }),

          // Introduction
          new Paragraph({
            children: [
              new TextRun({
                text: data.intro,
                size: 24
              })
            ],
            spacing: { after: 400 }
          }),

          // Map image (if available)
          ...(imageElement ? [
            new Paragraph({
              children: [imageElement],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),
            new Paragraph({
              text: "Affected Areas",
              alignment: AlignmentType.CENTER,
              spacing: { after: 600 }
            })
          ] : []),

          // Section header
          new Paragraph({
            text: "Damage, Loss, and Needs by Region",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 600, after: 300 }
          }),

          // Table
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              // Header row
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: "Region", alignment: AlignmentType.CENTER })],
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { fill: "F0F0F0" }
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "Damages (B PKR)", alignment: AlignmentType.CENTER })],
                    width: { size: 23, type: WidthType.PERCENTAGE },
                    shading: { fill: "F0F0F0" }
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "Loss (B PKR)", alignment: AlignmentType.CENTER })],
                    width: { size: 23, type: WidthType.PERCENTAGE },
                    shading: { fill: "F0F0F0" }
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "Needs (B PKR)", alignment: AlignmentType.CENTER })],
                    width: { size: 24, type: WidthType.PERCENTAGE },
                    shading: { fill: "F0F0F0" }
                  })
                ]
              }),
              // Data rows
              ...data.regions.map(region => 
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ text: region.name })]
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        text: region.damages_b_pkr.toFixed(2),
                        alignment: AlignmentType.RIGHT
                      })]
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        text: region.loss_b_pkr.toFixed(2),
                        alignment: AlignmentType.RIGHT
                      })]
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        text: region.needs_b_pkr.toFixed(2),
                        alignment: AlignmentType.RIGHT
                      })]
                    })
                  ]
                })
              )
            ]
          }),

          // Notes section header
          new Paragraph({
            text: "Notes",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 600, after: 300 }
          }),

          // Notes list
          ...data.notes?.map(note => 
            new Paragraph({
              children: [
                new TextRun({ text: "• ", size: 24 }),
                new TextRun({ text: note, size: 24 })
              ],
              spacing: { after: 200 }
            })
          ) || []
        ]
      }]
    });

    // Generate and download
    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('DOCX export failed:', error);
    throw new Error(`Failed to export DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Utility function to format numbers to Billion PKR
 */
export function toBillionPKR(n: number): string {
  return (n / 1e9).toFixed(2);
}

/**
 * Utility function to format numbers with specified decimal places
 */
export function fmt(n: number, digits: number = 2): string {
  return n.toFixed(digits);
} 