import clsx from "clsx";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2";

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

const variants = {
  primary: "bg-primary text-white hover:bg-primary/90 shadow-sm",
  secondary: "bg-secondary text-white hover:bg-secondary/90 shadow-sm",
  accent: "bg-accent text-white hover:bg-accent/90 shadow-sm",
  ghost: "text-ink hover:bg-line/50",
  outline: "border border-line bg-surface text-ink hover:bg-line/40",
  danger: "bg-error text-white hover:bg-error/90 shadow-sm",
  soft: "bg-primary/10 text-primary hover:bg-primary/20",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  as: Comp = "button",
  ...props
}) {
  return (
    <Comp
      className={clsx(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}
