@extends('layouts.admin')

@section('title', 'Edit Pengetahuan — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-4xl space-y-6">
    <div class="flex items-center justify-between gap-4">
        <div>
            <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Pengetahuan</p>
            <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Edit Konten</h1>
        </div>
        <a href="{{ route('admin.knowledge.index') }}" class="text-sm font-medium text-neutral-700 underline-offset-2 hover:underline">Kembali ke daftar</a>
    </div>

    @if(session('success'))
        <div class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{{ session('success') }}</div>
    @endif

    <section class="space-y-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 class="text-sm font-semibold text-neutral-800">Status Publikasi</h2>
        <div class="flex flex-wrap gap-2">
            @foreach(\App\Enums\ContentStatus::cases() as $state)
                @if($knowledge->status === $state)
                    <button type="button" disabled class="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white opacity-70">{{ $state->value }}</button>
                @else
                    <form method="POST" action="{{ route('admin.knowledge.status', $knowledge) }}">
                        @csrf
                        @method('PATCH')
                        <input type="hidden" name="status" value="{{ $state->value }}">
                        <button type="submit" class="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:border-neutral-400">{{ $state->value }}</button>
                    </form>
                @endif
            @endforeach
        </div>
        <p class="text-[11px] text-neutral-500">Hanya konten berstatus <strong>PUBLISHED</strong> yang tampil di halaman publik /pengetahuan.</p>
    </section>

    <form id="knowledge-edit-form" action="{{ route('admin.knowledge.update', $knowledge) }}" method="POST" class="space-y-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        @csrf
        @method('PUT')

        <div class="grid gap-5 md:grid-cols-2">
            <div>
                <label for="knowledge-title-id" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Judul (ID) *</label>
                <input id="knowledge-title-id" name="titleId" value="{{ old('titleId', $knowledge->translations->firstWhere('language', \App\Enums\Language::ID)?->title) }}" required class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('titleId')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="knowledge-slug" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Slug</label>
                <input id="knowledge-slug" name="slug" value="{{ old('slug', $knowledge->slug) }}" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('slug')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="knowledge-type" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Tipe</label>
                <select id="knowledge-type" name="type" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                    @foreach(['ARTICLE','RESEARCH_PUBLICATION','STORY'] as $value)
                        <option value="{{ $value }}" {{ old('type', $knowledge->type->value ?? $knowledge->type) === $value ? 'selected' : '' }}>{{ $value }}</option>
                    @endforeach
                </select>
                @error('type')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="knowledge-author" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Penulis</label>
                <input id="knowledge-author" name="authorName" value="{{ old('authorName', $knowledge->authorName) }}" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('authorName')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="knowledge-date" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Tanggal Publikasi</label>
                <input id="knowledge-date" type="date" name="publicationDate" value="{{ old('publicationDate', optional($knowledge->publicationDate)->format('Y-m-d')) }}" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('publicationDate')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
        </div>

        <div>
            <label for="knowledge-excerpt-id" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Ringkasan (ID)</label>
            <textarea id="knowledge-excerpt-id" name="excerptId" rows="3" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">{{ old('excerptId', $knowledge->translations->firstWhere('language', \App\Enums\Language::ID)?->excerpt) }}</textarea>
            @error('excerptId')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>

        <div>
            <label for="knowledge-content-id" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Konten (ID)</label>
            <textarea id="knowledge-content-id" name="bodyId" rows="8" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">{{ old('bodyId', old('contentId', $knowledge->translations->firstWhere('language', \App\Enums\Language::ID)?->content)) }}</textarea>
            @error('contentId')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>

        <div>
            <label for="knowledge-title-en" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Judul (EN)</label>
            <input id="knowledge-title-en" name="titleEn" value="{{ old('titleEn', $knowledge->translations->firstWhere('language', \App\Enums\Language::EN)?->title) }}" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
            @error('titleEn')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>

        <div>
            <label for="knowledge-excerpt-en" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Ringkasan (EN)</label>
            <textarea id="knowledge-excerpt-en" name="excerptEn" rows="3" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">{{ old('excerptEn', $knowledge->translations->firstWhere('language', \App\Enums\Language::EN)?->excerpt) }}</textarea>
            @error('excerptEn')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>

        <div>
            <label for="knowledge-content-en" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Konten Lengkap (EN)</label>
            <textarea id="knowledge-content-en" name="bodyEn" rows="8" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">{{ old('bodyEn', old('contentEn', $knowledge->translations->firstWhere('language', \App\Enums\Language::EN)?->content)) }}</textarea>
            @error('contentEn')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
        </div>
        @include('admin.knowledge.partials.cover-media', [
            'coverMediaId' => $knowledge->coverMediaId,
            'coverMediaUrl' => $knowledge->coverMedia?->url,
            'coverMediaName' => $knowledge->coverMedia?->originalName,
        ])
        <div class="flex items-center gap-2">
            <input id="knowledge-featured" type="checkbox" name="featured" value="true" @checked(old('featured', $knowledge->featured)) class="h-4 w-4 rounded border-neutral-300 text-[#0D5C4D]">
            <label for="knowledge-featured" class="text-sm font-medium text-neutral-700">Tandai sebagai konten unggulan</label>
        </div>
        @include('admin.knowledge.partials.pdf-upload')
        @include('admin.knowledge.partials.media-upload-script')

        <div class="flex justify-end gap-3 pt-4">
            <a href="{{ route('admin.knowledge.index') }}" class="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700">Batal</a>
            <button type="submit" class="rounded-xl bg-[#0D5C4D] px-4 py-2.5 text-sm font-semibold text-white">Simpan</button>
        </div>
    </form>
    <section class="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div>
            <h2 class="font-heading text-lg font-semibold text-neutral-900">Dokumen / PDF Unduhan</h2>
            <p class="mt-1 text-sm text-neutral-500">Lampiran yang terhubung ke konten ini.</p>
        </div>
        @forelse($knowledge->downloads as $download)
            <div class="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-3">
                <a href="{{ $download->media->url }}" class="text-sm font-medium text-neutral-800 underline hover:text-neutral-600">{{ $download->label ?: $download->media->originalName }}</a>
                <form method="POST" action="{{ route('admin.knowledge.downloads.destroy', [$knowledge, $download]) }}" onsubmit="return confirm('Hapus lampiran PDF ini?')">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">Hapus PDF</button>
                </form>
            </div>
        @empty
            <p class="border-t border-neutral-100 pt-3 text-sm text-neutral-500">Belum ada lampiran PDF.</p>
        @endforelse
    </section>

    <section class="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div>
            <h2 class="font-heading text-lg font-semibold text-neutral-900">Galeri Gambar Pengetahuan</h2>
            <p class="mt-1 text-sm text-neutral-500">Gambar yang terhubung ke konten ini.</p>
        </div>
        @if($mediaItems->isNotEmpty())
            <form method="POST" action="{{ route('admin.knowledge.gallery.store', $knowledge) }}" class="flex flex-wrap items-end gap-3">
                @csrf
                <div class="min-w-0 flex-1">
                    <label for="gallery-media-id" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">Tambah gambar dari pustaka media</label>
                    <select id="gallery-media-id" name="mediaId" required class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                        <option value="">Pilih gambar</option>
                        @foreach($mediaItems as $mediaItem)
                            <option value="{{ $mediaItem->id }}">{{ $mediaItem->originalName }}</option>
                        @endforeach
                    </select>
                    @error('mediaId')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
                </div>
                <button type="submit" class="inline-flex h-10 items-center rounded-xl bg-[#0D5C4D] px-4 text-sm font-semibold text-white">Tambah Gambar</button>
            </form>
        @else
            <p class="text-sm text-neutral-500">Tidak ada gambar lain di pustaka media.</p>
        @endif
        <form id="knowledge-gallery-upload-form" method="POST" action="{{ route('admin.knowledge.gallery.store', $knowledge) }}" class="space-y-2 border-t border-neutral-100 pt-4">
            @csrf
            <input type="hidden" name="mediaId" id="knowledge-gallery-media-id">
            <label for="knowledge-gallery-file" class="block text-xs font-semibold uppercase tracking-wide text-neutral-600">Upload gambar baru</label>
            <input id="knowledge-gallery-file" type="file" accept="image/png,image/jpeg,image/webp,image/gif" class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm">
            <p id="knowledge-gallery-upload-error" class="hidden text-xs text-red-700" role="alert"></p>
        </form>
        @forelse($knowledge->gallery as $image)
            <div class="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-3">
                <div class="flex items-center gap-3">
                    <img src="{{ $image->url }}" alt="{{ $image->originalName }}" class="h-16 w-24 rounded-lg border border-neutral-200 object-cover">
                    <span class="text-sm font-medium text-neutral-800">{{ $image->originalName }}</span>
                </div>
                <form method="POST" action="{{ route('admin.knowledge.gallery.destroy', [$knowledge, $image]) }}" onsubmit="return confirm('Hapus gambar ini dari galeri?')">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">Hapus</button>
                </form>
            </div>
        @empty
            <p class="border-t border-neutral-100 pt-3 text-sm text-neutral-500">Belum ada gambar galeri.</p>
        @endforelse
    </section>
</div>

<script>
    (() => {
        const form = document.getElementById('knowledge-gallery-upload-form');
        const fileInput = document.getElementById('knowledge-gallery-file');
        const mediaIdInput = document.getElementById('knowledge-gallery-media-id');
        const errorOutput = document.getElementById('knowledge-gallery-upload-error');

        fileInput.addEventListener('change', async () => {
            const file = fileInput.files?.[0];
            if (!file) return;
            errorOutput.textContent = '';
            errorOutput.classList.add('hidden');

            if (file.size > 15 * 1024 * 1024) {
                errorOutput.textContent = 'Ukuran berkas melebihi batas maksimum 15MB.';
                errorOutput.classList.remove('hidden');
                fileInput.value = '';
                return;
            }

            const uploadData = new FormData();
            uploadData.append('file', file);
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content ?? '';
                const response = await fetch(@json(route('api.media.upload')), {
                    method: 'POST',
                    headers: { Accept: 'application/json', 'X-CSRF-TOKEN': csrfToken },
                    body: uploadData,
                });
                const result = await response.json();
                if (!response.ok || !result.success || result.data?.type !== 'IMAGE') {
                    throw new Error(result.error ?? 'Gagal mengunggah gambar.');
                }

                mediaIdInput.value = result.data.id;
                form.requestSubmit();
            } catch (error) {
                errorOutput.textContent = error instanceof Error ? error.message : 'Gagal mengunggah gambar.';
                errorOutput.classList.remove('hidden');
                fileInput.value = '';
            }
        });
    })();
</script>
@endsection
