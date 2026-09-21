import React from "react";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-16">
      <Container size="reading">
        <div className="space-y-6 text-center">
          <span className="rounded-pill bg-neutral-100 px-3 py-1 font-mono text-sm text-neutral-400">
            404 Not Found
          </span>
          <Heading level="h1" visualLevel="display-l">
            Halaman Tidak Ditemukan
          </Heading>
          <Text variant="body-large" muted className="mx-auto max-w-md">
            Halaman yang Anda cari tidak tersedia, telah dipindahkan, atau tautan yang dituju tidak
            valid.
          </Text>
          <div className="flex justify-center gap-4 pt-4">
            <Button variant="primary" href="/">
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
