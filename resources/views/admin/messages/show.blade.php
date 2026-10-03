@extends('layouts.admin')

@section('title', 'Detail Pesan — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-4xl space-y-6">
    <div class="flex items-center justify-between gap-3">
        <div>
            <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Komunikasi</p>
            <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Pesan dari {{ $message->name }}</h1>
            <p class="mt-1 text-xs text-neutral-500">Diterima pada {{ $message->createdAt->locale('id')->translatedFormat('d M Y H:i') }}</p>
        </div>
        <a href="{{ route('admin.messages.index') }}" class="text-sm font-semibold text-neutral-600 hover:text-neutral-900">← Kembali</a>
    </div>

    @if(session('success'))
        <div class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{{ session('success') }}</div>
    @endif

    <div class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div class="grid gap-6 md:grid-cols-2">
            <div>
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Nama</p>
                <p class="mt-2 text-lg font-semibold text-neutral-900">{{ $message->name }}</p>
            </div>
            <div>
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Email</p>
                <p class="mt-2 text-neutral-700"><a href="mailto:{{ $message->email }}" class="underline hover:text-neutral-600">{{ $message->email }}</a></p>
            </div>
            <div>
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Organisasi</p>
                <p class="mt-2 text-neutral-700">{{ $message->organization ?? '-' }}</p>
            </div>
            @if($message->phone)
                <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Nomor Telepon</p>
                    <p class="mt-2 text-neutral-700">{{ $message->phone }}</p>
                </div>
            @endif
            <div>
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Status</p>
                <p class="mt-2"><span class="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700">{{ $message->status->detailLabel() }}</span></p>
            </div>
            @if($message->areaOfInterest)
                <div class="md:col-span-2">
                    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Tipe / Bidang Kolaborasi</p>
                    <p class="mt-2 text-neutral-700">{{ $message->areaOfInterest }}</p>
                </div>
            @endif
            <div class="md:col-span-2">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Subjek</p>
                <p class="mt-2 text-neutral-900">{{ $message->subject ?? '-' }}</p>
            </div>
            <div class="md:col-span-2">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Pesan</p>
                <div class="mt-2 whitespace-pre-wrap rounded-xl bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-700">{{ $message->message }}</div>
            </div>
        </div>

        <div class="mt-6 flex justify-end">
            <form method="POST" action="{{ route('admin.messages.status', $message) }}">
                @csrf
                <select name="status" onchange="this.form.requestSubmit()" class="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                    @foreach(\App\Enums\MessageStatus::cases() as $state)
                        <option value="{{ $state->value }}" {{ $message->status === $state ? 'selected' : '' }}>{{ $state->detailLabel() }}</option>
                    @endforeach
                </select>
                <button type="submit" class="ml-3 inline-flex h-11 items-center rounded-xl bg-[#0D5C4D] px-5 text-sm font-semibold text-white">Update Status</button>
            </form>
        </div>
    </div>
</div>
@endsection
