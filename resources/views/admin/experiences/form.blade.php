@php
    $idTranslation = $translations->get('ID');
    $enTranslation = $translations->get('EN');
@endphp
<fieldset class="space-y-4">
    <legend class="text-sm font-semibold text-neutral-700">Informasi Dasar</legend>
    <div>
        <label for="experience-title-id" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Judul (ID) *</label>
        <input id="experience-title-id" name="titleId" value="{{ old('titleId', $idTranslation?->title) }}" required maxlength="191" class="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:border-neutral-900 focus:bg-white focus:ring-2 focus:ring-neutral-900/10">
        @error('titleId')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
    </div>
    <div>
        <label for="experience-slug" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Slug</label>
        <input id="experience-slug" name="slug" value="{{ old('slug', $experience?->slug) }}" maxlength="100" placeholder="Dibuat otomatis dari judul bila kosong" class="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-sm focus:border-neutral-900 focus:bg-white focus:ring-2 focus:ring-neutral-900/10">
        @error('slug')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
    </div>
    @if($experience)
        <fieldset class="space-y-2">
            <legend class="text-xs font-semibold uppercase tracking-wide text-neutral-600">Tipe</legend>
            <div class="flex flex-wrap gap-5 text-sm">
                <label class="inline-flex items-center gap-2"><input type="radio" name="type" value="INITIATIVE" @checked(old('type', $experience->type) === 'INITIATIVE')>Inisiatif</label>
                <label class="inline-flex items-center gap-2"><input type="radio" name="type" value="EXPERIENCE" @checked(old('type', $experience->type) === 'EXPERIENCE')>Pengalaman</label>
            </div>
        </fieldset>
    @endif
    <div class="grid gap-4 sm:grid-cols-2">
        <div>
            <label for="experience-year" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Tahun</label>
            <input id="experience-year" name="year" type="number" min="2000" max="2100" value="{{ old('year', $experience?->year) }}" class="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm">
            @error('year')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>
        <div>
            <label for="experience-category" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Kategori</label>
            <input id="experience-category" name="category" value="{{ old('category', $experience?->category) }}" maxlength="120" class="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm">
            @error('category')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>
        <div>
            <label for="experience-client" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Klien / Mitra</label>
            <input id="experience-client" name="client" value="{{ old('client', $experience?->clientName) }}" maxlength="191" class="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm">
            @error('client')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>
        <div>
            <label for="experience-location" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Lokasi</label>
            <input id="experience-location" name="location" value="{{ old('location', $experience?->location) }}" maxlength="191" class="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm">
            @error('location')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>
    </div>
    <div>
        <label for="experience-cover" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Gambar Sampul dari Media Library</label>
        <select id="experience-cover" name="coverMediaId" class="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm">
            <option value="">Tanpa gambar sampul</option>
            @foreach($mediaItems->where('type.value', 'IMAGE') as $media)
                <option value="{{ $media->id }}" @selected(old('coverMediaId', $experience?->coverMediaId) === $media->id)>{{ $media->originalName ?: $media->filename }}{{ $media->altText ? ' — '.$media->altText : '' }}</option>
            @endforeach
        </select>
        @error('coverMediaId')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
    </div>
    <div>
        <label for="experience-pdf" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Dokumen PDF dari Media Library (opsional)</label>
        <select id="experience-pdf" name="pdfMediaId" class="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm">
            <option value="">Tanpa dokumen</option>
            @foreach($mediaItems->where('type.value', 'DOCUMENT') as $media)
                <option value="{{ $media->id }}">{{ $media->originalName ?: $media->filename }}</option>
            @endforeach
        </select>
        @error('pdfMediaId')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
    </div>
    <div>
        <label for="experience-excerpt-id" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Ringkasan (ID)</label>
        <textarea id="experience-excerpt-id" name="excerptId" rows="3" class="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm">{{ old('excerptId', $idTranslation?->excerpt) }}</textarea>
        @error('excerptId')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
    </div>
    <div>
        <label for="experience-body-id" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Konten Lengkap (ID)</label>
        <textarea id="experience-body-id" name="bodyId" rows="8" class="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm">{{ old('bodyId', $idTranslation?->description) }}</textarea>
        @error('bodyId')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
    </div>
</fieldset>
<fieldset class="space-y-4 border-t border-neutral-100 pt-4">
    <legend class="text-sm font-semibold text-neutral-700">Konten Bahasa Inggris (opsional)</legend>
    <div>
        <label for="experience-title-en" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Judul (EN)</label>
        <input id="experience-title-en" name="titleEn" value="{{ old('titleEn', $enTranslation?->title) }}" maxlength="191" class="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm">
        @error('titleEn')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
    </div>
    <div>
        <label for="experience-excerpt-en" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Ringkasan (EN)</label>
        <textarea id="experience-excerpt-en" name="excerptEn" rows="3" class="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm">{{ old('excerptEn', $enTranslation?->excerpt) }}</textarea>
        @error('excerptEn')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
    </div>
    <div>
        <label for="experience-body-en" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Konten Lengkap (EN)</label>
        <textarea id="experience-body-en" name="bodyEn" rows="8" class="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm">{{ old('bodyEn', $enTranslation?->description) }}</textarea>
        @error('bodyEn')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
    </div>
</fieldset>
