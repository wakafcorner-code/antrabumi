"use client";

import React from "react";

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="flex min-h-screen items-center justify-center bg-white p-6 text-neutral-900">
        <div className="max-w-md space-y-4 text-center">
          <h1 className="font-serif text-2xl font-bold text-neutral-950">
            Terjadi Kesalahan Sistem
          </h1>
          <p className="text-sm text-neutral-600">
            Terjadi kendala pada tingkat root aplikasi. Silakan muat ulang halaman.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Muat Ulang
          </button>
        </div>
      </body>
    </html>
  );
}
