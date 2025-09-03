import express from 'express';
import { generateAnnexIIIPDF, generateAnnexIIIDOCX } from '../services/exporters';

const router = express.Router();

/**
 * POST /api/reports/annex-iii/pdf
 * Generate Annex III PDF report
 */
router.post('/annex-iii/pdf', async (req, res) => {
  try {
    const {
      generatedOn,
      introText,
      mapPng,
      tableRegionRows,
      totals,
      notes
    } = req.body;

    // Validate required fields
    if (!tableRegionRows || !Array.isArray(tableRegionRows)) {
      return res.status(400).json({ error: 'tableRegionRows is required and must be an array' });
    }

    // Generate PDF using Puppeteer
    const pdfBuffer = await generateAnnexIIIPDF({
      generatedOn,
      introText,
      mapPng,
      tableRegionRows,
      totals,
      notes
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="annex-iii-report-${Date.now()}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation failed:', error);
    res.status(500).json({ 
      error: 'Failed to generate PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/reports/annex-iii/docx
 * Generate Annex III DOCX report
 */
router.post('/annex-iii/docx', async (req, res) => {
  try {
    const {
      generatedOn,
      introText,
      mapPng,
      tableRegionRows,
      totals,
      notes
    } = req.body;

    // Validate required fields
    if (!tableRegionRows || !Array.isArray(tableRegionRows)) {
      return res.status(400).json({ error: 'tableRegionRows is required and must be an array' });
    }

    // Generate DOCX using docx-templater
    const docxBuffer = await generateAnnexIIIDOCX({
      generatedOn,
      introText,
      mapPng,
      tableRegionRows,
      totals,
      notes
    });

    // Set response headers for DOCX download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="annex-iii-report-${Date.now()}.docx"`);
    res.setHeader('Content-Length', docxBuffer.length);

    res.send(docxBuffer);
  } catch (error) {
    console.error('DOCX generation failed:', error);
    res.status(500).json({ 
      error: 'Failed to generate DOCX',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 