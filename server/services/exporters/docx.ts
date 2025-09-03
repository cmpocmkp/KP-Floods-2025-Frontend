import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { Buffer } from 'buffer';

export interface AnnexIIIDOCXData {
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
 * Generate Annex III DOCX report using docx-templater
 * Creates a clean .docx template that mirrors Annex III layout
 */
export async function generateAnnexIIIDOCX(data: AnnexIIIDOCXData): Promise<Buffer> {
  try {
    // Create a simple DOCX template using docx library as fallback
    // In production, you would use a pre-made template file
    const docxBuffer = await generateDOCXFromScratch(data);
    return docxBuffer;
  } catch (error) {
    console.error('DOCX generation failed:', error);
    throw new Error(`Failed to generate DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate DOCX from scratch using docx library
 * This is a fallback when no template is available
 */
async function generateDOCXFromScratch(data: AnnexIIIDOCXData): Promise<Buffer> {
  try {
    // Dynamic import to keep bundle size small
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, ImageRun } = await import("docx");
    
    // Prepare image if available
    let imageElement = null;
    if (data.mapPng) {
      try {
        // Convert base64 to buffer
        const base64Data = data.mapPng.split(',')[1];
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
            text: "PAKISTAN FLOODS 2022 IMPACT ASSESSMENT — Annex III",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          // Generated date
          new Paragraph({
            children: [
              new TextRun({
                text: `Generated on: ${data.generatedOn}`,
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
                text: data.introText,
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
              ...data.tableRegionRows.map(row => 
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ text: row.region })]
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        text: row.damageBPKR.toFixed(2),
                        alignment: AlignmentType.RIGHT
                      })]
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        text: row.lossBPKR.toFixed(2),
                        alignment: AlignmentType.RIGHT
                      })]
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        text: row.needsBPKR.toFixed(2),
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
          ...data.notes.map(note => 
            new Paragraph({
              children: [
                new TextRun({ text: "• ", size: 24 }),
                new TextRun({ text: note, size: 24 })
              ],
              spacing: { after: 200 }
            })
          )
        ]
      }]
    });

    // Generate buffer
    const buffer = await Packer.toBuffer(doc);
    return buffer;
  } catch (error) {
    console.error('DOCX generation from scratch failed:', error);
    throw error;
  }
}

/**
 * Generate DOCX using a template file (preferred method)
 * This would use a pre-made .docx template with placeholders
 */
async function generateDOCXFromTemplate(data: AnnexIIIDOCXData): Promise<Buffer> {
  try {
    // In production, you would load a template file
    // const template = fs.readFileSync(path.join(__dirname, '../templates/annex-iii-template.docx'));
    
    // For now, we'll use the scratch method
    return await generateDOCXFromScratch(data);
  } catch (error) {
    console.error('Template-based DOCX generation failed:', error);
    // Fallback to scratch generation
    return await generateDOCXFromScratch(data);
  }
} 