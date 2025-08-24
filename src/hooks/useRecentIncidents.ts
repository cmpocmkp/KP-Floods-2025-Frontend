import { useEffect, useState } from "react";
import { getRecentIncidents } from "@/api/incidents";
import type { IncidentRow } from "@/types/api";

export function useRecentIncidents(p?: { from?: string; to?: string; limit?: number; district?: string }) {
  const [rows, setRows] = useState<IncidentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    getRecentIncidents({ 
      date_from: p?.from, 
      date_to: p?.to, 
      limit: p?.limit, 
      district: p?.district 
    })
      .then(setRows)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [p?.from, p?.to, p?.limit, p?.district]);

  return { rows, loading, error };
}