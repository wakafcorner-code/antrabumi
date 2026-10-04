@extends('layouts.admin')

@section('title', 'Tambah Inisiatif — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-4xl space-y-6">
    <div class="flex items-center justify-between gap-4">
        <div>
            <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Inisiatif</p>
            <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Tambah Inisiatif</h1>
        </div>
        <a href="{{ route('admin.initiatives.index') }}" class="text-sm font-medium text-neutral-700 underline-offset-2 hover:underline">Kembali ke daftar</a>
    </div>

    <form action="{{ route('admin.initiatives.store') }}" method="POST" class="space-y-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        @csrf
        <div class="grid gap-5 md:grid-cols-2">
            <div>
                <label for="initiative-title-id" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Judul (ID) *</label>
                <input id="initiative-title-id" name="titleId" value="{{ old('titleId') }}" required class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('titleId')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="initiative-slug" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Slug</label>
                <input id="initiative-slug" name="slug" value="{{ old('slug') }}" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('slug')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="initiative-year" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Tahun</label>
                <input id="initiative-year" type="number" name="year" value="{{ old('year') }}" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('year')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="initiative-status" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Status</label>
                <select id="initiative-status" name="status" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                    @foreach(['DRAFT','REVIEW','PUBLISHED','ARCHIVED'] as $value)
                        <option value="{{ $value }}" {{ old('status') === $value ? 'selected' : '' }}>{{ $value }}</option>
                    @endforeach
                </select>
                @error('status')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="initiative-type" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Tipe</label>
                <select id="initiative-type" name="type" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                    <option value="INITIATIVE" {{ old('type', 'INITIATIVE') === 'INITIATIVE' ? 'selected' : '' }}>INITIATIVE</option>
                    <option value="EXPERIENCE" {{ old('type') === 'EXPERIENCE' ? 'selected' : '' }}>EXPERIENCE</option>
                </select>
                @error('type')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="initiative-location" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Lokasi</label>
                <input id="initiative-location" name="location" value="{{ old('location') }}" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('location')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="initiative-client" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Klien / Mitra</label>
                <input id="initiative-client" name="client" value="{{ old('client') }}" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('client')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="initiative-category" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Kategori</label>
                <input id="initiative-category" name="category" value="{{ old('category') }}" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('category')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div class="md:col-span-2">
                @include('admin.initiatives.partials.cover-media', ['coverMediaId' => null, 'coverMediaUrl' => null])
            </div>
        </div>

        <div>
            <label for="initiative-excerpt-id" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Ringkasan (ID)</label>
            <textarea id="initiative-excerpt-id" name="excerptId" rows="3" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">{{ old('excerptId') }}</textarea>
            @error('excerptId')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>

        <div>
            <label for="initiative-body-id" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Konten (ID)</label>
            <p class="mb-2 text-xs text-neutral-500">Teks panjang ditampilkan sebagai paragraf. Gunakan baris kosong untuk memisahkan bagian.</p>
            <textarea id="initiative-body-id" name="bodyId" rows="18" data-longform-counter="initiative-body-id-count" class="w-full resize-y rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm leading-7 focus:border-[#0D5C4D] focus:bg-white focus:outline-none">{{ old('bodyId') }}</textarea>
            <p id="initiative-body-id-count" class="mt-1 text-right text-[11px] text-neutral-500" aria-live="polite"></p>
            @error('bodyId')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>

        <div>
            <label for="initiative-title-en" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Judul (EN)</label>
            <input id="initiative-title-en" name="titleEn" value="{{ old('titleEn') }}" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
            @error('titleEn')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>

        <div>
            <label for="initiative-excerpt-en" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Ringkasan (EN)</label>
            <textarea id="initiative-excerpt-en" name="excerptEn" rows="3" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">{{ old('excerptEn') }}</textarea>
            @error('excerptEn')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>

        <div>
            <label for="initiative-body-en" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Konten Lengkap (EN)</label>
            <p class="mb-2 text-xs text-neutral-500">Teks panjang ditampilkan sebagai paragraf. Gunakan baris kosong untuk memisahkan bagian.</p>
            <textarea id="initiative-body-en" name="bodyEn" rows="18" data-longform-counter="initiative-body-en-count" class="w-full resize-y rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm leading-7 focus:border-[#0D5C4D] focus:bg-white focus:outline-none">{{ old('bodyEn') }}</textarea>
            <p id="initiative-body-en-count" class="mt-1 text-right text-[11px] text-neutral-500" aria-live="polite"></p>
            @error('bodyEn')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>

        @include('admin.initiatives.partials.pdf-upload')
        @include('admin.partials.media-gallery-upload')

        <div class="flex justify-end gap-3 pt-4">
            <a href="{{ route('admin.initiatives.index') }}" class="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700">Batal</a>
            <button type="submit" class="rounded-xl bg-[#0D5C4D] px-4 py-2.5 text-sm font-semibold text-white">Simpan</button>
        </div>
    </form>
</div>
@endsection
