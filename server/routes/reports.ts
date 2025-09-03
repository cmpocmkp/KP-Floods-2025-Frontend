import express from 'express';
import { generateAnnexIIIPDF, generateAnnexIIIDOCX } from '../services/exporters';
import { generateAnnexIII2025PDF, generateAnnexIII2025DOCX, buildAnnexIII2025Payload } from '../services/annexIII2025';

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

/**
 * GET /api/reports/annex-iii-2025/preview
 * Get preview data for Annex III 2025 report
 */
router.get('/annex-iii-2025/preview', async (req, res) => {
  try {
    const payload = await buildAnnexIII2025Payload();
    res.json(payload);
  } catch (error) {
    console.error('Failed to generate Annex III 2025 preview:', error);
    res.status(500).json({ 
      error: 'Failed to generate preview',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/reports/annex-iii-2025/pdf
 * Generate Annex III 2025 PDF report
 */
router.post('/annex-iii-2025/pdf', async (req, res) => {
  try {
    const data = req.body;

    // Validate required fields
    if (!data.tableRegionRows || !Array.isArray(data.tableRegionRows)) {
      return res.status(400).json({ error: 'tableRegionRows is required and must be an array' });
    }

    // Generate PDF using Puppeteer
    const pdfBuffer = await generateAnnexIII2025PDF(data);

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="annex-iii-2025-report-${Date.now()}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Annex III 2025 PDF generation failed:', error);
    res.status(500).json({ 
      error: 'Failed to generate PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/reports/annex-iii-2025/docx
 * Generate Annex III 2025 DOCX report
 */
router.post('/annex-iii-2025/docx', async (req, res) => {
  try {
    const data = req.body;

    // Validate required fields
    if (!data.tableRegionRows || !Array.isArray(data.tableRegionRows)) {
      return res.status(400).json({ error: 'tableRegionRows is required and must be an array' });
    }

    // Generate DOCX using docx library
    const docxBuffer = await generateAnnexIII2025DOCX(data);

    // Set response headers for DOCX download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="annex-iii-2025-report-${Date.now()}.docx"`);
    res.setHeader('Content-Length', docxBuffer.length);

    res.send(docxBuffer);
  } catch (error) {
    console.error('Annex III 2025 DOCX generation failed:', error);
    res.status(500).json({ 
      error: 'Failed to generate DOCX',
      details: error instanceof Error ? error.message : 'Unknown error'
      });
  }
});

export default router; 