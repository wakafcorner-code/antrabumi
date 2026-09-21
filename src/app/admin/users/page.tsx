import React from "react";
import { Role } from "@prisma/client";
import { requireUser } from "@/lib/auth/context";
import { findUsers } from "@/server/repositories/user.repository";
import { UsersClientTable } from "./UsersClientTable";

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export const metadata = { title: "Manajemen Pengguna — ANTRABUMI Admin" };

export default async function UsersPage({ searchParams }: PageProps) {
  // Only SUPER_ADMIN can view and manage users
  const currentUser = await requireUser(Role.SUPER_ADMIN);

  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const search = params.q;

  const { items, total } = await findUsers({ page, search });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Manajemen Pengguna</h1>
          <p className="mt-0.5 text-sm text-neutral-500">
            {total} total akun terdaftar (Khusus Super Admin)
          </p>
        </div>
      </div>

      <form method="GET" className="flex items-center gap-3">
        <input
          name="q"
          defaultValue={search}
          placeholder="Cari nama atau email…"
          className="h-9 rounded-md border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-900"
        />
        <button type="submit" className="h-9 rounded-md border border-neutral-200 px-3 text-sm hover:bg-neutral-50">
          Cari
        </button>
      </form>

      <UsersClientTable users={items} currentUserId={currentUser.id} />
    </div>
  );
}
