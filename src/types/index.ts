import { ReactNode } from "react";

/**
 * Base Props for UI Components
 */
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

/**
 * Supported Locales for ANTRABUMI
 */
export type Locale = "id" | "en";

/**
 * Button Variants and Sizes
 */
export type ButtonVariant = "primary" | "secondary" | "tertiary" | "ghost" | "text";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Heading Levels and Visual Variants
 */
export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type HeadingVisualVariant = "display-xl" | "display-l" | "h1" | "h2" | "h3" | "h4" | "h5";

/**
 * Text Variants
 */
export type TextVariant = "body-large" | "body" | "body-small" | "caption" | "eyebrow";

/**
 * Badge Variants
 */
export type BadgeVariant =
  "default" | "primary" | "neutral" | "success" | "warning" | "error" | "outline";

/**
 * Container Sizes
 */
export type ContainerSize = "default" | "reading" | "full";

/**
 * Navigation Item Placeholder
 */
export interface NavigationItem {
  label: string;
  href: string;
  isExternal?: boolean;
}
