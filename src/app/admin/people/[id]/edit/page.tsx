import React from "react";
import { notFound } from "next/navigation";
import { findPersonById } from "@/server/repositories/person.repository";
import { PersonEditForm } from "./PersonEditForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Edit Profil Tim — ANTRABUMI Admin" };

export default async function EditPersonPage({ params }: PageProps) {
  const { id } = await params;
  const person = await findPersonById(id);

  if (!person) {
    notFound();
  }

  return <PersonEditForm person={person} />;
}
