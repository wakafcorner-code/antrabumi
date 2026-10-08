@extends('layouts.admin')

@section('title', 'Tambah Pengetahuan — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-4xl space-y-6">
    <div class="flex items-center justify-between gap-4">
        <div>
            <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Pengetahuan</p>
            <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Tambah Konten</h1>
        </div>
        <a href="{{ route('admin.knowledge.index') }}" class="text-sm font-medium text-neutral-700 underline-offset-2 hover:underline">Kembali ke daftar</a>
    </div>

    <form action="{{ route('admin.knowledge.store') }}" method="POST" class="space-y-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        @csrf
        <p class="rounded-xl border border-[#0D5C4D]/15 bg-[#0D5C4D]/5 px-4 py-3 text-sm leading-relaxed text-neutral-700">Mulai dengan judul dan konten Bahasa Indonesia. Terjemahan Inggris opsional. Gambar sampul, galeri, dan PDF bisa ditambahkan di bawah sebelum menyimpan.</p>

        <div class="grid gap-5 md:grid-cols-2">
            <div>
                <label for="knowledge-title-id" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Judul (ID) *</label>
                <input id="knowledge-title-id" name="titleId" value="{{ old('titleId') }}" required class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('titleId')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="knowledge-slug" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Slug</label>
                <input id="knowledge-slug" name="slug" value="{{ old('slug') }}" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('slug')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="knowledge-type" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Tipe</label>
                <select id="knowledge-type" name="type" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                    @foreach(['ARTICLE','RESEARCH_PUBLICATION','STORY'] as $value)
                        <option value="{{ $value }}" {{ old('type') === $value ? 'selected' : '' }}>{{ $value }}</option>
                    @endforeach
                </select>
                @error('type')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="knowledge-status" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Status</label>
                <select id="knowledge-status" name="status" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                    @foreach(['PUBLISHED' => 'Terbitkan Sekarang (PUBLISHED)', 'DRAFT' => 'Simpan sebagai Draf (DRAFT)'] as $value => $label)
                        <option value="{{ $value }}"{{ old('status', \App\Enums\ContentStatus::PUBLISHED->value) === $value ? ' selected' : '' }}>{{ $label }}</option>
                    @endforeach
                </select>
                @error('status')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="knowledge-author" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Penulis</label>
                <input id="knowledge-author" name="authorName" value="{{ old('authorName') }}" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('authorName')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="knowledge-date" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Tanggal Publikasi</label>
                <input id="knowledge-date" type="date" name="publicationDate" value="{{ old('publicationDate', now('UTC')->toDateString()) }}" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('publicationDate')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
        </div>

        <div>
            <label for="knowledge-excerpt-id" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Ringkasan (ID)</label>
            <textarea id="knowledge-excerpt-id" name="excerptId" rows="3" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">{{ old('excerptId') }}</textarea>
            @error('excerptId')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>

        <div>
            @include('admin.knowledge.partials.rich-editor', [
                'id' => 'knowledge-content-id',
                'name' => 'bodyId',
                'label' => 'Konten (ID)',
                'value' => old('bodyId', old('contentId', '')),
                'errorKey' => 'contentId',
            ])
        </div>

        <details @if(old('titleEn') || old('excerptEn') || old('bodyEn')) open @endif class="group rounded-xl border border-neutral-200 p-4">
            <summary class="cursor-pointer list-none font-semibold text-neutral-800 marker:hidden">Tambahkan terjemahan Bahasa Inggris (opsional)<span class="float-right text-neutral-400 transition group-open:rotate-180">⌄</span></summary>
            <div class="mt-4 space-y-5">
        <div>
            <label for="knowledge-title-en" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Judul (EN)</label>
            <input id="knowledge-title-en" name="titleEn" value="{{ old('titleEn') }}" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
            @error('titleEn')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>

        <div>
            <label for="knowledge-excerpt-en" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Ringkasan (EN)</label>
            <textarea id="knowledge-excerpt-en" name="excerptEn" rows="3" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">{{ old('excerptEn') }}</textarea>
            @error('excerptEn')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>

        <div>
            @include('admin.knowledge.partials.rich-editor', [
                'id' => 'knowledge-content-en',
                'name' => 'bodyEn',
                'label' => 'Konten Lengkap (EN)',
                'value' => old('bodyEn', old('contentEn', '')),
                'errorKey' => 'contentEn',
            ])
        </div>
            </div>
        </details>

        @include('admin.knowledge.partials.cover-media', [
            'coverMediaId' => null,
            'coverMediaUrl' => null,
            'coverMediaName' => null,
        ])
        @include('admin.partials.media-gallery-upload')
        <div class="flex items-center gap-2">
            <input id="knowledge-featured" type="checkbox" name="featured" value="true" @checked(old('featured')) class="h-4 w-4 rounded border-neutral-300 text-[#0D5C4D]">
            <label for="knowledge-featured" class="text-sm font-medium text-neutral-700">Tandai sebagai konten unggulan</label>
        </div>
        @include('admin.knowledge.partials.pdf-upload')
        @include('admin.knowledge.partials.media-upload-script')

        <div class="flex justify-end gap-3 pt-4">
            <a href="{{ route('admin.knowledge.index') }}" class="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700">Batal</a>
            <button type="submit" class="rounded-xl bg-[#0D5C4D] px-4 py-2.5 text-sm font-semibold text-white">Simpan</button>
        </div>
    </form>
</div>
@endsection
