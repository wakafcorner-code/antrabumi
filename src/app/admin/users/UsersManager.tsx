"use client";

import React, { useTransition, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Role, UserStatus } from "@prisma/client";
import { UserListItem } from "@/server/repositories/user.repository";
import {
  changeUserRoleAction,
  changeUserStatusAction,
  createUserAction,
  editUserProfileAction,
  changeUserPasswordAction,
} from "@/features/users/actions";

// ── Role & Status helpers ──────────────────────────────────────────────────────

const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
  AUTHOR: "Author",
};

const ROLE_COLORS: Record<Role, string> = {
  SUPER_ADMIN: "bg-neutral-900 text-white",
  ADMIN: "bg-neutral-700 text-white",
  EDITOR: "bg-emerald-100 text-emerald-800",
  AUTHOR: "bg-blue-100 text-blue-800",
};

const STATUS_COLORS: Record<UserStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SUSPENDED: "bg-red-50 text-red-700 border-red-200",
  INACTIVE: "bg-neutral-100 text-neutral-500 border-neutral-200",
};

// ── Input style ────────────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:bg-white focus:ring-2 focus:ring-neutral-900/10";

// ── Props ──────────────────────────────────────────────────────────────────────

interface Props {
  users: UserListItem[];
  total: number;
  currentPage: number;
  currentUserId: string;
  search?: string;
}

// ── Modal types ────────────────────────────────────────────────────────────────

type ModalType =
  | { kind: "none" }
  | { kind: "create" }
  | { kind: "edit"; user: UserListItem }
  | { kind: "password"; user: UserListItem };

// ── Component ──────────────────────────────────────────────────────────────────

export function UsersManager({ users, total, currentPage, currentUserId, search }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<ModalType>({ kind: "none" });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});
  const totalPages = Math.max(1, Math.ceil(total / 20));
  const page = Math.min(Math.max(currentPage, 1), totalPages);

  // ── helpers ────────────────────────────────────────────────────────────────

  function flash(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  function closeModal() {
    setModal({ kind: "none" });
    setErrorMsg(null);
    setFieldErrors({});
  }

  // ── inline table actions ───────────────────────────────────────────────────

  function handleRoleChange(userId: string, role: Role) {
    setErrorMsg(null);
    startTransition(async () => {
      const res = await changeUserRoleAction(userId, role);
      if (!res.success) setErrorMsg(res.error ?? "Gagal mengubah peran.");
      else router.refresh();
    });
  }

  function handleStatusChange(userId: string, status: UserStatus) {
    setErrorMsg(null);
    startTransition(async () => {
      const res = await changeUserStatusAction(userId, status);
      if (!res.success) setErrorMsg(res.error ?? "Gagal mengubah status.");
      else router.refresh();
    });
  }

  // ── form submit handlers ───────────────────────────────────────────────────

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    setFieldErrors({});
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createUserAction(fd);
      if (!res.success) {
        setErrorMsg(res.error ?? "Gagal membuat pengguna.");
        setFieldErrors((res as { fieldErrors?: Record<string, string[]> }).fieldErrors ?? {});
      } else {
        closeModal();
        flash("✓ Pengguna berhasil dibuat.");
        router.refresh();
      }
    });
  }

  function handleEditProfile(e: React.FormEvent<HTMLFormElement>, userId: string) {
    e.preventDefault();
    setErrorMsg(null);
    setFieldErrors({});
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await editUserProfileAction(userId, fd);
      if (!res.success) {
        setErrorMsg(res.error ?? "Gagal menyimpan perubahan.");
        setFieldErrors((res as { fieldErrors?: Record<string, string[]> }).fieldErrors ?? {});
      } else {
        closeModal();
        flash("✓ Profil pengguna berhasil diperbarui.");
        router.refresh();
      }
    });
  }

  function handleChangePassword(e: React.FormEvent<HTMLFormElement>, userId: string) {
    e.preventDefault();
    setErrorMsg(null);
    setFieldErrors({});
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await changeUserPasswordAction(userId, fd);
      if (!res.success) {
        setErrorMsg(res.error ?? "Gagal mengubah password.");
        setFieldErrors((res as { fieldErrors?: Record<string, string[]> }).fieldErrors ?? {});
      } else {
        closeModal();
        flash("✓ Password berhasil diubah.");
        router.refresh();
      }
    });
  }

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">Manajemen Pengguna</h1>
            <p className="mt-0.5 text-sm text-neutral-500">
              {total} akun terdaftar · Khusus Super Admin
            </p>
          </div>
          <button
            id="btn-add-user"
            onClick={() => setModal({ kind: "create" })}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-[#0D5C4D] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#116958]"
          >
            + Tambah Pengguna
          </button>
        </div>

        {/* Feedback */}
        {successMsg && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
            {successMsg}
          </div>
        )}
        {errorMsg && modal.kind === "none" && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Search */}
        <form method="GET" className="flex items-center gap-3">
          <input
            name="q"
            defaultValue={search}
            placeholder="Cari nama atau email…"
            className="h-9 w-full min-w-0 rounded-md border border-neutral-200 bg-white px-3 text-xs outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 sm:w-64"
          />
          <button
            type="submit"
            className="h-9 rounded-md border border-neutral-200 bg-white px-4 text-xs font-medium hover:bg-neutral-50 transition"
          >
            Cari
          </button>
        </form>

        {/* Table */}
        {users.length === 0 ? (
          <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-white text-center p-6">
            <p className="text-sm text-neutral-500">Tidak ada pengguna ditemukan.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Pengguna
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Peran
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Login Terakhir
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {users.map((u) => {
                  const isSelf = u.id === currentUserId;
                  return (
                    <tr key={u.id} className="hover:bg-neutral-50/60 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {/* Avatar circle */}
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                            {u.name.charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <p className="font-semibold text-neutral-900 text-xs leading-tight">
                              {u.name}
                              {isSelf && (
                                <span className="ml-1.5 rounded bg-[#0D5C4D]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#0D5C4D]">
                                  Anda
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-neutral-400 mt-0.5 font-mono">
                              #{u.id.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-xs text-neutral-600 font-mono">
                        {u.email}
                      </td>

                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          disabled={isPending || isSelf}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                          className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs font-medium outline-none focus:border-neutral-900 disabled:opacity-60"
                        >
                          {Object.values(Role).map((r) => (
                            <option key={r} value={r}>
                              {ROLE_LABELS[r]}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-4 py-3">
                        <select
                          value={u.status}
                          disabled={isPending || isSelf}
                          onChange={(e) => handleStatusChange(u.id, e.target.value as UserStatus)}
                          className={`rounded-md border px-2 py-1 text-xs font-medium outline-none disabled:opacity-60 ${STATUS_COLORS[u.status]}`}
                        >
                          {Object.values(UserStatus).map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-4 py-3 text-xs text-neutral-500 font-mono" suppressHydrationWarning>
                        {u.lastLoginAt
                          ? new Date(u.lastLoginAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setModal({ kind: "edit", user: u })}
                            className="inline-flex items-center rounded-md border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:border-[#0D5C4D] hover:text-[#0D5C4D] transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setModal({ kind: "password", user: u })}
                            className="inline-flex items-center rounded-md border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:border-amber-400 hover:text-amber-700 transition"
                          >
                            Password
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {total > 20 && (
          <nav aria-label="Navigasi halaman pengguna" className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">
              Halaman {page} dari {totalPages}
            </span>
            <div className="flex items-center gap-2">
              {page > 1 ? (
                <Link
                  href={usersPageUrl(page - 1, search)}
                  className="rounded-md border border-neutral-200 px-3 py-1.5 text-neutral-700 hover:bg-neutral-50"
                >
                  Sebelumnya
                </Link>
              ) : (
                <span aria-disabled="true" className="rounded-md border border-neutral-100 px-3 py-1.5 text-neutral-300">
                  Sebelumnya
                </span>
              )}
              {page < totalPages ? (
                <Link
                  href={usersPageUrl(page + 1, search)}
                  className="rounded-md border border-neutral-200 px-3 py-1.5 text-neutral-700 hover:bg-neutral-50"
                >
                  Berikutnya
                </Link>
              ) : (
                <span aria-disabled="true" className="rounded-md border border-neutral-100 px-3 py-1.5 text-neutral-300">
                  Berikutnya
                </span>
              )}
            </div>
          </nav>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}

      {modal.kind !== "none" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white shadow-2xl">

            {/* ── CREATE USER ─────────────────────────────────────────────── */}
            {modal.kind === "create" && (
              <form onSubmit={handleCreate} className="space-y-4 p-6">
                <ModalHeader title="Tambah Pengguna Baru" onClose={closeModal} />

                {errorMsg && <ErrorBox msg={errorMsg} />}

                <Field label="Nama Lengkap *" error={fieldErrors.name?.[0]}>
                  <input name="name" required autoFocus className={inputCls} placeholder="Contoh: Budi Santoso" />
                </Field>

                <Field label="Email *" error={fieldErrors.email?.[0]}>
                  <input name="email" type="email" required className={inputCls} placeholder="budi@antrabumi.org" />
                </Field>

                <Field label="Password *" error={fieldErrors.password?.[0]}>
                  <input name="password" type="password" required className={inputCls} placeholder="Min. 8 karakter" />
                </Field>

                <Field label="Peran (Role) *" error={fieldErrors.role?.[0]}>
                  <select name="role" defaultValue="EDITOR" className={inputCls}>
                    {Object.values(Role).map((r) => (
                      <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                    ))}
                  </select>
                </Field>

                <ModalActions onCancel={closeModal} isPending={isPending} submitLabel="Buat Pengguna" />
              </form>
            )}

            {/* ── EDIT PROFILE (nama + email) ──────────────────────────────── */}
            {modal.kind === "edit" && (
              <form onSubmit={(e) => handleEditProfile(e, modal.user.id)} className="space-y-4 p-6">
                <ModalHeader title={`Edit Profil — ${modal.user.name}`} onClose={closeModal} />

                {errorMsg && <ErrorBox msg={errorMsg} />}

                <Field label="Nama Lengkap" error={fieldErrors.name?.[0]}>
                  <input
                    name="name"
                    defaultValue={modal.user.name}
                    required
                    autoFocus
                    className={inputCls}
                  />
                </Field>

                <Field label="Alamat Email" error={fieldErrors.email?.[0]}>
                  <input
                    name="email"
                    type="email"
                    defaultValue={modal.user.email}
                    required
                    className={inputCls}
                  />
                </Field>

                <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-xs text-neutral-500">
                  <span className="font-semibold text-neutral-700">Peran saat ini: </span>
                  <span className={`inline-block rounded px-1.5 py-0.5 font-semibold text-[10px] ${ROLE_COLORS[modal.user.role]}`}>
                    {ROLE_LABELS[modal.user.role]}
                  </span>
                  <span className="ml-2 text-neutral-400">
                    (ubah peran langsung di tabel)
                  </span>
                </div>

                <ModalActions onCancel={closeModal} isPending={isPending} submitLabel="Simpan Perubahan" />
              </form>
            )}

            {/* ── CHANGE PASSWORD ──────────────────────────────────────────── */}
            {modal.kind === "password" && (
              <form onSubmit={(e) => handleChangePassword(e, modal.user.id)} className="space-y-4 p-6">
                <ModalHeader title={`Ganti Password — ${modal.user.name}`} onClose={closeModal} />

                {errorMsg && <ErrorBox msg={errorMsg} />}

                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
                  Password lama akan diganti permanen. Pengguna harus login ulang.
                </div>

                <Field label="Password Baru *" error={fieldErrors.password?.[0]}>
                  <input
                    name="password"
                    type="password"
                    required
                    autoFocus
                    className={inputCls}
                    placeholder="Min. 8 karakter"
                  />
                </Field>

                <Field label="Konfirmasi Password *" error={fieldErrors.confirmPassword?.[0]}>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    className={inputCls}
                    placeholder="Ulangi password baru"
                  />
                </Field>

                <ModalActions
                  onCancel={closeModal}
                  isPending={isPending}
                  submitLabel="Ubah Password"
                  submitClassName="bg-amber-600 hover:bg-amber-700"
                />
              </form>
            )}

          </div>
        </div>
      )}
    </>
  );
}

function usersPageUrl(page: number, search?: string) {
  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set("q", search);
  return `/admin/users?${params.toString()}`;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
      <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
      <button
        type="button"
        onClick={onClose}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
      >
        ✕
      </button>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
      {msg}
    </div>
  );
}

function ModalActions({
  onCancel,
  isPending,
  submitLabel,
  submitClassName = "bg-neutral-900 hover:opacity-80",
}: {
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
  submitClassName?: string;
}) {
  return (
    <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="h-9 rounded-md border border-neutral-200 px-4 text-sm hover:bg-neutral-50 transition"
      >
        Batal
      </button>
      <button
        type="submit"
        disabled={isPending}
        className={`h-9 rounded-md px-5 text-sm font-medium text-white transition disabled:opacity-50 ${submitClassName}`}
      >
        {isPending ? "Menyimpan…" : submitLabel}
      </button>
    </div>
  );
}
