import React from "react";
import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center py-16"
      role="status"
      aria-live="polite"
    >
      <Container size="reading">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
          <p className="text-sm font-medium text-neutral-600">Memuat halaman...</p>
          <span className="sr-only">Mohon tunggu, konten sedang dimuat.</span>
        </div>
      </Container>
    </div>
  );
}
