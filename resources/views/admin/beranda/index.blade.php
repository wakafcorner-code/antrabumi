@extends('layouts.admin')

@section('title', 'Konten Beranda — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-5xl space-y-6">
    <div>
        <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Beranda</p>
        <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Konten &amp; Teks Beranda</h1>
        <p class="mt-2 text-sm text-neutral-600">Edit seluruh bagian beranda, termasuk pilar, linimasa, framework, GEDSI, dan ajakan kolaborasi.</p>
    </div>

    @if(session('success'))
        <div class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{{ session('success') }}</div>
    @endif
    @if($errors->any())
        <div class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{{ $errors->first() }}</div>
    @endif

    <form method="POST" action="{{ route('admin.home-content.update') }}" class="space-y-5 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        @csrf
        @method('PUT')
        <div>
            <label for="home-content" class="mb-2 block text-sm font-semibold text-neutral-800">Konten semua bagian</label>
            <textarea id="home-content" name="content" rows="40" spellcheck="false" class="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-3 font-mono text-xs focus:border-[#0D5C4D] focus:outline-none">{{ old('content', $contentJson) }}</textarea>
            @error('content')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
            <p class="mt-1 text-xs text-neutral-500">Objek mencakup whyUs, about, pillars, growth.timeline, framework.steps, GEDSI, dan CTA dalam ID/EN.</p>
        </div>
        <div class="flex justify-end border-t border-neutral-100 pt-4">
            <button type="submit" class="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white">Simpan Konten Beranda</button>
        </div>
    </form>
</div>
@endsection