// This file is deprecated. Use the enhanced export functions from @/features/reports/export instead.
// Keeping for backward compatibility but redirecting to the new implementation.

export { exportReportToPDF } from '@/features/reports/export';

// Legacy function - redirects to new implementation
export async function exportReportToPDFWithPageNumbers(node: HTMLElement, filename: string): Promise<void> {
  const { exportReportToPDF } = await import('@/features/reports/export');
  return exportReportToPDF(node, filename);
} 