import { formatNumber } from "../lib/format";

interface StatCardProps {
  label: string;
  value: number | null;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-value">{value === null ? "—" : formatNumber(value)}</div>
      <div className="stat-label">{label}</div>
    </article>
  );
}
