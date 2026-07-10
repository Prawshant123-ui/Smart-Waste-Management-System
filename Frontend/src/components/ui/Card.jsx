import clsx from "clsx";

export default function Card({ className = "", children, ...rest }) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-line bg-surface shadow-card",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
