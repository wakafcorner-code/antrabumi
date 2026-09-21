import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { BaseComponentProps, BadgeVariant } from "@/types";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, BaseComponentProps {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
}

/**
 * Reusable Badge Component
 * Used for status, categories, and tags. Follows WCAG 2.2 contrast rules.
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  icon,
  className,
  children,
  ...props
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-neutral-100 text-neutral-800 border-neutral-200",
    primary: "bg-neutral-900 text-white border-neutral-900",
    neutral: "bg-neutral-100 text-neutral-700 border-neutral-200",
    success: "bg-green-50 text-green-800 border-green-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    error: "bg-red-50 text-red-800 border-red-200",
    outline: "bg-transparent text-neutral-800 border-neutral-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
