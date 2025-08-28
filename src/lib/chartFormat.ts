export const compactNumber = (v?: number | null) => {
  if (v == null || isNaN(+v)) return "—";
  const abs = Math.abs(+v);
  if (abs >= 1_000_000_000) return (v / 1_000_000_000).toFixed(1) + "B";
  if (abs >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M";
  if (abs >= 1_000) return (v / 1_000).toFixed(1) + "k";
  return String(Math.round(v * 100) / 100);
};

export const pct = (v?: number | null) =>
  v == null ? "—" : `${(v * 100).toFixed(0)}%`;

export const truncate = (s: string, max = 12) =>
  s.length <= max ? s : s.slice(0, max - 1) + "…";

export const formatCurrency = (v?: number | null) => {
  if (v == null || isNaN(+v)) return "—";
  return `${compactNumber(v)} PKR`;
};