import React from "react";
import { notFound } from "next/navigation";
import { findMessageById } from "@/server/repositories/message.repository";
import { MessageDetailView } from "./MessageDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Detail Pesan Masuk — ANTRABUMI Admin" };

export default async function MessageDetailPage({ params }: PageProps) {
  const { id } = await params;
  const message = await findMessageById(id);

  if (!message) {
    notFound();
  }

  return <MessageDetailView message={message} />;
}
