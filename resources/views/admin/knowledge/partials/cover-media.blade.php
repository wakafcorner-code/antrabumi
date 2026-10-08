@php
    $selectedCoverId = old('coverMediaId', $coverMediaId ?? '');
    $selectedCoverUrl = $coverMediaUrl ?? null;
    $selectedCoverName = $coverMediaName ?? null;
@endphp

<input type="hidden" name="coverMediaId" id="knowledge-cover-media-id" value="{{ $selectedCoverId }}">
<div class="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
    <div>
        <h2 class="text-xs font-semibold uppercase tracking-wide text-neutral-800">Gambar Sampul / Cover</h2>
        <p class="mt-1 text-xs text-neutral-500">Unggah gambar hingga 15 MB. Untuk PDF, gunakan bagian Dokumen / Laporan PDF.</p>
    </div>
    <div id="knowledge-cover-preview" class="{{ $selectedCoverUrl ? 'flex' : 'hidden' }} items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-3">
        <a id="knowledge-cover-link" href="{{ $selectedCoverUrl ?? '#' }}" target="_blank" rel="noopener noreferrer" class="min-w-0 truncate text-sm font-medium text-neutral-800 underline">
            <span id="knowledge-cover-name">{{ $selectedCoverName ?? '' }}</span>
        </a>
        <button type="button" id="knowledge-cover-clear" class="shrink-0 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700">Hapus</button>
    </div>
    <div>
        <label for="knowledge-cover-file" class="mb-1 block text-xs font-medium text-neutral-700">Pilih berkas</label>
        <input id="knowledge-cover-file" type="file" accept="image/png,image/jpeg,image/webp,image/gif" class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm">
    </div>
    <p id="knowledge-cover-error" class="hidden text-xs text-red-700" role="alert"></p>
</div>
