export interface RegionDLN {
  name: string;
  damages_b_pkr: number;
  loss_b_pkr: number;
  needs_b_pkr: number;
}

export interface ReportData {
  title: string;                         // e.g., "PAKISTAN FLOODS 2022 IMPACT ASSESSMENT — Annex III"
  intro: string;                         // narrative paragraph
  regions: RegionDLN[];                  // DLN table
  notes?: string[];                      // bullet notes/definitions
  generatedAtISO: string;                // new Date().toISOString()
} 