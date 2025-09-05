import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, TrendingUp, Calculator, Globe, Building2 } from "lucide-react";

const economicData = {
  sectors: [
    {
      sector: "Agriculture",
      direct_pkr: "8,107,000,000",
      pdna_multiplier: "2.48",
      pdna_loss_pkr: "20,105,360,000",
      pdna_total_pkr: "28,212,360,000",
      economic_multiplier: "1.43",
      io_ripple_pkr: "28,750,664,800",
      combined_pkr: "56,963,024,800"
    },
    {
      sector: "Retail services",
      direct_pkr: "3,301,000,000",
      pdna_multiplier: "0.60",
      pdna_loss_pkr: "1,980,600,000",
      pdna_total_pkr: "5,281,600,000",
      economic_multiplier: "1.28",
      io_ripple_pkr: "2,535,168,000",
      combined_pkr: "7,816,768,000"
    },
    {
      sector: "Education",
      direct_pkr: "3,084,000,000",
      pdna_multiplier: "0.39",
      pdna_loss_pkr: "1,208,928,000",
      pdna_total_pkr: "4,292,928,000",
      economic_multiplier: "1.37",
      io_ripple_pkr: "1,656,231,360",
      combined_pkr: "5,949,159,360"
    },
    {
      sector: "Energy",
      direct_pkr: "2,402,000,000",
      pdna_multiplier: "0.05",
      pdna_loss_pkr: "127,306,000",
      pdna_total_pkr: "2,529,306,000",
      economic_multiplier: "2.44",
      io_ripple_pkr: "310,626,640",
      combined_pkr: "2,839,932,640"
    },
    {
      sector: "Health (facilities)",
      direct_pkr: "320,000,000",
      pdna_multiplier: "0.30",
      pdna_loss_pkr: "97,280,000",
      pdna_total_pkr: "417,280,000",
      economic_multiplier: "1.37",
      io_ripple_pkr: "133,273,600",
      combined_pkr: "550,553,600"
    },
    {
      sector: "Housing",
      direct_pkr: "15,941,000,000",
      pdna_multiplier: "0.11",
      pdna_loss_pkr: "1,817,274,000",
      pdna_total_pkr: "17,758,274,000",
      economic_multiplier: "1.37",
      io_ripple_pkr: "2,489,665,380",
      combined_pkr: "20,247,939,380"
    },
    {
      sector: "Public administration",
      direct_pkr: "1,611,000,000",
      pdna_multiplier: "0.11",
      pdna_loss_pkr: "183,654,000",
      pdna_total_pkr: "1,794,654,000",
      economic_multiplier: "1.67",
      io_ripple_pkr: "306,702,180",
      combined_pkr: "2,101,356,180"
    },
    {
      sector: "Transport",
      direct_pkr: "3,227,000,000",
      pdna_multiplier: "0.09",
      pdna_loss_pkr: "277,522,000",
      pdna_total_pkr: "3,504,522,000",
      economic_multiplier: "1.65",
      io_ripple_pkr: "457,911,300",
      combined_pkr: "3,962,433,300"
    },
    {
      sector: "Vehicles",
      direct_pkr: "300,000,000",
      pdna_multiplier: "0.11",
      pdna_loss_pkr: "34,200,000",
      pdna_total_pkr: "334,200,000",
      economic_multiplier: "1.37",
      io_ripple_pkr: "46,854,000",
      combined_pkr: "381,054,000"
    },
    {
      sector: "WASH (incl public health)",
      direct_pkr: "1,070,000,000",
      pdna_multiplier: "0.20",
      pdna_loss_pkr: "209,720,000",
      pdna_total_pkr: "1,279,720,000",
      economic_multiplier: "1.37",
      io_ripple_pkr: "287,316,400",
      combined_pkr: "1,567,036,400"
    },
    {
      sector: "Water resources (irrigation)",
      direct_pkr: "9,227,000,000",
      pdna_multiplier: "0.00",
      pdna_loss_pkr: "0",
      pdna_total_pkr: "9,227,000,000",
      economic_multiplier: "0.00",
      io_ripple_pkr: "0",
      combined_pkr: "9,227,000,000"
    },
    {
      sector: "Tourism",
      direct_pkr: "13,000,000,000",
      pdna_multiplier: "0.00",
      pdna_loss_pkr: "0",
      pdna_total_pkr: "13,000,000,000",
      economic_multiplier: "0.00",
      io_ripple_pkr: "0",
      combined_pkr: "13,000,000,000"
    }
  ],
  totals: {
    total_direct_pkr: "61,590,000,000",
    total_pdna_loss_pkr: "26,041,844,000",
    total_pdna_total_pkr: "87,631,844,000",
    total_io_ripple_pkr: "36,974,413,660",
    total_combined_pkr: "124,606,257,660"
  }
};

export default function EconomicLossPage() {
  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value.replace(/,/g, ''));
    // Show full figure with Rs prefix for main display
    return `~Rs ${numValue.toLocaleString()}`;
  };

  const formatTableCurrency = (value: string) => {
    const numValue = parseFloat(value.replace(/,/g, ''));
    // Show just the number in billions for table (no PKR since it's in header)
    return `${(numValue / 1e9).toFixed(1)} B`;
  };

  const calculatePercentage = (sectorValue: string, totalValue: string) => {
    const sector = parseFloat(sectorValue.replace(/,/g, ''));
    const total = parseFloat(totalValue.replace(/,/g, ''));
    return ((sector / total) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header with PDNA Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Globe className="h-6 w-6" />
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              PDNA Data
            </Badge>
            Economic Loss Assessment - KP Floods 2025
          </CardTitle>
         
        </CardHeader>
      </Card>

      {/* Big Total Loss Tile */}
      <Card className="p-8 bg-gradient-to-r from-red-500 via-purple-500 to-red-600 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Total Economic Loss</h1>
          <div className="text-6xl font-bold mb-2">
            ~Rs {economicData.totals.total_combined_pkr}
          </div>
          <div className="text-2xl opacity-90">
            ({(parseFloat(economicData.totals.total_combined_pkr.replace(/,/g, '')) / 1_000_000_000).toFixed(1)} Billion PKR)
          </div>
          <div className="text-lg mt-4 opacity-80">
            Including Direct Damages, PDNA Losses & Ripple Effects
          </div>
        </div>
      </Card>

      {/* Loss Breakdown Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {formatTableCurrency(economicData.totals.total_direct_pkr)} PKR
            </div>
            <div className="text-sm text-red-700 font-medium">Direct Damages</div>
            <div className="text-xs text-red-600 mt-1">
              {calculatePercentage(economicData.totals.total_direct_pkr, economicData.totals.total_combined_pkr)}% of total
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {formatTableCurrency(economicData.totals.total_pdna_total_pkr)} PKR
            </div>
            <div className="text-sm text-orange-700 font-medium">PDNA Additional Losses</div>
            <div className="text-xs text-orange-600 mt-1">
              {calculatePercentage(economicData.totals.total_pdna_total_pkr, economicData.totals.total_combined_pkr)}% of total
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatTableCurrency(economicData.totals.total_io_ripple_pkr)} PKR
            </div>
            <div className="text-sm text-green-700 font-medium">IO Ripple Effects</div>
            <div className="text-xs text-green-600 mt-1">
              {calculatePercentage(economicData.totals.total_io_ripple_pkr, economicData.totals.total_combined_pkr)}% of total
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Methodology Explanation */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Understanding PDNA & World Bank Multiplier Factors
          </CardTitle>
        </CardHeader>
        <CardContent className="text-amber-800 text-sm space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                What is PDNA?
              </h4>
              <p>
                <strong>Post-Disaster Needs Assessment (PDNA)</strong> is a standardized methodology developed by the World Bank, 
                United Nations, and European Union to assess the full extent of disaster damage and losses. It provides:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Comprehensive damage assessment across all sectors</li>
                <li>Standardized loss calculation methodologies</li>
                <li>Basis for international aid and recovery planning</li>
                <li>Credible data for policy decisions and funding allocation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Input-Output Ripple Effects
              </h4>
              <p>
                <strong>Economic Multiplier Effects</strong> represent the cascading economic impact beyond Direct Damages:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Supply chain disruptions affecting other industries</li>
                <li>Reduced economic activity due to infrastructure damage</li>
                <li>Employment losses and reduced consumer spending</li>
                <li>Long-term economic recovery challenges</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Info className="h-4 w-4" />
              Total Direct Damages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatTableCurrency(economicData.totals.total_direct_pkr)} PKR
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Immediate infrastructure and asset damage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              PDNA Additional Losses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatTableCurrency(economicData.totals.total_pdna_loss_pkr)} PKR
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              PDNA methodology identified losses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              IO Ripple Effects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatTableCurrency(economicData.totals.total_io_ripple_pkr)} PKR
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Economic multiplier effects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Combined Economic Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatTableCurrency(economicData.totals.total_combined_pkr)} PKR
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total economic impact
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sector Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sector-wise Economic Losses with Percentages</CardTitle>
          <p className="text-sm text-muted-foreground">
            Detailed breakdown of losses across all economic sectors showing the percentage of total economic impact
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Sector</th>
                  <th className="text-right p-2 font-medium">
                    <div>Direct Damages (PKR)</div>
                  </th>
                  <th className="text-right p-2 font-medium">PDNA Mult.</th>
                  <th className="text-right p-2 font-medium">
                    <div>PDNA Losses (PKR)</div>
                  </th>
                  <th className="text-right p-2 font-medium">Econ. Mult.</th>
                  <th className="text-right p-2 font-medium">
                    <div>Economic Losses (PKR)</div>
                  </th>
                  <th className="text-right p-2 font-medium">
                    <div>Total Losses (PKR)</div>
                  </th>
                  <th className="text-right p-2 font-medium">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {economicData.sectors.map((sector, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{sector.sector}</td>
                    <td className="p-2 text-right text-red-600">
                      {formatTableCurrency(sector.direct_pkr)}
                    </td>
                    <td className="p-2 text-right text-blue-500 font-medium">
                      {sector.pdna_multiplier}
                    </td>
                    <td className="p-2 text-right text-orange-600">
                      {formatTableCurrency(sector.pdna_loss_pkr)}
                    </td>
                    <td className="p-2 text-right text-green-500 font-medium">
                      {sector.economic_multiplier}
                    </td>
                    <td className="p-2 text-right text-green-600">
                      {formatTableCurrency(sector.io_ripple_pkr)}
                    </td>
                    <td className="p-2 text-right font-semibold text-purple-600">
                      {formatTableCurrency(sector.combined_pkr)}
                    </td>
                    <td className="p-2 text-right text-muted-foreground font-medium">
                      {calculatePercentage(sector.combined_pkr, economicData.totals.total_combined_pkr)}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-semibold">
                <tr>
                  <td className="p-2 font-bold">TOTAL</td>
                  <td className="p-2 text-right text-red-600 font-bold">
                    {formatTableCurrency(economicData.totals.total_direct_pkr)}
                  </td>
                  <td className="p-2 text-right text-blue-500 font-bold">
                    -
                  </td>
                  <td className="p-2 text-right text-orange-600 font-bold">
                    {formatTableCurrency(economicData.totals.total_pdna_loss_pkr)}
                  </td>
                  <td className="p-2 text-right text-green-500 font-bold">
                    -
                  </td>
                  <td className="p-2 text-right text-green-600 font-bold">
                    {formatTableCurrency(economicData.totals.total_io_ripple_pkr)}
                  </td>
                  <td className="p-2 text-right text-purple-600 font-bold">
                    {formatTableCurrency(economicData.totals.total_combined_pkr)}
                  </td>
                  <td className="p-2 text-right font-bold">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900">Key Economic Insights</CardTitle>
        </CardHeader>
        <CardContent className="text-green-800 text-sm space-y-2">
          <p>
            <strong>Agriculture Sector:</strong> Highest impact at {calculatePercentage("56,963,024,800", economicData.totals.total_combined_pkr)}% of total economic losses, 
            showing the critical importance of agricultural recovery for economic stability.
          </p>
          <p>
            <strong>Housing Sector:</strong> Second highest at {calculatePercentage("20,247,939,380", economicData.totals.total_combined_pkr)}%, 
            indicating massive infrastructure damage requiring significant reconstruction investment.
          </p>
          <p>
            <strong>Tourism & Water Resources:</strong> Combined impact of {calculatePercentage("22,227,000,000", economicData.totals.total_combined_pkr)}% 
            shows the long-term economic consequences for key revenue-generating sectors.
          </p>
          <p>
            <strong>Ripple Effects:</strong> Input-output analysis reveals additional PKR {formatCurrency(economicData.totals.total_io_ripple_pkr)} in economic losses, 
            demonstrating the interconnected nature of economic sectors and the importance of comprehensive recovery planning.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
