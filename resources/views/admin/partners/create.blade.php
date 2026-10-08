@extends('layouts.admin')

@section('title', 'Tambah Mitra — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-3xl space-y-6">
    <div class="flex items-center justify-between gap-3">
        <div>
            <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Kolaborasi</p>
            <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Tambah Mitra</h1>
        </div>
        <a href="{{ route('admin.partners.index') }}" class="text-sm font-semibold text-neutral-600 hover:text-neutral-900">← Kembali</a>
    </div>

    <form method="POST" action="{{ route('admin.partners.store') }}" class="space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        @csrf
        @if($errors->any())
            <div class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{{ $errors->first() }}</div>
        @endif
        <div class="grid gap-5 md:grid-cols-2">
            <div class="md:col-span-2">
                <label for="name" class="mb-2 block text-sm font-medium text-neutral-700">Nama Mitra</label>
                <input id="name" name="name" type="text" value="{{ old('name') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none" required>
            </div>
            <div>
                <label for="slug" class="mb-2 block text-sm font-medium text-neutral-700">Slug</label>
                <input id="slug" name="slug" type="text" value="{{ old('slug') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none" required>
            </div>
            <div>
                <label for="category" class="mb-2 block text-sm font-medium text-neutral-700">Kategori</label>
                <input id="category" name="category" type="text" value="{{ old('category') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div>
                <label for="order" class="mb-2 block text-sm font-medium text-neutral-700">Urutan</label>
                <input id="order" name="order" type="number" value="{{ old('order', 0) }}" min="0" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div class="md:col-span-2">
                <label for="website" class="mb-2 block text-sm font-medium text-neutral-700">Website</label>
                <input id="website" name="website" type="url" value="{{ old('website') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('website')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            @include('admin.partials.media-reference-picker', [
                'fieldName' => 'logoMediaId',
                'label' => 'Logo Mitra / Institusi',
                'initialMediaId' => null,
                'initialUrl' => null,
            ])
            <div class="md:col-span-2">
                <label for="description" class="mb-2 block text-sm font-medium text-neutral-700">Deskripsi</label>
                <textarea id="description" name="description" rows="4" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">{{ old('description') }}</textarea>
            </div>
        </div>

        <div class="flex justify-end gap-3">
            <a href="{{ route('admin.partners.index') }}" class="inline-flex h-11 items-center rounded-xl border border-neutral-300 px-5 text-sm font-semibold text-neutral-700">Batal</a>
            <button type="submit" class="inline-flex h-11 items-center rounded-xl bg-[#0D5C4D] px-5 text-sm font-semibold text-white">Simpan Mitra</button>
        </div>
    </form>
</div>
@endsection
