@extends('layouts.app')

@section('title', $metaTitle)
@section('description', $metaDescription ?: 'Pengetahuan dan pembelajaran ANTRABUMI.')
@section('canonical', url('/pengetahuan/'.$item->slug))
@section('og_title', $metaTitle)
@section('og_description', $metaDescription ?: 'Pengetahuan dan pembelajaran ANTRABUMI.')
@section('og_image', $metaImage)

@section('content')
@php
    $images = [];
    if ($cover) {
        $images[] = ['id' => 'cover', 'url' => $cover['url'], 'alt' => $cover['altText'] ?: $title];
    }
    foreach ($gallery as $image) {
        $images[] = $image;
    }
    $publishedDate = $displayDate ? \Illuminate\Support\Carbon::parse($displayDate)->locale($isEnglish ? 'en' : 'id')->translatedFormat('j F Y') : null;
@endphp
<main class="min-h-screen bg-white">
    <div class="border-b border-neutral-100 bg-neutral-50/80 py-3.5 backdrop-blur-sm">
        <div class="mx-auto w-full max-w-[760px] px-5 md:px-7 lg:px-10">
            <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-xs text-neutral-500">
                <a href="/" class="transition-colors hover:text-neutral-900">{{ $isEnglish ? 'Home' : 'Beranda' }}</a><span class="text-neutral-300">/</span>
                <a href="/pengetahuan" class="transition-colors hover:text-neutral-900">{{ $isEnglish ? 'Knowledge' : 'Pengetahuan' }}</a><span class="text-neutral-300">/</span>
                <span class="max-w-xs truncate font-medium text-neutral-800 sm:max-w-md">{{ $title }}</span>
            </nav>
        </div>
    </div>

    <section class="relative overflow-hidden border-b border-neutral-100 bg-[#0B1E1A] py-16 text-white sm:py-24">
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#0D5C4D_1px,transparent_1px)] opacity-10 [background-size:24px_24px]"></div>
        <div class="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-[#0D5C4D]/25 blur-3xl"></div>
        <div class="relative z-10 mx-auto w-full max-w-[760px] space-y-6 px-5 md:px-7 lg:px-10">
            <div class="flex flex-wrap items-center gap-3">
                <span class="rounded-full border border-[#147A66] bg-[#0D5C4D] px-3 py-1 font-mono text-xs font-semibold text-white">{{ $typeLabel }}</span>
                @if($publishedDate)<time datetime="{{ \Illuminate\Support\Carbon::parse($displayDate)->toIso8601String() }}" class="font-mono text-xs text-neutral-300">{{ $publishedDate }}</time>@endif
                @if($item->authorName)<span class="font-mono text-xs text-neutral-300">· {{ $isEnglish ? 'By '.$item->authorName : 'Oleh '.$item->authorName }}</span>@endif
            </div>
            <h1 class="font-heading text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">{{ $title }}</h1>
            @if($excerpt)<p class="text-lg font-light leading-relaxed text-neutral-200 sm:text-xl">{{ $excerpt }}</p>@endif
        </div>
    </section>

    @if($hasVisuals || $downloadable)
        <section class="relative overflow-hidden border-b border-neutral-100 bg-[#F4F5F0] py-10 sm:py-16">
            <div class="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#0D5C4D]/5 blur-3xl"></div>
            <div class="relative z-10 mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
                <div class="mb-7 flex flex-col gap-3 sm:mb-9 sm:flex-row sm:items-end sm:justify-between"><div class="space-y-1"><span class="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#0D5C4D] sm:text-xs">{{ $downloadable ? ($isEnglish ? 'OFFICIAL PUBLICATION & DOCUMENT' : 'DOKUMEN & PUBLIKASI RESMI') : ($isEnglish ? 'FIELD DOCUMENTATION' : 'DOKUMENTASI VISUAL') }}</span><h2 class="font-heading text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">{{ $downloadable ? ($isEnglish ? 'Document Download & Preview' : 'Berkas Unduhan & Pratinjau Dokumen') : ($isEnglish ? 'Project Gallery' : 'Galeri Kegiatan') }}</h2>@if($downloadable)<p class="max-w-2xl text-xs leading-relaxed text-neutral-600 sm:text-sm">{{ $isEnglish ? 'Access the full briefing, methodology, or assessment paper in PDF format.' : 'Akses naskah lengkap, ringkasan eksekutif, dan metodologi dalam format PDF.' }}</p>@endif</div><span class="w-fit rounded-full border border-[#0D5C4D]/15 bg-white/70 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#0D5C4D]">ANTRABUMI · {{ $typeLabel }}</span></div>
                <div class="relative z-10 {{ $hasVisuals && $downloadable ? 'grid grid-cols-1 items-start gap-5 lg:grid-cols-2 lg:gap-7' : 'mx-auto max-w-4xl' }}">
                    @if($hasVisuals)
                        <div class="rounded-2xl border border-neutral-200/80 bg-white p-2 shadow-[0_14px_35px_-20px_rgba(15,47,39,0.35)] sm:p-3"><div class="mb-3 flex items-center justify-between px-1 sm:px-2"><span class="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400">01 / Visual</span><span class="text-[10px] font-medium text-neutral-400">{{ $isEnglish ? 'Gallery' : 'Galeri' }}</span></div>@include('components.public.image-slider', ['images' => $images, 'label' => $title])</div>
                    @endif
                    @if($downloadable)
                        <div class="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_14px_35px_-20px_rgba(15,47,39,0.35)]"><div class="flex items-center justify-between border-b border-neutral-100 px-4 py-3 sm:px-5"><div><span class="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400">02 / PDF</span><p class="mt-0.5 max-w-[220px] truncate text-xs font-semibold text-neutral-800">{{ $downloadable['label'] ?: ($downloadable['originalName'] ?: 'Dokumen PDF') }}</p></div><span class="rounded-md bg-red-50 px-2 py-1 font-mono text-[10px] font-bold text-red-600">PDF</span></div><iframe src="{{ $downloadable['url'] }}#toolbar=0&amp;view=FitH" title="{{ $downloadable['label'] ?: ($downloadable['originalName'] ?: 'Pratinjau PDF') }}" class="h-[500px] w-full bg-neutral-100 sm:h-[640px]"></iframe><div class="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 p-4 sm:p-5"><p class="min-w-0 truncate text-[11px] font-medium text-neutral-500">{{ $downloadable['filename'] }}</p><a href="{{ $downloadable['url'] }}" target="_blank" rel="noopener noreferrer" class="shrink-0 rounded-lg bg-[#0D5C4D] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#116958]">{{ $isEnglish ? 'Open / Download' : 'Buka / Unduh' }}</a></div></div>
                    @endif
                </div>
            </div>
        </section>
    @endif

    @if($content !== '')
        <section class="bg-white py-14 sm:py-20"><div class="rich-content mx-auto w-full max-w-[760px] px-5 text-base leading-relaxed text-neutral-800 md:px-7 sm:text-lg lg:px-10">{!! $content !!}</div></section>
    @endif

    @include('components.public.social-share', ['slug' => $item->slug, 'title' => $title, 'text' => $excerpt, 'label' => $isEnglish ? 'Share this publication' : 'Bagikan publikasi ini'])

    <section class="border-t border-neutral-100 bg-white py-12"><div class="mx-auto flex w-full max-w-[760px] flex-col items-center justify-between gap-4 px-5 sm:flex-row md:px-7 lg:px-10"><a href="/pengetahuan" class="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 transition-colors hover:text-neutral-900"><span>←</span><span>{{ $isEnglish ? 'Back to all knowledge' : 'Kembali ke arsip pengetahuan' }}</span></a><a href="/kolaborasi#kontak" class="inline-flex h-11 items-center rounded-xl bg-gradient-to-r from-[#0D5C4D] via-[#116958] to-[#147A66] px-6 text-xs font-semibold text-white shadow-md shadow-[#0D5C4D]/25 transition-all hover:-translate-y-0.5 hover:shadow-lg">{{ $isEnglish ? 'Discuss This Research' : 'Diskusikan Riset Ini' }}</a></div></section>
</main>
@endsection