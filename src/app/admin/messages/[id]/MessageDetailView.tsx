"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ContactMessage, MessageStatus } from "@prisma/client";
import { changeMessageStatusAction } from "@/features/messages/actions";

interface Props {
  message: ContactMessage;
}

const STATUS_OPTIONS: Record<MessageStatus, string> = {
  NEW: "Baru (Belum Dibaca)",
  READ: "Sudah Dibaca",
  IN_PROGRESS: "Sedang Diproses",
  RESOLVED: "Selesai Ditindaklanjuti",
  ARCHIVED: "Diarsipkan",
};

export function MessageDetailView({ message }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = React.useState<string | null>(null);

  function handleStatusChange(nextStatus: MessageStatus) {
    setFeedback(null);
    startTransition(async () => {
      const res = await changeMessageStatusAction(message.id, nextStatus);
      if (res.success) {
        setFeedback(`Status pesan berhasil diubah menjadi ${nextStatus}.`);
        router.refresh();
      }
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Pesan dari {message.name}</h1>
          <p className="mt-0.5 text-xs text-neutral-400">
            Diterima pada {new Date(message.createdAt).toLocaleString("id-ID")}
          </p>
        </div>
        <Link href="/admin/messages" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Kembali ke Inbox
        </Link>
      </div>

      {feedback && (
        <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">{feedback}</div>
      )}

      {/* Status control */}
      <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Status Pesan Saat Ini:</span>
          <span className="ml-2 text-sm font-medium text-neutral-900">{STATUS_OPTIONS[message.status]}</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            defaultValue={message.status}
            disabled={isPending}
            onChange={(e) => handleStatusChange(e.target.value as MessageStatus)}
            className="h-8 rounded border border-neutral-200 bg-white px-2.5 text-xs outline-none focus:border-neutral-900"
          >
            {Object.entries(STATUS_OPTIONS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Message Content */}
      <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4 border-b border-neutral-100 pb-4 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Pengirim</p>
            <p className="mt-1 font-medium text-neutral-900">{message.name}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Email</p>
            <p className="mt-1 font-medium text-neutral-900">
              <a href={`mailto:${message.email}`} className="underline hover:text-neutral-600">
                {message.email}
              </a>
            </p>
          </div>
          {message.organization && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Organisasi / Institusi</p>
              <p className="mt-1 text-neutral-700">{message.organization}</p>
            </div>
          )}
          {message.phone && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Nomor Telepon</p>
              <p className="mt-1 text-neutral-700">{message.phone}</p>
            </div>
          )}
          {message.areaOfInterest && (
            <div className="col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Tipe / Bidang Kolaborasi</p>
              <div className="mt-1">
                <span className="inline-flex items-center rounded-full bg-[#0D5C4D]/10 px-3 py-1 text-xs font-semibold text-[#0D5C4D] border border-[#0D5C4D]/25">
                  {message.areaOfInterest}
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Subjek</p>
          <p className="mt-1 text-base font-medium text-neutral-900">{message.subject}</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Isi Pesan</p>
          <div className="mt-2 rounded-md bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-800 whitespace-pre-wrap">
            {message.message}
          </div>
        </div>
      </div>
    </div>
  );
}
