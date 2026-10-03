@extends('layouts.admin')

@section('title', $action.' '.$resource.' — CMS ANTRABUMI')

@section('content')
<section class="mx-auto max-w-3xl rounded-lg border border-amber-200 bg-amber-50 p-6">
    <p class="font-mono text-xs font-semibold uppercase tracking-wider text-amber-800">MIGRATION PENDING</p>
    <h1 class="mt-2 font-heading text-2xl font-bold text-neutral-950">{{ $action }} {{ $resource }}</h1>
    @if (!empty($recordId))<p class="mt-2 font-mono text-xs text-neutral-500">ID: {{ $recordId }}</p>@endif
    <p class="mt-4 text-sm leading-relaxed text-neutral-700">Route dan controller skeleton sudah didaftarkan, tetapi workflow CRUD halaman ini belum dimigrasikan. Data belum diubah.</p>
</section>
@endsection
