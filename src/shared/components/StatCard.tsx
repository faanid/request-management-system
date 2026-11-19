import type { LucideIcon } from "lucide-react";
import { formatNumber } from "../lib/format";

interface StatCardProps {
  label: string;
  value: number | null;
  icon: LucideIcon;
  tone: "blue" | "amber" | "green" | "slate";
  helper: string;
}

export function StatCard({ label, value, icon: Icon, tone, helper }: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-card-top">
        <span className={`stat-icon stat-icon-${tone}`}>
          <Icon size={20} strokeWidth={1.8} />
        </span>
        <span className="stat-helper">{helper}</span>
      </div>
      <div className="stat-value">{value === null ? "—" : formatNumber(value)}</div>
      <div className="stat-label">{label}</div>
    </article>
  );
}
