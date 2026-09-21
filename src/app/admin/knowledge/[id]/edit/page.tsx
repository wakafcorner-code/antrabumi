import React from "react";
import { notFound } from "next/navigation";
import { findKnowledgeById } from "@/server/repositories/knowledge.repository";
import { KnowledgeEditForm } from "./KnowledgeEditForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Edit Konten Pengetahuan — ANTRABUMI Admin" };

export default async function EditKnowledgePage({ params }: PageProps) {
  const { id } = await params;
  const knowledge = await findKnowledgeById(id);

  if (!knowledge) {
    notFound();
  }

  return <KnowledgeEditForm knowledge={knowledge} />;
}
