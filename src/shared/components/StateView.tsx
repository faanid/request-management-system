import type { ReactNode } from "react";
import { AlertCircle, LoaderCircle, RefreshCw } from "lucide-react";

interface StateViewProps {
  title: string;
  description?: string;
  action?: ReactNode;
  kind?: "loading" | "error" | "empty";
  onRetry?: () => void;
}

export function StateView({
  title,
  description,
  action,
  kind = "empty",
  onRetry,
}: StateViewProps) {
  return (
    <section className={`state-view state-${kind}`} role={kind === "error" ? "alert" : "status"} aria-busy={kind === "loading"}>
      <span className="state-icon">
        {kind === "loading" ? <LoaderCircle className="spin" size={22} /> : <AlertCircle size={22} />}
      </span>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {onRetry && (
        <button className="button button-secondary button-small" onClick={onRetry} type="button">
          <RefreshCw size={15} />
          تلاش دوباره
        </button>
      )}
      {action}
    </section>
  );
}
