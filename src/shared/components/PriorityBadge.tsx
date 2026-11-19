import type { RequestPriority } from "../../features/requests/types";

const labels: Record<RequestPriority, string> = {
  low: "کم",
  medium: "متوسط",
  high: "زیاد",
};

interface PriorityBadgeProps {
  priority: RequestPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return <span className={`priority-badge priority-${priority}`}>{labels[priority]}</span>;
}
