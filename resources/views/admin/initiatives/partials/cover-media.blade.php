@php
    $selectedCoverId = old('coverMediaId', $coverMediaId ?? '');
    $selectedCoverUrl = $coverMediaUrl ?? '';
@endphp
<div data-media-image-field class="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4">
    <div>
        <label for="initiative-cover-media" class="block text-xs font-semibold uppercase tracking-wide text-neutral-700">Gambar Sampul</label>
        <p class="mt-1 text-xs text-neutral-500">Pilih dari pustaka media atau unggah gambar baru (maks. 15MB).</p>
    </div>
    <div class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <div class="space-y-3">
            <select id="initiative-cover-media" name="coverMediaId" data-media-id-input class="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                <option value="">Tanpa gambar sampul</option>
                @foreach($mediaItems as $mediaItem)
                    <option value="{{ $mediaItem->id }}" data-image-url="{{ $mediaItem->url }}" @selected($selectedCoverId === $mediaItem->id)>{{ $mediaItem->originalName ?: $mediaItem->filename }}</option>
                @endforeach
            </select>
            <label class="block text-xs font-medium text-neutral-700">Unggah gambar baru
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" data-media-image-upload class="mt-1.5 block w-full rounded-lg border border-neutral-300 bg-white px-2 py-2 text-xs">
            </label>
            <p data-media-upload-status class="hidden text-xs text-emerald-700" role="status"></p>
            <p data-media-upload-error class="hidden text-xs text-red-700" role="alert"></p>
            @error('coverMediaId')<p class="text-xs text-red-700">{{ $message }}</p>@enderror
        </div>
        <img data-media-image-preview src="{{ $selectedCoverUrl }}" alt="Pratinjau gambar sampul" class="{{ $selectedCoverUrl ? '' : 'hidden' }} h-28 w-full rounded-lg border border-neutral-200 bg-neutral-100 object-cover">
    </div>
</div>
