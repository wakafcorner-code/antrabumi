@extends('layouts.admin')

@section('title', 'Dashboard — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-6xl space-y-6 sm:space-y-8">
    <section class="rounded-lg border border-neutral-800 bg-neutral-900 p-5 text-white sm:p-7">
        <div class="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div class="min-w-0">
                <p class="font-mono text-xs font-semibold uppercase tracking-widest text-emerald-300">ANTRABUMI CMS</p>
                <h1 class="mt-2 break-words font-heading text-2xl font-bold sm:text-3xl">Selamat datang, {{ auth()->user()->name }}</h1>
                <p class="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-300">Kelola inisiatif, pengetahuan, profil tim, mitra, dan pesan kolaborasi.</p>
            </div>
            <div class="flex flex-wrap gap-2">
                <a href="{{ route('admin.initiatives.new') }}" class="rounded-md bg-brand-teal px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-teal-dark">Inisiatif Baru</a>
                <a href="{{ route('admin.knowledge.new') }}" class="rounded-md border border-white/20 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10">Publikasi Baru</a>
                <a href="{{ route('home') }}" target="_blank" rel="noopener noreferrer" class="rounded-md border border-white/20 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10">Lihat Web ↗</a>
            </div>
        </div>
    </section>

    <section aria-label="Statistik konten" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <a href="{{ route('admin.initiatives.index') }}" class="rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-brand-teal">
            <p class="text-xs font-semibold uppercase tracking-wider text-neutral-500">Inisiatif &amp; Proyek</p>
            <p class="mt-3 font-heading text-3xl font-bold" data-stat="experiences-total">{{ number_format($stats['experiences']['total']) }}</p>
            <p class="mt-1 text-xs text-neutral-500"><span data-stat="experiences-published">{{ number_format($stats['experiences']['published']) }}</span> Terbit · {{ number_format($stats['experiences']['total'] - $stats['experiences']['published']) }} belum terbit</p>
        </a>
        <a href="{{ route('admin.knowledge.index') }}" class="rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-brand-teal">
            <p class="text-xs font-semibold uppercase tracking-wider text-neutral-500">Hub Pengetahuan</p>
            <p class="mt-3 font-heading text-3xl font-bold" data-stat="knowledge-total">{{ number_format($stats['knowledge']['total']) }}</p>
            <p class="mt-1 text-xs text-neutral-500"><span data-stat="knowledge-published">{{ number_format($stats['knowledge']['published']) }}</span> Terbit</p>
        </a>
        <a href="{{ route('admin.messages.index') }}" class="rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-brand-teal">
            <p class="text-xs font-semibold uppercase tracking-wider text-neutral-500">Pesan Masuk</p>
            <p class="mt-3 font-heading text-3xl font-bold" data-stat="messages-total">{{ number_format($stats['messages']['total']) }}</p>
            <p class="mt-1 text-xs text-neutral-500"><span data-stat="messages-new">{{ number_format($stats['messages']['new']) }}</span> Pesan Baru</p>
        </a>
        <a href="{{ route('admin.media.index') }}" class="rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-brand-teal">
            <p class="text-xs font-semibold uppercase tracking-wider text-neutral-500">Media &amp; Arsip</p>
            <p class="mt-3 font-heading text-3xl font-bold" data-stat="media-total">{{ number_format($stats['media']['total']) }}</p>
            <p class="mt-1 text-xs text-neutral-500"><span data-stat="media-documents">{{ number_format($stats['media']['documents']) }}</span> Dokumen</p>
        </a>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
        <div class="min-w-0 rounded-lg border border-neutral-200 bg-white p-4 sm:p-6">
            <div class="flex items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                <div>
                    <h2 class="text-sm font-semibold text-neutral-900">Pesan Masuk Terbaru</h2>
                    <p class="text-xs text-neutral-500">Pesan dari halaman kolaborasi dan kontak</p>
                </div>
                <a href="{{ route('admin.messages.index') }}" class="shrink-0 text-xs font-semibold text-brand-teal hover:underline">Lihat Semua ({{ number_format($stats['messages']['total']) }})</a>
            </div>
            <div class="divide-y divide-neutral-100">
                @forelse($recentMessages as $message)
                    <a href="{{ route('admin.messages.show', $message) }}" class="block min-w-0 py-3 hover:bg-neutral-50">
                        <div class="flex items-center justify-between gap-2">
                            <span class="truncate text-xs font-semibold">{{ $message->name }}@if($message->organization) <span class="font-normal text-neutral-500">({{ $message->organization }})</span>@endif</span>
                            <span class="shrink-0 rounded bg-neutral-100 px-2 py-0.5 text-[10px]">{{ str_replace('_', ' ', $message->status->value) }}</span>
                        </div>
                        <p class="mt-1 truncate text-xs text-neutral-600">{{ $message->subject }}</p>
                        <div class="mt-1 flex flex-wrap justify-between gap-1 text-[11px] text-neutral-400"><span class="break-all">{{ $message->email }}</span><time datetime="{{ $message->createdAt->toAtomString() }}">{{ $message->createdAt->locale('id')->translatedFormat('j M Y') }}</time></div>
                    </a>
                @empty
                    <p class="py-8 text-center text-xs text-neutral-400">Belum ada pesan masuk.</p>
                @endforelse
            </div>
        </div>

        <div class="min-w-0 rounded-lg border border-neutral-200 bg-white p-4 sm:p-6">
            <div class="flex items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                <div>
                    <h2 class="text-sm font-semibold text-neutral-900">Log Aktivitas CMS</h2>
                    <p class="text-xs text-neutral-500">Pencatatan audit dan perubahan data</p>
                </div>
                <a href="{{ route('admin.logs.index') }}" class="shrink-0 text-xs font-semibold text-brand-teal hover:underline">Lihat Log Lengkap</a>
            </div>
            <div class="divide-y divide-neutral-100">
                @forelse($recentLogs as $log)
                    <div class="flex items-start justify-between gap-3 py-3">
                        <div class="min-w-0">
                            <p class="text-xs font-semibold"><span class="mr-2 rounded bg-neutral-100 px-1.5 py-0.5 text-[10px]">{{ $log->action->value }}</span>{{ $log->entity ?? 'Sistem' }}</p>
                            <p class="mt-1 truncate text-xs text-neutral-500">Oleh: {{ $log->user?->name ?? 'Sistem' }}</p>
                        </div>
                        <time class="shrink-0 text-[11px] text-neutral-400" datetime="{{ $log->createdAt->toAtomString() }}">{{ $log->createdAt->locale('id')->translatedFormat('j M Y') }}</time>
                    </div>
                @empty
                    <p class="py-8 text-center text-xs text-neutral-400">Belum ada aktivitas tercatat.</p>
                @endforelse
            </div>
        </div>
    </section>

    <section aria-label="Ringkasan lainnya" class="grid gap-4 sm:grid-cols-3">
        <a href="{{ route('admin.people.index') }}" class="rounded-lg border border-neutral-200 bg-white p-4"><span class="text-xs font-semibold">Tim</span><p class="mt-2 text-sm"><span data-stat="people-total">{{ number_format($stats['people']['total']) }}</span> profil, <span data-stat="people-published">{{ number_format($stats['people']['published']) }}</span> terbit</p></a>
        <a href="{{ route('admin.partners.index') }}" class="rounded-lg border border-neutral-200 bg-white p-4"><span class="text-xs font-semibold">Mitra</span><p class="mt-2 text-sm" data-stat="partners-total">{{ number_format($stats['partners']) }}</p></a>
        @if(auth()->user()->role->value === 'SUPER_ADMIN')
            <a href="{{ route('admin.users.index') }}" class="rounded-lg border border-neutral-200 bg-white p-4"><span class="text-xs font-semibold">Pengguna &amp; Akses</span><p class="mt-2 text-sm" data-stat="users-total">{{ number_format($stats['users']) }} akun</p></a>
        @endif
    </section>

    <p class="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Halaman CMS selain autentikasi, health check, kontak, dan upload masih berupa route skeleton.</p>
</div>
@endsection
