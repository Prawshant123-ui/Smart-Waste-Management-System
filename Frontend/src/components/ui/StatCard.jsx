import Card from "./Card.jsx";
import clsx from "clsx";

export default function StatCard({ label, value, hint, icon, tone = "primary" }) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-body">{label}</p>
          <p className="mt-1 text-3xl font-bold text-ink tabular-nums">
            {value ?? "—"}
          </p>
          {hint && <p className="mt-1 text-xs text-body/80">{hint}</p>}
        </div>
        {icon && (
          <div
            className={clsx(
              "flex h-11 w-11 items-center justify-center rounded-xl text-xl",
              tones[tone]
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
