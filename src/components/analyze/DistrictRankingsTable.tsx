import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Skull,
  Activity,
  Home,
  MapPin
} from 'lucide-react';
import { DSRAggregates } from '@/api/dsr';

interface DistrictRankingsTableProps {
  aggregates: DSRAggregates;
}

export function DistrictRankingsTable({ aggregates }: DistrictRankingsTableProps) {
  const { rankings } = aggregates;

  const renderTable = (data: any[], title: string, icon: React.ComponentType<any>, color: string) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>District</TableHead>
          <TableHead className="text-right">{title}</TableHead>
          <TableHead className="text-right">Division</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Badge
                  variant={index === 0 ? "default" : "secondary"}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-600 text-white' : ''
                  }`}
                >
                  {index + 1}
                </Badge>
              </div>
            </TableCell>
            <TableCell className="font-medium">{item.district}</TableCell>
            <TableCell className={`text-right font-bold ${color}`}>
              {typeof item.deaths !== 'undefined' ? item.deaths.toLocaleString() :
               typeof item.housesFull !== 'undefined' ? (item.housesFull + item.housesPartial).toLocaleString() :
               item.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              <Badge variant="outline">{item.division || 'N/A'}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          District Rankings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deaths" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deaths" className="flex items-center gap-2">
              <Skull className="h-4 w-4" />
              By Deaths
            </TabsTrigger>
            <TabsTrigger value="injured" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              By Injured
            </TabsTrigger>
            <TabsTrigger value="houses" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              By Houses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deaths" className="mt-6">
            {rankings.topDeaths.length > 0 ? (
              renderTable(rankings.topDeaths, "Deaths", Skull, "text-red-600")
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No death data available for ranking
              </div>
            )}
          </TabsContent>

          <TabsContent value="injured" className="mt-6">
            {rankings.topDeaths.length > 0 ? (
              renderTable(
                rankings.topDeaths
                  .filter(d => d.injured > 0)
                  .sort((a, b) => b.injured - a.injured)
                  .slice(0, 5),
                "Injured",
                Activity,
                "text-yellow-600"
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No injury data available for ranking
              </div>
            )}
          </TabsContent>

          <TabsContent value="houses" className="mt-6">
            {rankings.topHouses.length > 0 ? (
              renderTable(rankings.topHouses, "Houses Damaged", Home, "text-blue-600")
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No house damage data available for ranking
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}