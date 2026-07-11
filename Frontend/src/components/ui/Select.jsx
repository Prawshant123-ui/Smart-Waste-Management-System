import clsx from "clsx";
import { forwardRef } from "react";

const Select = forwardRef(function Select(
  { label, error, className = "", children, ...props },
  ref
) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </span>
      )}
      <select
        ref={ref}
        className={clsx(
          "w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20",
          error && "border-error focus:border-error focus:ring-error/20",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <span className="mt-1 block text-xs text-error">{error}</span>}
    </label>
  );
});

export default Select;