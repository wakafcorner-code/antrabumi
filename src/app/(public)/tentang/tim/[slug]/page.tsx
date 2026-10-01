import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLanguage } from "@/lib/i18n/language";
import { findPublishedPersonBySlug } from "@/server/repositories/person.repository";
import { Container } from "@/components/ui/Container";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function PersonPage({ params }: PageProps) {
  const { slug } = await params;
  const language = await getLanguage();
  const person = await findPublishedPersonBySlug(slug, language);

  if (!person) notFound();

  return (
    <main className="bg-[#FAF9F5] px-4 py-10 sm:px-6 sm:py-24">
      <Container size="default">
        <Link
          href="/tentang#tim"
          className="inline-flex max-w-full items-center text-sm font-medium text-[#0D5C4D] hover:underline"
        >
          <span aria-hidden="true">←</span>
          <span className="ml-2 truncate">Kembali ke Tim & Kolektif</span>
        </Link>

        <article className="mx-auto mt-6 grid w-full max-w-5xl grid-cols-1 gap-7 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-sm sm:mt-8 sm:gap-10 sm:rounded-3xl sm:p-10 lg:grid-cols-[280px_1fr]">
          <div className="mx-auto w-full max-w-[220px] sm:max-w-none">
            {person.imageUrl ? (
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={person.imageUrl}
                  alt={person.imageAlt || person.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-[#0D5C4D]/15 bg-[#0D5C4D]/10 font-heading text-5xl font-black text-[#0D5C4D]">
                {person.name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((name) => name[0])
                  .join("")}
              </div>
            )}
          </div>

          <div className="min-w-0 self-center">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0D5C4D] sm:text-xs sm:tracking-[0.25em]">
              06 / Tim & Kolektif
            </p>
            <h1 className="mt-3 break-words font-heading text-3xl font-extrabold leading-tight tracking-tight text-neutral-950 sm:text-5xl">
              {person.name}
            </h1>
            {person.role && (
              <p className="mt-4 inline-block rounded-md bg-[#0D5C4D]/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0D5C4D]">
                {person.role}
              </p>
            )}
            {person.degree && !person.name.includes(person.degree) && (
              <p className="mt-2 font-mono text-sm text-neutral-400">{person.degree}</p>
            )}
            {person.biography && (
              <div className="mt-6 whitespace-pre-line break-words text-sm leading-relaxed text-neutral-600 sm:mt-8 sm:text-base">
                {person.biography}
              </div>
            )}
          </div>
        </article>
      </Container>
    </main>
  );
}