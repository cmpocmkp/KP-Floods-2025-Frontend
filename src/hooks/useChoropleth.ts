import { useEffect, useState } from "react";
import { getChoropleth } from "@/api/map";
import type { ChoroplethDatum } from "@/types/api";

export function useChoropleth(metric: "deaths"|"injured"|"houses"|"livestock", from?: string, to?: string) {
  const [data, setData] = useState<ChoroplethDatum[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    getChoropleth({ metric, date_from: from, date_to: to })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [metric, from, to]);

  return { data, loading, error };
}