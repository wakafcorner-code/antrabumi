@extends('layouts.app')

@section('title', $page.' — ANTRABUMI')

@section('content')
<section class="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
    <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">{{ request()->cookie('antrabumi_lang') === 'EN' ? 'MIGRATION FOUNDATION' : 'DASAR MIGRASI' }}</p>
    <h1 class="mt-4 font-heading text-4xl font-bold text-neutral-950">{{ $page }}{{ isset($slug) ? ': '.$slug : '' }}</h1>
    <p class="mt-5 max-w-2xl text-base leading-relaxed text-neutral-600">{{ request()->cookie('antrabumi_lang') === 'EN' ? 'The Laravel structure is ready. This page’s content and design have not yet been migrated from Next.js.' : 'Arsitektur Laravel sudah disiapkan. Konten dan tampilan halaman ini belum dipindahkan dari Next.js.' }}</p>
    <a href="{{ route('home') }}" class="mt-8 inline-flex rounded-md bg-brand-teal px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-teal-dark">{{ request()->cookie('antrabumi_lang') === 'EN' ? 'Back to home' : 'Kembali ke beranda' }}</a>
</section>
@endsection
