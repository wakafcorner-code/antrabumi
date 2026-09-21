"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Role, UserStatus } from "@prisma/client";
import { UserListItem } from "@/server/repositories/user.repository";
import { changeUserRoleAction, changeUserStatusAction } from "@/features/users/actions";

interface Props {
  users: UserListItem[];
  currentUserId: string;
}

export function UsersClientTable({ users, currentUserId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  function handleRoleChange(userId: string, role: Role) {
    setErrorMsg(null);
    startTransition(async () => {
      const res = await changeUserRoleAction(userId, role);
      if (!res.success) {
        setErrorMsg(res.error ?? "Gagal mengubah peran user.");
      } else {
        router.refresh();
      }
    });
  }

  function handleStatusChange(userId: string, status: UserStatus) {
    setErrorMsg(null);
    startTransition(async () => {
      const res = await changeUserStatusAction(userId, status);
      if (!res.success) {
        setErrorMsg(res.error ?? "Gagal mengubah status user.");
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{errorMsg}</div>
      )}

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Nama</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Peran (Role)</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Login Terakhir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {users.map((u) => {
              const isSelf = u.id === currentUserId;
              return (
                <tr key={u.id} className="hover:bg-neutral-50/50">
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {u.name}
                    {isSelf && (
                      <span className="ml-2 rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-600">
                        Anda
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      disabled={isPending || isSelf}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                      className="rounded border border-neutral-200 bg-white px-2 py-1 text-xs font-medium outline-none focus:border-neutral-900 disabled:opacity-60"
                    >
                      {Object.values(Role).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.status}
                      disabled={isPending || isSelf}
                      onChange={(e) => handleStatusChange(u.id, e.target.value as UserStatus)}
                      className={`rounded border px-2 py-1 text-xs font-medium outline-none disabled:opacity-60 ${
                        u.status === "ACTIVE"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : u.status === "SUSPENDED"
                          ? "border-red-200 bg-red-50 text-red-800"
                          : "border-neutral-200 bg-neutral-50 text-neutral-600"
                      }`}
                    >
                      {Object.values(UserStatus).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-500">
                    {u.lastLoginAt
                      ? new Date(u.lastLoginAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Belum pernah"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
