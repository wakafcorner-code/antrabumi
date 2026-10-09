@extends('layouts.app')

@section('title', $person['name'].' — ANTRABUMI')
@section('description', $person['biography'] ?? ($isEnglish ? 'ANTRABUMI team profile.' : 'Profil tim ANTRABUMI.'))
@section('canonical', url('/tentang/tim/'.$person['slug']))
@section('og_title', $person['name'])
@section('og_description', $person['role'] ?? ($isEnglish ? 'ANTRABUMI team profile.' : 'Profil tim ANTRABUMI.'))

@section('content')
<div class="bg-white">
    <section class="border-b border-neutral-100 bg-[#F7F6F1] py-16 sm:py-20">
        <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
            <nav aria-label="{{ $isEnglish ? 'Breadcrumb' : 'Navigasi jejak' }}" class="flex items-center gap-2 text-xs text-neutral-500">
                <a href="/" class="hover:text-neutral-900">{{ $isEnglish ? 'Home' : 'Beranda' }}</a>
                <span>/</span>
                <a href="/tentang" class="hover:text-neutral-900">{{ $isEnglish ? 'About' : 'Tentang' }}</a>
                <span>/</span>
                <span class="text-neutral-800">{{ $person['name'] }}</span>
            </nav>
        </div>
    </section>

    <section class="py-16 sm:py-20">
        <div class="mx-auto w-full max-w-[1080px] px-5 md:px-7 lg:px-10">
            <div class="grid gap-8 {{ $person['imageUrl'] ? 'md:grid-cols-[280px_1fr]' : '' }}">
                @if($person['imageUrl'])
                    <div class="overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50">
                        <img src="{{ $person['imageUrl'] }}" alt="{{ $person['name'] }}" class="h-full w-full object-cover">
                    </div>
                @endif
                <div>
                    <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0D5C4D]">{{ $isEnglish ? 'Team Member' : 'Anggota Tim' }}</p>
                    <h1 class="mt-3 font-heading text-4xl font-bold tracking-tight text-neutral-950">{{ $person['name'] }}</h1>
                    @if($person['degree'])<p class="mt-2 text-sm font-medium uppercase tracking-wider text-neutral-500">{{ $person['degree'] }}</p>@endif
                    @if($person['role'])<p class="mt-4 text-lg text-[#0D5C4D] font-semibold">{{ $person['role'] }}</p>@endif
                    @if($person['biography'])<div class="mt-6 space-y-4 text-base leading-relaxed text-neutral-700">{{ $person['biography'] }}</div>@endif
                    <div class="mt-8"><a href="/tentang" class="inline-flex items-center gap-2 text-sm font-semibold text-[#0D5C4D]">← {{ $isEnglish ? 'Back to About' : 'Kembali ke Tentang' }}</a></div>
                </div>
            </div>
        </div>
    </section>
</div>
@endsection
