@extends('layouts.admin')

@section('title', 'Edit Inisiatif — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-4xl space-y-6">
    <div class="flex items-center justify-between gap-4">
        <div>
            <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Inisiatif</p>
            <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Edit Inisiatif</h1>
        </div>
        <a href="{{ route('admin.initiatives.index') }}" class="text-sm font-medium text-neutral-700 underline-offset-2 hover:underline">Kembali ke daftar</a>
    </div>

    @if(session('success'))
        <div class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{{ session('success') }}</div>
    @endif

    <section class="flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-4" aria-label="Alur status">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">Alur Status: {{ $initiative->status->value }}</span>
        @if($initiative->status !== \App\Enums\ContentStatus::DRAFT)
            <form method="POST" action="{{ route('admin.initiatives.status', $initiative) }}">
                @csrf
                @method('PATCH')
                <input type="hidden" name="status" value="DRAFT">
                <button type="submit" class="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700">Kembalikan ke Draft</button>
            </form>
        @endif
        @if($initiative->status === \App\Enums\ContentStatus::DRAFT)
            <form method="POST" action="{{ route('admin.initiatives.status', $initiative) }}">
                @csrf
                @method('PATCH')
                <input type="hidden" name="status" value="REVIEW">
                <button type="submit" class="rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">Ajukan Review</button>
            </form>
        @endif
        @if(in_array($initiative->status, [\App\Enums\ContentStatus::DRAFT, \App\Enums\ContentStatus::REVIEW], true))
            <form method="POST" action="{{ route('admin.initiatives.status', $initiative) }}">
                @csrf
                @method('PATCH')
                <input type="hidden" name="status" value="PUBLISHED">
                <button type="submit" class="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white">Terbitkan Sekarang</button>
            </form>
        @endif
        @if($initiative->status === \App\Enums\ContentStatus::PUBLISHED)
            <form method="POST" action="{{ route('admin.initiatives.status', $initiative) }}">
                @csrf
                @method('PATCH')
                <input type="hidden" name="status" value="ARCHIVED">
                <button type="submit" class="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700">Arsipkan</button>
            </form>
        @endif
    </section>

    <form action="{{ route('admin.initiatives.update', $initiative) }}" method="POST" class="space-y-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        @csrf
        @method('PUT')
        <div class="grid gap-5 md:grid-cols-2">
            <div>
                <label for="initiative-title-id" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Judul (ID) *</label>
                <input id="initiative-title-id" name="titleId" value="{{ old('titleId', $initiative->translations->firstWhere('language', \App\Enums\Language::ID)?->title) }}" required class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('titleId')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="initiative-slug" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Slug</label>
                <input id="initiative-slug" name="slug" value="{{ old('slug', $initiative->slug) }}" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('slug')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="initiative-year" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Tahun</label>
                <input id="initiative-year" type="number" name="year" value="{{ old('year', $initiative->year) }}" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('year')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="initiative-type" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Tipe</label>
                <select id="initiative-type" name="type" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                    <option value="INITIATIVE" {{ old('type', $initiative->type) === 'INITIATIVE' ? 'selected' : '' }}>INITIATIVE</option>
                    <option value="EXPERIENCE" {{ old('type', $initiative->type) === 'EXPERIENCE' ? 'selected' : '' }}>EXPERIENCE</option>
                </select>
                @error('type')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="initiative-location" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Lokasi</label>
                <input id="initiative-location" name="location" value="{{ old('location', $initiative->location) }}" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('location')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="initiative-client" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Klien / Mitra</label>
                <input id="initiative-client" name="client" value="{{ old('client', $initiative->clientName) }}" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('client')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="initiative-category" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Kategori</label>
                <input id="initiative-category" name="category" value="{{ old('category', $initiative->category) }}" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('category')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div class="md:col-span-2">
                <label for="initiative-cover-media" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Media Sampul (opsional)</label>
                <select id="initiative-cover-media" name="coverMediaId" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                    <option value="">Tanpa media sampul</option>
                    @foreach($mediaItems as $mediaItem)
                        <option value="{{ $mediaItem->id }}" @selected(old('coverMediaId', $initiative->coverMediaId) === $mediaItem->id)>{{ $mediaItem->originalName ?: $mediaItem->filename }}</option>
                    @endforeach
                </select>
                @error('coverMediaId')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
        </div>

        <div>
            <label for="initiative-excerpt-id" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Ringkasan (ID)</label>
            <textarea id="initiative-excerpt-id" name="excerptId" rows="3" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">{{ old('excerptId', $initiative->translations->firstWhere('language', \App\Enums\Language::ID)?->excerpt) }}</textarea>
            @error('excerptId')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>

        <div>
            <label for="initiative-body-id" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Konten (ID)</label>
            <textarea id="initiative-body-id" name="bodyId" rows="8" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">{{ old('bodyId', $initiative->translations->firstWhere('language', \App\Enums\Language::ID)?->description) }}</textarea>
            @error('bodyId')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>

        <div>
            <label for="initiative-title-en" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Judul (EN)</label>
            <input id="initiative-title-en" name="titleEn" value="{{ old('titleEn', $initiative->translations->firstWhere('language', \App\Enums\Language::EN)?->title) }}" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
            @error('titleEn')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>

        <div>
            <label for="initiative-excerpt-en" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Ringkasan (EN)</label>
            <textarea id="initiative-excerpt-en" name="excerptEn" rows="3" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">{{ old('excerptEn', $initiative->translations->firstWhere('language', \App\Enums\Language::EN)?->excerpt) }}</textarea>
            @error('excerptEn')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>

        <div>
            <label for="initiative-body-en" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Konten Lengkap (EN)</label>
            <textarea id="initiative-body-en" name="bodyEn" rows="8" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">{{ old('bodyEn', $initiative->translations->firstWhere('language', \App\Enums\Language::EN)?->description) }}</textarea>
            @error('bodyEn')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>

        <div class="flex justify-end gap-3 pt-4">
            <a href="{{ route('admin.initiatives.index') }}" class="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700">Batal</a>
            <button type="submit" class="rounded-xl bg-[#0D5C4D] px-4 py-2.5 text-sm font-semibold text-white">Simpan</button>
        </div>
    </form>
    @include('admin.experiences.partials.media-manager', ['experience' => $initiative])
</div>
@endsection
