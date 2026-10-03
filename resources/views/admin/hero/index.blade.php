@extends('layouts.admin')

@section('title', 'Hero Slider — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-5xl space-y-6">
    <div>
        <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Beranda</p>
        <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Hero Slider Beranda</h1>
    </div>

    @if(session('success'))
        <div class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{{ session('success') }}</div>
    @endif
    @if($errors->any())
        <div class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{{ $errors->first() }}</div>
    @endif

    <form method="POST" action="{{ route('admin.hero.update') }}" class="space-y-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        @csrf
        @method('PUT')
        <div>
            <label for="hero-slides" class="mb-2 block text-sm font-semibold text-neutral-800">Daftar slide</label>
            <textarea id="hero-slides" name="slides" rows="24" spellcheck="false" class="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-3 font-mono text-xs focus:border-[#0D5C4D] focus:outline-none">{{ old('slides', $slidesJson) }}</textarea>
            @error('slides')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            @error('slides.*.title')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            <p class="mt-1 text-xs text-neutral-500">Slide menyimpan id, tagline, title, subtitle, CTA, imageUrl, order, dan isActive.</p>
        </div>
        <div>
            <label for="hero-config" class="mb-2 block text-sm font-semibold text-neutral-800">Konfigurasi slider</label>
            <textarea id="hero-config" name="config" rows="8" spellcheck="false" class="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-3 font-mono text-xs focus:border-[#0D5C4D] focus:outline-none">{{ old('config', $configJson) }}</textarea>
            @error('config.*')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            <p class="mt-1 text-xs text-neutral-500">autoplay, intervalMs (2.000–30.000), transitionEffect (fade/slide), pauseOnHover.</p>
        </div>
        <div class="flex justify-end border-t border-neutral-100 pt-4">
            <button type="submit" class="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white">Simpan Pengaturan Slider</button>
        </div>
    </form>
</div>
@endsection