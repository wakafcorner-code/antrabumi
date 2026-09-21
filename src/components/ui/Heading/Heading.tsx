import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { BaseComponentProps, HeadingLevel, HeadingVisualVariant } from "@/types";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement>, BaseComponentProps {
  level?: HeadingLevel;
  visualLevel?: HeadingVisualVariant;
}

/**
 * Reusable Heading Component
 * Decouples semantic heading level (h1-h6) from visual typography scale (Display XL - H5).
 */
export const Heading: React.FC<HeadingProps> = ({
  level = "h2",
  visualLevel,
  className,
  children,
  ...props
}) => {
  const Component = level;
  const effectiveVisual = visualLevel || (level as HeadingVisualVariant);

  const visualStyles: Record<HeadingVisualVariant, string> = {
    "display-xl": "type-display-xl",
    "display-l": "type-display-l",
    h1: "type-h1",
    h2: "type-h2",
    h3: "type-h3",
    h4: "type-h4",
    h5: "type-h5",
  };

  return (
    <Component
      className={cn(
        "font-heading font-semibold tracking-tight text-neutral-950",
        visualStyles[effectiveVisual],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
