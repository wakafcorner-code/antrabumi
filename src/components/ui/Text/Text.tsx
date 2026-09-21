import React, { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { BaseComponentProps, TextVariant } from "@/types";

export interface TextProps extends HTMLAttributes<HTMLElement>, BaseComponentProps {
  as?: ElementType;
  variant?: TextVariant;
  muted?: boolean;
}

/**
 * Reusable Text Component
 * Provides editorial typography variants with WCAG-compliant line-heights.
 */
export const Text: React.FC<TextProps> = ({
  as: Component = "p",
  variant = "body",
  muted = false,
  className,
  children,
  ...props
}) => {
  const variantStyles: Record<TextVariant, string> = {
    "body-large": "type-body-l",
    body: "type-body",
    "body-small": "type-body-s",
    caption: "type-caption text-neutral-500",
    eyebrow: "type-eyebrow text-neutral-600 tracking-wider",
  };

  return (
    <Component
      className={cn(
        "font-body",
        variantStyles[variant],
        muted && variant !== "caption" && "text-neutral-600",
        !muted && variant !== "caption" && variant !== "eyebrow" && "text-neutral-800",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
