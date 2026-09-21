"use client";

import React, { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log sanitized error message internally in production (digest only)
    console.error("Application Error:", error.digest || "An unexpected error occurred");
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-16">
      <Container size="reading">
        <div className="space-y-6 text-center">
          <span className="rounded-pill border border-red-200 bg-red-50 px-3 py-1 font-mono text-sm text-red-600">
            Terjadi Kesalahan
          </span>
          <Heading level="h1" visualLevel="h1">
            Maaf, Terjadi Kendala Teknis
          </Heading>
          <Text variant="body" muted className="mx-auto max-w-md">
            Sistem kami mengalami kendala dalam memproses permintaan Anda. Tidak ada informasi
            sensitif yang terekspos.
          </Text>
          <div className="flex justify-center gap-4 pt-4">
            <Button variant="primary" onClick={() => reset()}>
              Coba Lagi
            </Button>
            <Button variant="secondary" href="/">
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
