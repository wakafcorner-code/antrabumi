import React, { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { BaseComponentProps } from "@/types";

export interface GridProps extends HTMLAttributes<HTMLElement>, BaseComponentProps {
  as?: ElementType;
  cols?: 1 | 2 | 3 | 4 | 6 | 12 | "default";
  gap?: "sm" | "md" | "lg" | "xl";
}

/**
 * Reusable Grid Component
 * Defaults to the ANTRABUMI responsive grid system:
 * - Desktop: 12 columns
 * - Tablet: 8 columns
 * - Mobile: 4 columns
 */
export const Grid: React.FC<GridProps> = ({
  as: Component = "div",
  cols = "default",
  gap = "md",
  className,
  children,
  ...props
}) => {
  const gapClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8 md:gap-10",
    xl: "gap-8 md:gap-12 lg:gap-16",
  };

  const colClasses = {
    default: "grid-cols-4 md:grid-cols-8 lg:grid-cols-12",
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    12: "grid-cols-4 md:grid-cols-8 lg:grid-cols-12",
  };

  return (
    <Component
      className={cn("grid w-full", colClasses[cols], gapClasses[gap], className)}
      {...props}
    >
      {children}
    </Component>
  );
};
