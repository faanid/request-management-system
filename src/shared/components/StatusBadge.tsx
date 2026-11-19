import type { RequestStatus } from "../../features/requests/types";

const labels: Record<RequestStatus, string> = {
  new: "جدید",
  in_progress: "در حال بررسی",
  completed: "تکمیل‌شده",
};

interface StatusBadgeProps {
  status: RequestStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-${status}`}>{labels[status]}</span>;
}
