import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, ImageRun, BorderStyle } from 'docx';
import { AnnexIII2025Data } from './annexIII2025Data';

/**
 * Generate Annex III 2025 DOCX report using docx library
 * Creates a clean .docx document that mirrors Annex III layout
 */
export async function generateAnnexIII2025DOCX(data: AnnexIII2025Data): Promise<Buffer> {
  try {
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

          // Section separator
          new Paragraph({
            children: [
              new TextRun({
                text: "─".repeat(50),
                size: 20,
                color: "2a2a2a"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          ),

          // Damage, Loss, and Needs Table
          new Paragraph({
            text: "Damage, Loss, and Needs by Region",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 300 }
          }),

          // Create table
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
                    shading: { fill: "f5f5f5" },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1 },
                      bottom: { style: BorderStyle.SINGLE, size: 1 },
                      left: { style: BorderStyle.SINGLE, size: 1 },
                      right: { style: BorderStyle.SINGLE, size: 1 }
                    }
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "Damages (B PKR)", alignment: AlignmentType.CENTER })],
                    width: { size: 23, type: WidthType.PERCENTAGE },
                    shading: { fill: "f5f5f5" },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1 },
                      bottom: { style: BorderStyle.SINGLE, size: 1 },
                      left: { style: BorderStyle.SINGLE, size: 1 },
                      right: { style: BorderStyle.SINGLE, size: 1 }
                    }
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "Loss (B PKR)", alignment: AlignmentType.CENTER })],
                    width: { size: 23, type: WidthType.PERCENTAGE },
                    shading: { fill: "f5f5f5" },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1 },
                      bottom: { style: BorderStyle.SINGLE, size: 1 },
                      left: { style: BorderStyle.SINGLE, size: 1 },
                      right: { style: BorderStyle.SINGLE, size: 1 }
                    }
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "Needs (B PKR)", alignment: AlignmentType.CENTER })],
                    width: { size: 24, type: WidthType.PERCENTAGE },
                    shading: { fill: "f5f5f5" },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1 },
                      bottom: { style: BorderStyle.SINGLE, size: 1 },
                      left: { style: BorderStyle.SINGLE, size: 1 },
                      right: { style: BorderStyle.SINGLE, size: 1 }
                    }
                  })
                ],
                tableHeader: true
              }),
              // Data rows
              ...data.tableRegionRows.map(row => 
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ text: row.region })],
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1 },
                        bottom: { style: BorderStyle.SINGLE, size: 1 },
                        left: { style: BorderStyle.SINGLE, size: 1 },
                        right: { style: BorderStyle.SINGLE, size: 1 }
                      }
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        text: row.damageBPKR.toFixed(2),
                        alignment: AlignmentType.RIGHT
                      })],
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1 },
                        bottom: { style: BorderStyle.SINGLE, size: 1 },
                        left: { style: BorderStyle.SINGLE, size: 1 },
                        right: { style: BorderStyle.SINGLE, size: 1 }
                      }
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        text: row.lossBPKR.toFixed(2),
                        alignment: AlignmentType.RIGHT
                      })],
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1 },
                        bottom: { style: BorderStyle.SINGLE, size: 1 },
                        left: { style: BorderStyle.SINGLE, size: 1 },
                        right: { style: BorderStyle.SINGLE, size: 1 }
                      }
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        text: row.needsBPKR.toFixed(2),
                        alignment: AlignmentType.RIGHT
                      })],
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1 },
                        bottom: { style: BorderStyle.SINGLE, size: 1 },
                        left: { style: BorderStyle.SINGLE, size: 1 },
                        right: { style: BorderStyle.SINGLE, size: 1 }
                      }
                    })
                  ]
                })
              ),
              // Totals row
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ 
                      text: "Total",
                      children: [new TextRun({ bold: true })]
                    })],
                    shading: { fill: "f0f0f0" },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1 },
                      bottom: { style: BorderStyle.SINGLE, size: 1 },
                      left: { style: BorderStyle.SINGLE, size: 1 },
                      right: { style: BorderStyle.SINGLE, size: 1 }
                    }
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      text: data.totals.damageBPKR.toFixed(2),
                      alignment: AlignmentType.RIGHT,
                      children: [new TextRun({ bold: true })]
                    })],
                    shading: { fill: "f0f0f0" },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1 },
                      bottom: { style: BorderStyle.SINGLE, size: 1 },
                      left: { style: BorderStyle.SINGLE, size: 1 },
                      right: { style: BorderStyle.SINGLE, size: 1 }
                    }
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      text: data.totals.lossBPKR.toFixed(2),
                      alignment: AlignmentType.RIGHT,
                      children: [new TextRun({ bold: true })]
                    })],
                    shading: { fill: "f0f0f0" },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1 },
                      bottom: { style: BorderStyle.SINGLE, size: 1 },
                      left: { style: BorderStyle.SINGLE, size: 1 },
                      right: { style: BorderStyle.SINGLE, size: 1 }
                    }
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      text: data.totals.needsBPKR.toFixed(2),
                      alignment: AlignmentType.RIGHT,
                      children: [new TextRun({ bold: true })]
                    })],
                    shading: { fill: "f0f0f0" },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1 },
                      bottom: { style: BorderStyle.SINGLE, size: 1 },
                      left: { style: BorderStyle.SINGLE, size: 1 },
                      right: { style: BorderStyle.SINGLE, size: 1 }
                    }
                  })
                ]
              })
            ]
          }),

          // Spacing after table
          new Paragraph({ spacing: { after: 400 } }),

          // Definitions section
          new Paragraph({
            text: "Definitions",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 300 }
          }),

          // Notes as bullet points
          ...data.notes.map(note => 
            new Paragraph({
              text: `• ${note}`,
              spacing: { after: 200 }
            })
          ),

          // Section separator
          new Paragraph({
            children: [
              new TextRun({
                text: "─".repeat(50),
                size: 20,
                color: "2a2a2a"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          ),

          // Sector Analysis
          new Paragraph({
            text: "Sector Analysis",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 300 }
          }),

          // Sector details
          ...data.sectors.map(sector => 
            new Paragraph({
              children: [
                new TextRun({
                  text: `${sector.name}: `,
                  bold: true,
                  size: 24
                }),
                new TextRun({
                  text: sector.summary,
                  size: 24
                })
              ],
              spacing: { after: 300 }
            })
          ),

          // Section separator
          new Paragraph({
            children: [
              new TextRun({
                text: "─".repeat(50),
                size: 20,
                color: "2a2a2a"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          ),

          // Vulnerable Segments
          new Paragraph({
            text: "Vulnerable Segments",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 300 }
          }),

          // Vulnerable segments as bullet points
          ...data.vulnerable.map(item => 
            new Paragraph({
              text: `• ${item}`,
              spacing: { after: 200 }
            })
          ),

          // Section separator
          new Paragraph({
            children: [
              new TextRun({
                text: "─".repeat(50),
                size: 20,
                color: "2a2a2a"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          ),

          // Government Response
          new Paragraph({
            text: "Government Response",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 300 }
          }),

          // Government response as bullet points
          ...data.responseNotes.map(item => 
            new Paragraph({
              text: `• ${item}`,
              spacing: { after: 200 }
            })
          )
        ]
      }]
    });

    // Generate DOCX buffer
    const buffer = await Packer.toBuffer(doc);
    return buffer;
  } catch (error) {
    console.error('Annex III 2025 DOCX generation failed:', error);
    throw new Error(`Failed to generate Annex III 2025 DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 