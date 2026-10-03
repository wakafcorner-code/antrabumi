@extends('layouts.admin')

@section('title', 'Edit Profil Tim — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-3xl space-y-6">
    <div class="flex items-center justify-between gap-3">
        <div>
            <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Tim</p>
            <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Edit Profil Tim</h1>
        </div>
        <a href="{{ route('admin.people.index') }}" class="text-sm font-semibold text-neutral-600 hover:text-neutral-900">← Kembali</a>
    </div>

    @if(session('success'))
        <div class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{{ session('success') }}</div>
    @endif

    <section class="flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-4" aria-label="Alur status">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">Alur Status: {{ $person->status->value }}</span>
        @if($person->status !== \App\Enums\ContentStatus::DRAFT)
            <form method="POST" action="{{ route('admin.people.status', $person) }}">
                @csrf
                @method('PATCH')
                <input type="hidden" name="status" value="DRAFT">
                <button type="submit" class="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700">Kembalikan ke Draft</button>
            </form>
        @endif
        @if($person->status === \App\Enums\ContentStatus::DRAFT)
            <form method="POST" action="{{ route('admin.people.status', $person) }}">
                @csrf
                @method('PATCH')
                <input type="hidden" name="status" value="REVIEW">
                <button type="submit" class="rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">Ajukan Review</button>
            </form>
        @endif
        @if(in_array($person->status, [\App\Enums\ContentStatus::DRAFT, \App\Enums\ContentStatus::REVIEW], true))
            <form method="POST" action="{{ route('admin.people.status', $person) }}">
                @csrf
                @method('PATCH')
                <input type="hidden" name="status" value="PUBLISHED">
                <button type="submit" class="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white">Terbitkan Sekarang</button>
            </form>
        @endif
        @if($person->status === \App\Enums\ContentStatus::PUBLISHED)
            <form method="POST" action="{{ route('admin.people.status', $person) }}">
                @csrf
                @method('PATCH')
                <input type="hidden" name="status" value="ARCHIVED">
                <button type="submit" class="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700">Arsipkan</button>
            </form>
        @endif
    </section>

    <form method="POST" action="{{ route('admin.people.update', $person) }}" class="space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        @csrf
        @method('PUT')
        <div class="grid gap-5 md:grid-cols-2">
            <div class="md:col-span-2">
                <label for="slug" class="mb-2 block text-sm font-medium text-neutral-700">Slug</label>
                <input id="slug" name="slug" type="text" value="{{ old('slug', $person->slug) }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none" required>
            </div>
            <div>
                <label for="order" class="mb-2 block text-sm font-medium text-neutral-700">Urutan</label>
                <input id="order" name="order" type="number" value="{{ old('order', $person->order) }}" min="0" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            @php($idTranslation = $person->translations->firstWhere('language', \App\Enums\Language::ID) ?: $person->translations->first())
            @php($enTranslation = $person->translations->firstWhere('language', \App\Enums\Language::EN))
            <div class="md:col-span-2">
                <label for="nameId" class="mb-2 block text-sm font-medium text-neutral-700">Nama (ID)</label>
                <input id="nameId" name="nameId" type="text" value="{{ old('nameId', $idTranslation?->name ?? '') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none" required>
            </div>
            <div>
                <label for="degreeId" class="mb-2 block text-sm font-medium text-neutral-700">Gelar (ID)</label>
                <input id="degreeId" name="degreeId" type="text" value="{{ old('degreeId', $idTranslation?->degree ?? '') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div>
                <label for="roleId" class="mb-2 block text-sm font-medium text-neutral-700">Peran (ID)</label>
                <input id="roleId" name="roleId" type="text" value="{{ old('roleId', $idTranslation?->role ?? '') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div class="md:col-span-2">
                <label for="biographyId" class="mb-2 block text-sm font-medium text-neutral-700">Biografi (ID)</label>
                <textarea id="biographyId" name="biographyId" rows="4" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">{{ old('biographyId', $idTranslation?->biography ?? '') }}</textarea>
            </div>
            <div class="md:col-span-2">
                <label for="nameEn" class="mb-2 block text-sm font-medium text-neutral-700">Nama (EN)</label>
                <input id="nameEn" name="nameEn" type="text" value="{{ old('nameEn', $enTranslation?->name ?? '') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            @include('admin.partials.media-reference-picker', [
                'fieldName' => 'imageId',
                'label' => 'Foto Profil',
                'initialMediaId' => $person->imageId,
                'initialUrl' => $person->image?->url,
            ])
            <div>
                <label for="roleEn" class="mb-2 block text-sm font-medium text-neutral-700">Peran (EN)</label>
                <input id="roleEn" name="roleEn" type="text" value="{{ old('roleEn', $enTranslation?->role ?? '') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div>
                <label for="degreeEn" class="mb-2 block text-sm font-medium text-neutral-700">Gelar (EN)</label>
                <input id="degreeEn" name="degreeEn" type="text" value="{{ old('degreeEn', $enTranslation?->degree ?? '') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">
            </div>
            <div class="md:col-span-2">
                <label for="biographyEn" class="mb-2 block text-sm font-medium text-neutral-700">Biografi (EN)</label>
                <textarea id="biographyEn" name="biographyEn" rows="4" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none">{{ old('biographyEn', $enTranslation?->biography ?? '') }}</textarea>
            </div>
        </div>

        <div class="flex justify-end gap-3">
            <a href="{{ route('admin.people.index') }}" class="inline-flex h-11 items-center rounded-xl border border-neutral-300 px-5 text-sm font-semibold text-neutral-700">Batal</a>
            <button type="submit" class="inline-flex h-11 items-center rounded-xl bg-[#0D5C4D] px-5 text-sm font-semibold text-white">Simpan Perubahan</button>
        </div>
    </form>
</div>
@endsection
