import React, { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { BaseComponentProps, ContainerSize } from "@/types";

export interface ContainerProps extends HTMLAttributes<HTMLElement>, BaseComponentProps {
  as?: ElementType;
  size?: ContainerSize;
}

/**
 * Reusable Container Component
 *
 * Implements standard responsive gutters:
 * - Desktop: 32-48px (via px-8 lg:px-10)
 * - Tablet: 24-32px (via md:px-6)
 * - Mobile: 20-24px (via px-5)
 *
 * Max width:
 * - default: 1280px (max-w-7xl)
 * - reading: 760px (max-w-3xl)
 * - full: 100%
 */
export const Container: React.FC<ContainerProps> = ({
  as: Component = "div",
  size = "default",
  className,
  children,
  ...props
}) => {
  const sizeClasses = {
    default: "max-w-[1280px]",
    reading: "max-w-[760px]",
    full: "max-w-full",
  };

  return (
    <Component
      className={cn("mx-auto w-full px-5 md:px-7 lg:px-10", sizeClasses[size], className)}
      {...props}
    >
      {children}
    </Component>
  );
};
