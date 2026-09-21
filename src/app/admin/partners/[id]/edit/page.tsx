import React from "react";
import { notFound } from "next/navigation";
import { findPartnerById } from "@/server/repositories/partner.repository";
import { PartnerEditForm } from "./PartnerEditForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Edit Mitra — ANTRABUMI Admin" };

export default async function EditPartnerPage({ params }: PageProps) {
  const { id } = await params;
  const partner = await findPartnerById(id);

  if (!partner) {
    notFound();
  }

  return <PartnerEditForm partner={partner} />;
}
