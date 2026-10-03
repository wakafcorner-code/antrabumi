@extends('layouts.admin')

@section('title', 'Edit Mitra — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-3xl space-y-6">
    <div class="flex items-center justify-between gap-3">
        <div>
            <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Kolaborasi</p>
            <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Edit Mitra</h1>
        </div>
        <a href="{{ route('admin.partners.index') }}" class="text-sm font-semibold text-neutral-600 hover:text-neutral-900">← Kembali</a>
    </div>

    @if(session('success'))
        <div class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{{ session('success') }}</div>
    @endif

    <section class="flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-4" aria-label="Alur status">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">Alur Status: {{ $partner->status->value }}</span>
        @if($partner->status !== \App\Enums\ContentStatus::DRAFT)
            <form method="POST" action="{{ route('admin.partners.status', $partner) }}">
                @csrf
                @method('PATCH')
                <input type="hidden" name="status" value="DRAFT">
                <button type="submit" class="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700">Kembalikan ke Draft</button>
            </form>
        @endif
        @if($partner->status === \App\Enums\ContentStatus::DRAFT)
            <form method="POST" action="{{ route('admin.partners.status', $partner) }}">
                @csrf
                @method('PATCH')
                <input type="hidden" name="status" value="REVIEW">
                <button type="submit" class="rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">Ajukan Review</button>
            </form>
        @endif
        @if(in_array($partner->status, [\App\Enums\ContentStatus::DRAFT, \App\Enums\ContentStatus::REVIEW], true))
            <form method="POST" action="{{ route('admin.partners.status', $partner) }}">
                @csrf
                @method('PATCH')
                <input type="hidden" name="status" value="PUBLISHED">
                <button type="submit" class="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white">Terbitkan Sekarang</button>
            </form>
        @endif
        @if($partner->status === \App\Enums\ContentStatus::PUBLISHED)
            <form method="POST" action="{{ route('admin.partners.status', $partner) }}">
                @csrf
                @method('PATCH')
                <input type="hidden" name="status" value="ARCHIVED">
                <button type="submit" class="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700">Arsipkan</button>
            </form>
        @endif
    </section>

    <form method="POST" action="{{ route('admin.partners.update', $partner) }}" class="space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        @csrf
        @method('PUT')
        <div class="grid gap-5 md:grid-cols-2">
            <div class="md:col-span-2">
                <label for="name" class="mb-2 block text-sm font-medium text-neutral-700">Nama Mitra</label>
                <input id="name" name="name" type="text" value="{{ old('name', $partner->name) }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none" required>
            </div>
            <div>
                <label for="slug" class="mb-2 block text-sm font-medium text-neutral-700">Slug</label>
                <input id="slug" name="slug" type="text" value="{{ old('slug', $partner->slug) }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none" required>
            </div>
            <div>
                <label for="category" class="mb-2 block text-sm font-medium text-neutral-700">Kategori</label>
                <input id="category" name="category" type="text" value="{{ old('category', $partner->category) }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div>
                <label for="order" class="mb-2 block text-sm font-medium text-neutral-700">Urutan</label>
                <input id="order" name="order" type="number" value="{{ old('order', $partner->order) }}" min="0" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div class="md:col-span-2">
                <label for="website" class="mb-2 block text-sm font-medium text-neutral-700">Website</label>
                <input id="website" name="website" type="url" value="{{ old('website', $partner->website) }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            @include('admin.partials.media-reference-picker', [
                'fieldName' => 'logoMediaId',
                'label' => 'Logo Mitra / Institusi',
                'initialMediaId' => $partner->logoMediaId,
                'initialUrl' => $partner->logoMedia?->url,
            ])
            <div class="md:col-span-2">
                <label for="description" class="mb-2 block text-sm font-medium text-neutral-700">Deskripsi</label>
                <textarea id="description" name="description" rows="4" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">{{ old('description', $partner->description) }}</textarea>
            </div>
        </div>

        <div class="flex justify-end gap-3">
            <a href="{{ route('admin.partners.index') }}" class="inline-flex h-11 items-center rounded-xl border border-neutral-300 px-5 text-sm font-semibold text-neutral-700">Batal</a>
            <button type="submit" class="inline-flex h-11 items-center rounded-xl bg-[#0D5C4D] px-5 text-sm font-semibold text-white">Simpan Perubahan</button>
        </div>
    </form>
</div>
@endsection
