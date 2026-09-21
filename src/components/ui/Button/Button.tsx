import React, { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { ButtonVariant, ButtonSize } from "@/types";

type BaseButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
};

// Discriminated union: If href is provided, render anchor tag; otherwise render HTML button tag
export type ButtonAsButton = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export type ButtonAsLink = BaseButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Reusable Button Component
 * WCAG 2.2 AA compliant with visible keyboard focus states and loading accessibility.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none";

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-gradient-to-r from-[#0D5C4D] via-[#116958] to-[#147A66] hover:from-[#116958] hover:to-[#0D5C4D] text-white shadow-md shadow-[#0D5C4D]/25 hover:shadow-lg hover:shadow-[#0D5C4D]/35 transition-all hover:-translate-y-0.5",
    secondary:
      "bg-[#FDF2EB] text-[#D96B27] hover:bg-[#D96B27] hover:text-white border border-[#D96B27]/30 transition-all shadow-xs",
    tertiary:
      "bg-transparent text-[#0D5C4D] border-2 border-[#0D5C4D]/40 hover:border-[#0D5C4D] hover:bg-[#0D5C4D]/5 active:bg-[#0D5C4D]/10 transition-all font-semibold",
    ghost:
      "bg-transparent text-neutral-700 hover:bg-[#0D5C4D]/8 hover:text-[#0D5C4D] active:bg-[#0D5C4D]/15 transition-all",
    text: "bg-transparent text-[#0D5C4D] underline-offset-4 hover:underline p-0 h-auto focus-visible:outline-offset-4 font-semibold",
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "text-xs px-4 py-2 rounded-lg gap-1.5 min-h-[34px]",
    md: "text-sm px-5 py-2.5 rounded-lg gap-2 min-h-[42px]",
    lg: "text-base px-7 py-3.5 rounded-xl gap-2.5 min-h-[50px]",
  };

  const combinedClassName = cn(
    baseStyles,
    variantStyles[variant],
    variant !== "text" && sizeStyles[size],
    className,
  );

  const loadingSpinner = (
    <svg
      className="-ml-1 mr-2 h-4 w-4 animate-spin text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Render as link if href is present
  if ("href" in props && typeof props.href === "string") {
    const { href, ...linkProps } = props as ButtonAsLink;
    return (
      <a
        href={href}
        className={combinedClassName}
        aria-busy={isLoading ? "true" : undefined}
        {...linkProps}
      >
        {isLoading && loadingSpinner}
        {children}
      </a>
    );
  }

  // Render as button
  const { type = "button", disabled, ...buttonProps } = props as ButtonAsButton;
  return (
    <button
      type={type}
      className={combinedClassName}
      disabled={disabled || isLoading}
      aria-busy={isLoading ? "true" : undefined}
      {...buttonProps}
    >
      {isLoading && loadingSpinner}
      {children}
    </button>
  );
};
