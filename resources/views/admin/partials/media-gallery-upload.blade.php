@php
    $galleryInputName = $galleryInputName ?? 'galleryMediaIds[]';
    $pendingGalleryIds = old('galleryMediaIds', []);
@endphp
<section class="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50/70 p-4" data-media-gallery-upload data-input-name="{{ $galleryInputName }}">
    <div>
        <h2 class="text-sm font-semibold text-neutral-900">Galeri Gambar</h2>
        <p class="mt-1 text-xs leading-relaxed text-neutral-600">Pilih beberapa gambar sekaligus. Galeri akan disimpan bersama konten ini.</p>
    </div>
    <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" data-media-gallery-files class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm">
    <div data-media-gallery-ids class="flex flex-wrap gap-2">
        @foreach($pendingGalleryIds as $mediaId)
            <input type="hidden" name="{{ $galleryInputName }}" value="{{ $mediaId }}">
            <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">Gambar siap disimpan</span>
        @endforeach
    </div>
    <p data-media-gallery-status class="hidden text-xs text-emerald-700" role="status"></p>
    <p data-media-gallery-error class="hidden text-xs text-red-700" role="alert"></p>
</section>
