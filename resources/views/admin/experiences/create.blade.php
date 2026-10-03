@extends('layouts.admin')

@section('title', 'Tambah Pengalaman — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-3xl space-y-6">
    <div class="flex items-center justify-between gap-3">
        <h1 class="font-heading text-xl font-semibold">Tambah Pengalaman</h1>
        <a href="{{ route('admin.experiences.index') }}" class="text-sm text-neutral-500 hover:text-neutral-900">Kembali</a>
    </div>
    <form method="POST" action="{{ route('admin.experiences.store') }}" class="space-y-6 rounded-lg border border-neutral-200 bg-white p-4 sm:p-6">
        @csrf
        <input type="hidden" name="type" value="EXPERIENCE">
        <input type="hidden" name="status" value="DRAFT">
        @include('admin.experiences.form', ['experience' => null, 'translations' => collect(), 'mediaItems' => $mediaItems])
        <div class="flex justify-end border-t border-neutral-100 pt-4">
            <button class="rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700">Simpan sebagai Draft</button>
        </div>
    </form>
</div>
@endsection
