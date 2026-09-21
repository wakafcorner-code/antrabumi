import React from "react";
import { ContentStatus } from "@prisma/client";

const CONFIG: Record<
  ContentStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Draft",
    className: "bg-neutral-100 text-neutral-600",
  },
  REVIEW: {
    label: "Review",
    className: "bg-amber-100 text-amber-700",
  },
  PUBLISHED: {
    label: "Published",
    className: "bg-emerald-100 text-emerald-700",
  },
  ARCHIVED: {
    label: "Archived",
    className: "bg-neutral-200 text-neutral-500",
  },
};

interface StatusBadgeProps {
  status: ContentStatus;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const { label, className: base } = CONFIG[status] ?? CONFIG.DRAFT;
  return (
    <span
      className={[
        "inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        base,
        className,
      ].join(" ")}
    >
      {label}
    </span>
  );
}
