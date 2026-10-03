@php
    $pdfAttachments = $experience->media->filter(fn ($media) => $media->type === \App\Enums\MediaType::DOCUMENT && $media->mimeType === 'application/pdf');
    $galleryImages = $experience->media->filter(fn ($media) => $media->type === \App\Enums\MediaType::IMAGE);
@endphp

<section class="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
    <div>
        <h2 class="text-sm font-semibold text-neutral-900">Dokumen / Laporan PDF</h2>
        <p class="mt-1 text-xs text-neutral-500">Lampiran PDF yang terhubung ke konten ini.</p>
    </div>
    @forelse($pdfAttachments as $pdf)
        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-3">
            <a href="{{ $pdf->url }}" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-neutral-800 underline">{{ $pdf->originalName ?: $pdf->filename }}</a>
            <form method="POST" action="{{ route('admin.experiences.media.pdf.destroy', [$experience, $pdf]) }}" onsubmit="return confirm('Lepas lampiran PDF ini?')">
                @csrf
                @method('DELETE')
                <button type="submit" class="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">Lepas PDF</button>
            </form>
        </div>
    @empty
        <p class="border-t border-neutral-100 pt-3 text-sm text-neutral-500">Belum ada lampiran PDF.</p>
    @endforelse
    <form id="experience-pdf-upload-form" method="POST" action="{{ route('admin.experiences.media.pdf.store', $experience) }}" class="space-y-2 border-t border-neutral-100 pt-4">
        @csrf
        <input type="hidden" name="mediaId" id="experience-pdf-media-id">
        <label for="experience-pdf-file" class="block text-xs font-semibold uppercase tracking-wide text-neutral-600">Unggah PDF</label>
        <div class="flex flex-wrap items-center gap-3">
            <input id="experience-pdf-file" type="file" accept="application/pdf,.pdf" class="min-w-0 flex-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm">
            <button type="submit" class="rounded-md bg-neutral-900 px-4 py-2 text-xs font-semibold text-white">Lampirkan PDF</button>
        </div>
        <p id="experience-pdf-upload-error" class="hidden text-xs text-red-700" role="alert"></p>
    </form>
</section>

<section class="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
    <div>
        <h2 class="text-sm font-semibold text-neutral-900">Galeri Gambar</h2>
        <p class="mt-1 text-xs text-neutral-500">Gambar yang terhubung ke konten ini.</p>
    </div>
    @forelse($galleryImages as $image)
        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-3">
            <div class="flex items-center gap-3">
                <img src="{{ $image->url }}" alt="{{ $image->originalName }}" class="h-16 w-24 rounded-md border border-neutral-200 object-cover">
                <span class="text-sm font-medium text-neutral-800">{{ $image->originalName ?: $image->filename }}</span>
            </div>
            <form method="POST" action="{{ route('admin.experiences.media.gallery.destroy', [$experience, $image]) }}" onsubmit="return confirm('Lepas gambar ini dari galeri?')">
                @csrf
                @method('DELETE')
                <button type="submit" class="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">Lepas gambar</button>
            </form>
        </div>
    @empty
        <p class="border-t border-neutral-100 pt-3 text-sm text-neutral-500">Belum ada gambar galeri.</p>
    @endforelse
    <div class="border-t border-neutral-100 pt-4">
        <label for="experience-gallery-files" class="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Unggah gambar</label>
        <input id="experience-gallery-files" type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" class="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm">
        <p id="experience-gallery-upload-error" class="mt-2 hidden text-xs text-red-700" role="alert"></p>
    </div>
</section>

<script>
    (() => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content ?? '';
        const pdfForm = document.getElementById('experience-pdf-upload-form');
        const pdfInput = document.getElementById('experience-pdf-file');
        const pdfMediaId = document.getElementById('experience-pdf-media-id');
        const pdfError = document.getElementById('experience-pdf-upload-error');
        const pdfButton = pdfForm.querySelector('button[type="submit"]');
        let allowPdfSubmit = false;

        pdfForm.addEventListener('submit', async (event) => {
            const file = pdfInput.files?.[0];
            if (allowPdfSubmit || !file) return;

            event.preventDefault();
            pdfError.textContent = '';
            pdfError.classList.add('hidden');
            if (file.size > 15 * 1024 * 1024 || (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf'))) {
                pdfError.textContent = file.size > 15 * 1024 * 1024 ? 'Ukuran berkas melebihi batas maksimum 15MB.' : 'Hanya berkas format PDF yang diizinkan.';
                pdfError.classList.remove('hidden');
                return;
            }

            pdfButton.disabled = true;
            try {
                const uploadData = new FormData();
                uploadData.append('file', file);
                const uploadResponse = await fetch(@json(route('api.media.upload')), {
                    method: 'POST',
                    headers: { Accept: 'application/json', 'X-CSRF-TOKEN': csrfToken },
                    body: uploadData,
                });
                const uploadResult = await uploadResponse.json();
                if (!uploadResponse.ok || !uploadResult.success || uploadResult.data?.type !== 'DOCUMENT') {
                    throw new Error(uploadResult.error ?? 'Gagal mengunggah PDF.');
                }

                pdfMediaId.value = uploadResult.data.id;
                allowPdfSubmit = true;
                pdfForm.requestSubmit();
            } catch (error) {
                pdfError.textContent = error instanceof Error ? error.message : 'Gagal mengunggah PDF.';
                pdfError.classList.remove('hidden');
                pdfButton.disabled = false;
            }
        });

        const galleryInput = document.getElementById('experience-gallery-files');
        const galleryError = document.getElementById('experience-gallery-upload-error');
        galleryInput.addEventListener('change', async () => {
            const files = Array.from(galleryInput.files ?? []);
            if (!files.length) return;

            galleryError.textContent = '';
            galleryError.classList.add('hidden');
            galleryInput.disabled = true;
            try {
                for (const file of files) {
                    if (file.size > 15 * 1024 * 1024) throw new Error('Ukuran berkas melebihi batas maksimum 15MB.');
                    const uploadData = new FormData();
                    uploadData.append('file', file);
                    const uploadResponse = await fetch(@json(route('api.media.upload')), {
                        method: 'POST',
                        headers: { Accept: 'application/json', 'X-CSRF-TOKEN': csrfToken },
                        body: uploadData,
                    });
                    const uploadResult = await uploadResponse.json();
                    if (!uploadResponse.ok || !uploadResult.success || uploadResult.data?.type !== 'IMAGE') {
                        throw new Error(uploadResult.error ?? 'Gagal mengunggah gambar.');
                    }

                    const attachData = new FormData();
                    attachData.append('_token', csrfToken);
                    attachData.append('mediaId', uploadResult.data.id);
                    const attachResponse = await fetch(@json(route('admin.experiences.media.gallery.store', $experience)), {
                        method: 'POST',
                        headers: { Accept: 'application/json', 'X-CSRF-TOKEN': csrfToken },
                        body: attachData,
                    });
                    if (!attachResponse.ok) throw new Error('Gagal menambahkan gambar ke galeri.');
                }

                window.location.reload();
            } catch (error) {
                galleryError.textContent = error instanceof Error ? error.message : 'Gagal mengunggah gambar.';
                galleryError.classList.remove('hidden');
                galleryInput.disabled = false;
                galleryInput.value = '';
            }
        });
    })();
</script>