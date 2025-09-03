import React, { forwardRef, useEffect } from 'react';
import { ReportData } from '@/types/report';
import { fmtDatePK } from '@/lib/format';

interface AnnexIIIReportProps {
  data: ReportData;
  className?: string;
  mapPng?: string; // Base64 PNG for static map
}

export const AnnexIIIReport = forwardRef<HTMLDivElement, AnnexIIIReportProps>(
  ({ data, className = '', mapPng }, ref) => {
    useEffect(() => {
      if (ref && typeof ref === 'object' && ref.current) {
        console.log('Report container loaded');
        console.log('Container width:', ref.current.offsetWidth);
        console.log('Container scrollWidth:', ref.current.scrollWidth);
      }
    }, [ref]);

    return (
      <>
        <style>
          {`
            /* Nuclear option - absolutely prevent overflow */
            .annex-iii-report {
              font-family: "Times New Roman", "Noto Serif", serif;
              line-height: 1.35;
              font-size: 11pt;
              color: #000;
              background: white;
              max-width: 210mm;
              margin: 0 auto;
              width: 100%;
              overflow: hidden;
            }
            .annex-iii-report * {
              max-width: 100% !important;
              overflow: hidden !important;
            }
            .annex-iii-report img {
              max-width: 400px !important;
              max-height: 250px !important;
              width: 400px !important;
              height: 250px !important;
              object-fit: contain !important;
              overflow: hidden !important;
            }
            /* Force all content to be contained */
            * {
              max-width: 100% !important;
              overflow: hidden !important;
            }
          `}
        </style>
        <div 
          ref={ref}
          className="annex-iii-report"
        >
          {/* Width constraint wrapper */}
          <div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
            {/* Page 1: Title and Introduction */}
            <div style={{ minHeight: '297mm', padding: 0, margin: 0, position: 'relative' }}>
              {/* Header Block */}
              <div style={{ textAlign: 'center', marginBottom: '20mm', paddingTop: '10mm' }}>
                <h1 style={{ 
                  fontSize: '18pt', 
                  fontWeight: 'bold', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.5pt', 
                  margin: '0 0 8mm 0', 
                  lineHeight: 1.2 
                }}>
                  PAKISTAN FLOODS 2022 IMPACT ASSESSMENT — Annex III
                </h1>
                <div style={{ textAlign: 'right', fontSize: '10pt', color: '#666', marginBottom: '15mm' }}>
                  Generated on: {fmtDatePK(data.generatedAtISO)}
                </div>
              </div>

              {/* Introduction Paragraph */}
              <div style={{ marginBottom: '15mm' }}>
                <p style={{ textAlign: 'justify', margin: 0, lineHeight: 1.4 }}>
                  {data.intro}
                </p>
              </div>

              {/* Map Figure - Bulletproof Container */}
              <div 
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textAlign: 'center',
                  marginBottom: '15mm',
                  position: 'relative',
                  zIndex: 10
                }}
              >
                {mapPng ? (
                  <div 
                    style={{ 
                      width: '400px',
                      height: '250px',
                      backgroundColor: '#f0f0f0',
                      border: '1px solid #ccc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    <img 
                      src={mapPng} 
                      alt="Affected Areas" 
                      style={{
                        maxWidth: '400px',
                        maxHeight: '250px',
                        width: '400px',
                        height: '250px',
                        objectFit: 'contain',
                        display: 'block'
                      }}
                      onLoad={(e) => {
                        const img = e.target as HTMLImageElement;
                        // Force absolute constraints
                        img.style.width = '400px';
                        img.style.height = '250px';
                        img.style.maxWidth = '400px';
                        img.style.maxHeight = '250px';
                        img.style.objectFit = 'contain';
                        img.style.overflow = 'hidden';
                      }}
                    />
                  </div>
                ) : (
                  <div 
                    style={{
                      width: '400px',
                      height: '250px',
                      backgroundColor: '#f0f0f0',
                      border: '1px solid #ccc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}
                  >
                    <div style={{ color: '#666', fontStyle: 'italic' }}>Map data unavailable</div>
                  </div>
                )}
                <div style={{ fontSize: '10pt', fontWeight: 'bold', marginTop: '3mm', textAlign: 'center' }}>Affected Areas</div>
              </div>
            </div>

            {/* Page 2+: Data Tables */}
            <div style={{ minHeight: '297mm', padding: 0, margin: 0, position: 'relative' }}>
              {/* Section Rule */}
              <div style={{ borderTop: '1px solid #2a2a2a', margin: '10mm 0 6mm 0' }}></div>
              
              {/* Damage, Loss, and Needs Table */}
              <h2 style={{ fontSize: '14pt', fontWeight: 'bold', margin: '0 0 6mm 0', color: '#2a2a2a' }}>
                Damage, Loss, and Needs by Region
              </h2>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', margin: '6mm 0 10mm 0' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #000', padding: '3mm 2mm', textAlign: 'center', fontWeight: 'bold', fontSize: '10pt', backgroundColor: '#f5f5f5' }}>Region</th>
                    <th style={{ border: '1px solid #000', padding: '3mm 2mm', textAlign: 'center', fontWeight: 'bold', fontSize: '10pt', backgroundColor: '#f5f5f5' }}>Damages (B PKR)</th>
                    <th style={{ border: '1px solid #000', padding: '3mm 2mm', textAlign: 'center', fontWeight: 'bold', fontSize: '10pt', backgroundColor: '#f5f5f5' }}>Loss (B PKR)</th>
                    <th style={{ border: '1px solid #000', padding: '3mm 2mm', textAlign: 'center', fontWeight: 'bold', fontSize: '10pt', backgroundColor: '#f5f5f5' }}>Needs (B PKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.regions.map((region, index) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #000', padding: '3mm 2mm', fontWeight: 500, textAlign: 'left' }}>{region.name}</td>
                      <td style={{ border: '1px solid #000', padding: '3mm 2mm', textAlign: 'right', fontFamily: 'monospace' }}>{region.damages_b_pkr.toFixed(2)}</td>
                      <td style={{ border: '1px solid #000', padding: '3mm 2mm', textAlign: 'right', fontFamily: 'monospace' }}>{region.loss_b_pkr.toFixed(2)}</td>
                      <td style={{ border: '1px solid #000', padding: '3mm 2mm', textAlign: 'right', fontFamily: 'monospace' }}>{region.needs_b_pkr.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Notes Section */}
              <div style={{ marginTop: '8mm' }}>
                <h2 style={{ fontSize: '14pt', fontWeight: 'bold', margin: '0 0 6mm 0', color: '#2a2a2a' }}>Notes</h2>
                <ul style={{ listStyleType: 'disc', margin: 0, paddingLeft: '6mm' }}>
                  {data.notes?.map((note, index) => (
                    <li key={index} style={{ marginBottom: '2mm', lineHeight: 1.3 }}>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer for page numbers */}
            <div style={{ textAlign: 'center', fontSize: '10pt', color: '#666', marginTop: '20px', paddingTop: '10px', borderTop: '1px solid #ddd' }}>
              Page 1 of 2
            </div>
          </div> {/* Close width constraint wrapper */}
        </div>
      </>
    );
  }
);

AnnexIIIReport.displayName = 'AnnexIIIReport'; 