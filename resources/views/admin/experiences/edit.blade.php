@extends('layouts.admin')

@section('title', 'Edit Pengalaman — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-3xl space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
            <h1 class="font-heading text-xl font-semibold">Edit {{ $experience->type === 'INITIATIVE' ? 'Inisiatif' : 'Pengalaman' }}</h1>
            <span class="rounded bg-neutral-100 px-2 py-1 text-xs font-semibold">{{ $experience->status->value }}</span>
        </div>
        <a href="{{ route('admin.experiences.index') }}" class="text-sm text-neutral-500 hover:text-neutral-900">Kembali</a>
    </div>

    @php
        $transitions = [
            'DRAFT' => ['REVIEW'],
            'REVIEW' => ['PUBLISHED', 'DRAFT'],
            'PUBLISHED' => ['ARCHIVED'],
            'ARCHIVED' => ['DRAFT'],
        ];
    @endphp
    <section class="flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-4" aria-label="Alur status">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">Alur Status</span>
        @foreach($transitions[$experience->status->value] as $nextStatus)
            <form method="POST" action="{{ route('admin.experiences.status', $experience) }}">
                @csrf
                @method('PATCH')
                <input type="hidden" name="status" value="{{ $nextStatus }}">
                <button class="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium hover:border-neutral-900">→ {{ $nextStatus }}</button>
            </form>
        @endforeach
    </section>

    <form method="POST" action="{{ route('admin.experiences.update', $experience) }}" class="space-y-6 rounded-lg border border-neutral-200 bg-white p-4 sm:p-6">
        @csrf
        @method('PUT')
        <input type="hidden" name="status" value="{{ old('status', $experience->status->value) }}">
        @include('admin.experiences.form', ['experience' => $experience, 'translations' => $translations, 'mediaItems' => $mediaItems])
        <div class="flex justify-end border-t border-neutral-100 pt-4">
            <button class="rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700">Simpan Perubahan</button>
        </div>
    </form>
    @include('admin.experiences.partials.media-manager', ['experience' => $experience])
    @if(in_array(auth()->user()->role->value, ['ADMIN', 'SUPER_ADMIN'], true))
        <form method="POST" action="{{ route('admin.experiences.destroy', $experience) }}" onsubmit="return confirm('Yakin ingin menghapus pengalaman ini?')">
            @csrf
            @method('DELETE')
            <button class="text-sm font-medium text-red-700 hover:text-red-900">Hapus entri ini</button>
        </form>
    @endif
</div>
@endsection
