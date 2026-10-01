import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth/context";
import { findUsers } from "@/server/repositories/user.repository";
import { UsersManager } from "./UsersManager";

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export const metadata = { title: "Manajemen Pengguna — ANTRABUMI Admin" };
export const dynamic = "force-dynamic";

export default async function UsersPage({ searchParams }: PageProps) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/admin/login?from=%2Fadmin%2Fusers");

  if (currentUser.role !== Role.SUPER_ADMIN) {
    return (
      <section
        role="alert"
        className="mx-auto max-w-2xl space-y-4 rounded-lg border border-amber-200 bg-amber-50 p-6"
      >
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Akses tidak tersedia</h1>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700">
            Manajemen pengguna hanya dapat diakses oleh Super Admin. Role akun Anda: {currentUser.role}.
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-flex rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Kembali ke dashboard
        </Link>
      </section>
    );
  }

  const params = await searchParams;
  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const search = params.q;

  const { items, total } = await findUsers({ page, search });

  return (
    <UsersManager
      users={items}
      total={total}
      currentPage={page}
      currentUserId={currentUser.id}
      search={search}
    />
  );
}
