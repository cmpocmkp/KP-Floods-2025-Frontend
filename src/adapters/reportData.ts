import { ReportData, RegionDLN } from "@/types/report";
import { useQuery } from "@tanstack/react-query";
import { getInfrastructureDamage } from "@/api/infrastructure";
import { fetchMonetaryLossData } from "@/api/monetaryLoss";
import { getCompensationSummary } from "@/api/compensation";
import { getAgricultureImpacts } from "@/api/agriculture";
import { getLivestockSummary } from "@/api/livestock";
import { fmtPKR } from "@/lib/format";

export function buildAnnexReportData(): ReportData {
  // This function will be called from a component that has access to the query data
  // For now, return a template structure that will be populated with actual data
  return {
    title: "PAKISTAN FLOODS 2022 IMPACT ASSESSMENT — Annex III",
    intro: "This report presents a comprehensive assessment of damages, losses, and needs resulting from the devastating floods that affected Pakistan in 2022. The assessment covers infrastructure damage, property losses, agricultural impacts, and human casualties across affected regions.",
    regions: [
      {
        name: "Khyber Pakhtunkhwa",
        damages_b_pkr: 0, // Will be populated with actual data
        loss_b_pkr: 0,
        needs_b_pkr: 0
      }
    ],
    notes: [
      "Damages: Direct physical destruction of assets and infrastructure",
      "Losses: Economic losses due to disruption of economic activities",
      "Needs: Financial requirements for recovery and reconstruction"
    ],
    generatedAtISO: new Date().toISOString()
  };
}

// Hook to get report data with live queries
export function useReportData(): ReportData | null {
  const { data: infrastructureData } = useQuery({
    queryKey: ['infrastructure-damage'],
    queryFn: getInfrastructureDamage,
  });

  const { data: monetaryLossData } = useQuery({
    queryKey: ['monetary-loss'],
    queryFn: fetchMonetaryLossData,
  });

  const { data: compensationData } = useQuery({
    queryKey: ['compensation'],
    queryFn: getCompensationSummary,
  });

  const { data: agricultureData } = useQuery({
    queryKey: ['agriculture'],
    queryFn: getAgricultureImpacts,
  });

  const { data: livestockData } = useQuery({
    queryKey: ['livestock'],
    queryFn: getLivestockSummary,
  });

  if (!infrastructureData || !monetaryLossData || !compensationData || !agricultureData || !livestockData) {
    return null;
  }

  // Calculate total damages, losses, and needs
  const totalDamages = monetaryLossData.totalLossInBillions || 0;
  const totalLosses = (compensationData?.totalCompensation || 0) / 1e9; // Convert to billions
  const totalNeeds = totalDamages + totalLosses;

  // Create regional breakdown (simplified - could be expanded with district-level data)
  const regions: RegionDLN[] = [
    {
      name: "Khyber Pakhtunkhwa",
      damages_b_pkr: totalDamages,
      loss_b_pkr: totalLosses,
      needs_b_pkr: totalNeeds
    }
  ];

  return {
    title: "PAKISTAN FLOODS 2022 IMPACT ASSESSMENT — Annex III",
    intro: `This report presents a comprehensive assessment of damages, losses, and needs resulting from the devastating floods that affected Pakistan in 2022. The assessment covers infrastructure damage affecting ${infrastructureData.summary?.total_districts || 0} districts, property losses, agricultural impacts, and human casualties across affected regions.`,
    regions,
    notes: [
      "Damages: Direct physical destruction of assets and infrastructure",
      "Losses: Economic losses due to disruption of economic activities", 
      "Needs: Financial requirements for recovery and reconstruction",
      `Total affected districts: ${infrastructureData.summary?.total_districts || 0}`,
      `Total houses damaged: ${(infrastructureData.summary?.total_houses_fully_damaged || 0) + (infrastructureData.summary?.total_houses_partially_damaged || 0)}`,
      `Total compensation disbursed: ${fmtPKR((compensationData?.totalCompensation || 0))}`
    ],
    generatedAtISO: new Date().toISOString()
  };
} 