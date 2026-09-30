import React from "react";
import { notFound } from "next/navigation";
import { findExperienceById } from "@/server/repositories/experience.repository";
import { ExperienceEditForm } from "@/app/admin/experiences/[id]/edit/ExperienceEditForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Edit Inisiatif — ANTRABUMI Admin" };

export default async function EditInitiativePage({ params }: PageProps) {
  const { id } = await params;
  const exp = await findExperienceById(id);

  if (!exp) notFound();

  return <ExperienceEditForm experience={exp} backHref="/admin/initiatives" />;
}
