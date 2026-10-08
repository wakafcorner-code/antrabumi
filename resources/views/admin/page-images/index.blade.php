@extends('layouts.admin')

@section('title', 'Kelola Foto '.$title.' — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-5xl space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
            <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">{{ $title }}</p>
            <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Kelola Foto Halaman</h1>
            <p class="mt-2 text-sm text-neutral-600">{{ $description }} Unggah foto baru untuk menggantinya.</p>
        </div>
        <a href="{{ route($backRoute) }}" class="text-sm font-medium text-neutral-700 underline-offset-2 hover:underline">← Kembali</a>
    </div>

    @if(session('success'))
        <div class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{{ session('success') }}</div>
    @endif
    @if($errors->any())
        <div class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{{ $errors->first() }}</div>
    @endif

    <form id="page-images-form" method="POST" action="{{ route($route) }}" class="space-y-5">
        @csrf
        <div class="grid gap-5 sm:grid-cols-2">
            @foreach($images as $key => $image)
                <section class="space-y-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                    <div>
                        <h2 class="text-sm font-semibold text-neutral-900">{{ $image['label'] }}</h2>
                        <input type="hidden" name="images[{{ $key }}]" value="{{ $image['mediaId'] }}" data-page-image-id>
                    </div>
                    <img src="{{ $image['url'] }}" alt="Pratinjau {{ $image['label'] }}" data-page-image-preview class="h-48 w-full rounded-lg border border-neutral-200 bg-neutral-50 object-cover">
                    <label class="block text-xs font-medium text-neutral-700">
                        Pilih foto baru
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" data-page-image-file class="mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm">
                    </label>
                    <p data-page-image-status class="hidden text-xs text-emerald-700" role="status"></p>
                    <p data-page-image-error class="hidden text-xs text-red-700" role="alert"></p>
                    <button type="button" data-page-image-reset data-default-url="{{ $image['default'] }}" class="text-xs font-medium text-neutral-600 underline">Gunakan kembali gambar bawaan</button>
                </section>
            @endforeach
        </div>

        <div class="flex justify-end">
            <button type="submit" class="rounded-xl bg-[#0D5C4D] px-5 py-2.5 text-sm font-semibold text-white">Simpan Semua Foto</button>
        </div>
    </form>
</div>

<script>
    (() => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content ?? '';
        const uploadUrl = @json(route('api.media.upload', [], false));
        const form = document.getElementById('page-images-form');

        form.querySelectorAll('[data-page-image-file]').forEach((input) => {
            const card = input.closest('section');
            const mediaId = card.querySelector('[data-page-image-id]');
            const preview = card.querySelector('[data-page-image-preview]');
            const status = card.querySelector('[data-page-image-status]');
            const error = card.querySelector('[data-page-image-error]');
            const reset = card.querySelector('[data-page-image-reset]');

            input.addEventListener('change', async () => {
                const file = input.files?.[0];
                if (!file) return;

                error.textContent = '';
                error.classList.add('hidden');
                status.textContent = '';
                status.classList.add('hidden');
                if (file.size > 15 * 1024 * 1024) {
                    error.textContent = 'Ukuran gambar melebihi batas maksimum 15 MB.';
                    error.classList.remove('hidden');
                    input.value = '';
                    return;
                }

                input.disabled = true;
                reset.disabled = true;
                status.textContent = 'Mengunggah gambar...';
                status.classList.remove('hidden');
                try {
                    const data = new FormData();
                    data.append('file', file);
                    const response = await fetch(uploadUrl, {
                        method: 'POST',
                        headers: { Accept: 'application/json', 'X-CSRF-TOKEN': csrfToken },
                        body: data,
                    });
                    const result = await response.json();
                    if (!response.ok || !result.success || result.data?.type !== 'IMAGE') {
                        throw new Error(result.error ?? 'Gagal mengunggah gambar.');
                    }

                    mediaId.value = result.data.id;
                    preview.src = result.data.url;
                    status.textContent = `${result.data.filename} siap disimpan. Klik “Simpan Semua Foto” untuk menerapkan perubahan.`;
                } catch (uploadError) {
                    error.textContent = uploadError instanceof Error ? uploadError.message : 'Gagal mengunggah gambar.';
                    error.classList.remove('hidden');
                    status.classList.add('hidden');
                } finally {
                    input.disabled = false;
                    reset.disabled = false;
                    input.value = '';
                }
            });

            reset.addEventListener('click', () => {
                mediaId.value = '';
                preview.src = reset.dataset.defaultUrl;
                status.textContent = 'Gambar bawaan akan digunakan setelah disimpan.';
                status.classList.remove('hidden');
                error.classList.add('hidden');
            });
        });
    })();
</script>
@endsection
