import { useEffect, useState } from "react";
import { getInfrastructureStatus } from "@/api/infrastructure";
import type { InfrastructureStatus } from "@/types/api";

export function useInfraStatus(from?: string, to?: string) {
  const [data, setData] = useState<InfrastructureStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    getInfrastructureStatus({ date_from: from, date_to: to })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [from, to]);

  return { data, loading, error };
}