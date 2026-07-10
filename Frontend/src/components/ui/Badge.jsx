import clsx from "clsx";
import { statusColor } from "../../lib/format.js";

const map = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  error: "bg-error/10 text-error border-error/20",
  accent: "bg-accent/10 text-accent border-accent/20",
  muted: "bg-line text-body border-line",
};

export default function Badge({ children, tone, status, className = "" }) {
  const t = tone || statusColor(status);
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        map[t] || map.muted,
        className
      )}
    >
      {children || status}
    </span>
  );
}
