@extends('layouts.admin')

@section('title', 'Tambah Profil Tim — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-3xl space-y-6">
    <div class="flex items-center justify-between gap-3">
        <div>
            <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Tim</p>
            <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Tambah Profil Tim</h1>
        </div>
        <a href="{{ route('admin.people.index') }}" class="text-sm font-semibold text-neutral-600 hover:text-neutral-900">Kembali</a>
    </div>

    <form method="POST" action="{{ route('admin.people.store') }}" class="space-y-5 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        @csrf
        <div class="grid gap-5 md:grid-cols-2">
            <div class="md:col-span-2">
                <label for="slug" class="mb-2 block text-sm font-medium text-neutral-700">Slug (opsional, dibuat dari nama jika kosong)</label>
                <input id="slug" name="slug" value="{{ old('slug') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('slug')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="order" class="mb-2 block text-sm font-medium text-neutral-700">Urutan Tampilan</label>
                <input id="order" name="order" type="number" min="0" value="{{ old('order', 0) }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('order')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div class="md:col-span-2">
                <label for="nameId" class="mb-2 block text-sm font-medium text-neutral-700">Nama (ID)</label>
                <input id="nameId" name="nameId" value="{{ old('nameId') }}" required class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
                @error('nameId')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="degreeId" class="mb-2 block text-sm font-medium text-neutral-700">Gelar (ID)</label>
                <input id="degreeId" name="degreeId" value="{{ old('degreeId') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div>
                <label for="roleId" class="mb-2 block text-sm font-medium text-neutral-700">Peran (ID)</label>
                <input id="roleId" name="roleId" value="{{ old('roleId') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div class="md:col-span-2">
                @include('admin.partials.media-reference-picker', [
                    'fieldName' => 'imageId',
                    'label' => 'Foto Profil',
                    'initialMediaId' => null,
                    'initialUrl' => null,
                ])
            </div>
            <div class="md:col-span-2">
                <label for="biographyId" class="mb-2 block text-sm font-medium text-neutral-700">Biografi (ID)</label>
                <textarea id="biographyId" name="biographyId" rows="4" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">{{ old('biographyId') }}</textarea>
            </div>
            <div class="md:col-span-2">
                <label for="nameEn" class="mb-2 block text-sm font-medium text-neutral-700">Nama (EN)</label>
                <input id="nameEn" name="nameEn" value="{{ old('nameEn') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div>
                <label for="degreeEn" class="mb-2 block text-sm font-medium text-neutral-700">Gelar (EN)</label>
                <input id="degreeEn" name="degreeEn" value="{{ old('degreeEn') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div>
                <label for="roleEn" class="mb-2 block text-sm font-medium text-neutral-700">Peran (EN)</label>
                <input id="roleEn" name="roleEn" value="{{ old('roleEn') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div class="md:col-span-2">
                <label for="biographyEn" class="mb-2 block text-sm font-medium text-neutral-700">Biografi (EN)</label>
                <textarea id="biographyEn" name="biographyEn" rows="4" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">{{ old('biographyEn') }}</textarea>
            </div>
        </div>
        <div class="flex justify-end gap-3 border-t border-neutral-100 pt-4">
            <a href="{{ route('admin.people.index') }}" class="inline-flex h-11 items-center rounded-xl border border-neutral-300 px-5 text-sm font-semibold text-neutral-700">Batal</a>
            <button type="submit" class="inline-flex h-11 items-center rounded-xl bg-[#0D5C4D] px-5 text-sm font-semibold text-white">Buat Profil</button>
        </div>
    </form>
</div>
@endsection