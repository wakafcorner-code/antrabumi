import React from "react";
import { Role } from "@prisma/client";
import { requireUser } from "@/lib/auth/context";
import { findUsers } from "@/server/repositories/user.repository";
import { UsersManager } from "./UsersManager";

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export const metadata = { title: "Manajemen Pengguna — ANTRABUMI Admin" };
export const dynamic = "force-dynamic";

export default async function UsersPage({ searchParams }: PageProps) {
  const currentUser = await requireUser(Role.SUPER_ADMIN);

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
