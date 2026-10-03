@extends('layouts.admin')

@section('title', 'Media — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-7xl space-y-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Media</p>
            <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Media Library</h1>
        </div>
    </div>

    <form id="media-upload-form" action="{{ route('api.media.upload') }}" method="POST" class="space-y-3 rounded-xl border-2 border-dashed border-neutral-300 bg-white p-5">
        @csrf
        <div class="flex flex-wrap items-end justify-between gap-4">
            <div class="min-w-0 flex-1">
                <label for="media-upload-input" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-700">Unggah media</label>
                <input id="media-upload-input" name="file[]" type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm">
                <p class="mt-1 text-xs text-neutral-500">JPEG, PNG, WebP, GIF, atau PDF. Maks. 15 MB per berkas.</p>
            </div>
            <button type="submit" class="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white">Unggah</button>
        </div>
        <p id="media-upload-status" class="hidden text-xs" role="status"></p>
    </form>

    <div class="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <form method="GET" action="{{ route('admin.media.index') }}" class="flex flex-col gap-3 md:flex-row md:items-center">
            <input type="text" name="search" value="{{ $search }}" placeholder="Cari nama file" class="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none md:max-w-md">
            <select name="type" class="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                <option value="">Semua tipe</option>
                @foreach(['IMAGE','DOCUMENT'] as $item)
                    <option value="{{ $item }}" {{ $type === $item ? 'selected' : '' }}>{{ $item }}</option>
                @endforeach
            </select>
            <button type="submit" class="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-700">Cari</button>
        </form>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        @forelse($media as $item)
            <div data-media-card class="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
                @if($item->type->value === 'IMAGE')
                    <img src="{{ $item->url }}" alt="{{ $item->altText ?? $item->originalName }}" class="h-40 w-full rounded-xl object-cover">
                @else
                    <div class="flex h-40 items-center justify-center rounded-xl bg-neutral-100 text-sm font-semibold text-neutral-600">PDF / DOC</div>
                @endif
                <div class="mt-3 space-y-1">
                    <p class="truncate text-sm font-semibold text-neutral-900">{{ $item->originalName }}</p>
                    <p class="text-xs text-neutral-500">{{ $item->type->value }} · {{ number_format($item->size) }} bytes</p>
                </div>
                <details class="mt-3 border-t border-neutral-100 pt-3">
                    <summary class="cursor-pointer text-xs font-semibold text-neutral-700">Detail dan metadata</summary>
                    <form method="POST" action="{{ route('admin.media.update', $item) }}" data-media-metadata-form class="mt-3 space-y-3">
                        @csrf
                        @method('PATCH')
                        <div>
                            <label for="media-alt-{{ $item->id }}" class="mb-1 block text-xs font-medium text-neutral-600">Alt text</label>
                            <input id="media-alt-{{ $item->id }}" name="altText" maxlength="300" value="{{ $item->altText }}" class="w-full rounded-md border border-neutral-300 px-3 py-2 text-xs">
                        </div>
                        <div>
                            <label for="media-caption-{{ $item->id }}" class="mb-1 block text-xs font-medium text-neutral-600">Caption</label>
                            <textarea id="media-caption-{{ $item->id }}" name="caption" maxlength="1000" rows="2" class="w-full rounded-md border border-neutral-300 px-3 py-2 text-xs">{{ $item->caption }}</textarea>
                        </div>
                        <div>
                            <label for="media-attribution-{{ $item->id }}" class="mb-1 block text-xs font-medium text-neutral-600">Attribution</label>
                            <input id="media-attribution-{{ $item->id }}" name="attribution" maxlength="300" value="{{ $item->attribution }}" class="w-full rounded-md border border-neutral-300 px-3 py-2 text-xs">
                        </div>
                        <div class="flex justify-end">
                            <button type="submit" class="rounded-md bg-neutral-900 px-3 py-2 text-xs font-semibold text-white">Simpan metadata</button>
                        </div>
                        <p class="hidden text-xs" data-media-form-status role="status"></p>
                    </form>
                    @if(in_array(auth()->user()->role->value, ['ADMIN', 'SUPER_ADMIN'], true))
                        <form method="POST" action="{{ route('api.media.destroy', $item) }}" data-media-delete-form class="mt-3 border-t border-neutral-100 pt-3">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="text-xs font-semibold text-red-700">Hapus media</button>
                        </form>
                    @endif
                </details>
            </div>
        @empty
            <div class="col-span-full rounded-2xl border border-dashed border-neutral-200 bg-white p-12 text-center text-neutral-500">Belum ada media.</div>
        @endforelse
    </div>

    @if($media->hasPages())
        <div class="flex justify-end">
            {{ $media->links() }}
        </div>
    @endif
</div>

<script>
    (() => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content ?? '';
        const uploadForm = document.getElementById('media-upload-form');
        const uploadInput = document.getElementById('media-upload-input');
        const uploadStatus = document.getElementById('media-upload-status');

        uploadForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const files = Array.from(uploadInput.files ?? []);
            if (!files.length) return;

            uploadStatus.textContent = '';
            uploadStatus.classList.add('hidden');
            try {
                for (const file of files) {
                    if (file.size > 15 * 1024 * 1024) throw new Error('Ukuran berkas melebihi batas maksimum 15MB.');
                    const data = new FormData();
                    data.append('file', file);
                    const response = await fetch(uploadForm.action, {
                        method: 'POST',
                        headers: { Accept: 'application/json', 'X-CSRF-TOKEN': csrfToken },
                        body: data,
                    });
                    const result = await response.json();
                    if (!response.ok || !result.success) throw new Error(result.error ?? 'Gagal mengunggah media.');
                }
                window.location.reload();
            } catch (error) {
                uploadStatus.textContent = error instanceof Error ? error.message : 'Gagal mengunggah media.';
                uploadStatus.classList.remove('hidden');
                uploadStatus.classList.add('text-red-700');
            }
        });

        document.querySelectorAll('[data-media-metadata-form]').forEach((form) => {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                const status = form.querySelector('[data-media-form-status]');
                try {
                    const response = await fetch(form.action, {
                        method: 'PATCH',
                        headers: { Accept: 'application/json', 'X-CSRF-TOKEN': csrfToken },
                        body: new FormData(form),
                    });
                    const result = await response.json();
                    if (!response.ok || !result.success) throw new Error(result.error ?? 'Gagal menyimpan metadata.');
                    status.textContent = 'Metadata tersimpan.';
                    status.classList.remove('hidden', 'text-red-700');
                    status.classList.add('text-emerald-700');
                } catch (error) {
                    status.textContent = error instanceof Error ? error.message : 'Gagal menyimpan metadata.';
                    status.classList.remove('hidden');
                    status.classList.add('text-red-700');
                }
            });
        });

        document.querySelectorAll('[data-media-delete-form]').forEach((form) => {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                if (!window.confirm('Hapus media dan file lokalnya secara permanen?')) return;
                const response = await fetch(form.action, {
                    method: 'DELETE',
                    headers: { Accept: 'application/json', 'X-CSRF-TOKEN': csrfToken },
                    body: new FormData(form),
                });
                const result = await response.json();
                if (!response.ok || !result.success) {
                    window.alert(result.error ?? 'Gagal menghapus media.');
                    return;
                }
                form.closest('[data-media-card]')?.remove();
            });
        });
    })();
</script>
@endsection
