@extends('layouts.admin')

@section('title', 'Pesan Masuk — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-7xl space-y-6">
    <div>
        <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Komunikasi</p>
        <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Pesan Masuk</h1>
        <p class="mt-2 text-sm text-neutral-500">{{ $messages->total() }} pesan dari formulir kontak publik</p>
    </div>

    <div class="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <form method="GET" action="{{ route('admin.messages.index') }}" class="flex flex-col gap-3 md:flex-row md:items-center">
            <select name="status" class="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                <option value="">Semua status</option>
                @foreach(\App\Enums\MessageStatus::cases() as $state)
                    <option value="{{ $state->value }}" {{ $status === $state->value ? 'selected' : '' }}>{{ $state->inboxLabel() }} ({{ $state->value }})</option>
                @endforeach
            </select>
            <button type="submit" class="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-700">Filter</button>
        </form>
    </div>

    <div class="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-neutral-200 text-left text-sm">
                <thead class="bg-neutral-50 text-neutral-600">
                    <tr>
                        <th class="px-5 py-3 font-semibold">Pengirim</th>
                        <th class="px-5 py-3 font-semibold">Tipe / Bidang</th>
                        <th class="px-5 py-3 font-semibold">Subjek</th>
                        <th class="px-5 py-3 font-semibold">Status</th>
                        <th class="px-5 py-3 font-semibold">Tanggal</th>
                        <th class="px-5 py-3 font-semibold text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-neutral-200">
                    @forelse($messages as $message)
                        <tr>
                            <td class="px-5 py-4">
                                <div class="font-medium text-neutral-900">{{ $message->name }}</div>
                                <div class="text-xs text-neutral-500">{{ $message->email }}</div>
                                @if($message->organization)
                                    <div class="mt-0.5 font-mono text-xs text-neutral-400">{{ $message->organization }}</div>
                                @endif
                            </td>
                            <td class="px-5 py-4">
                                @if($message->areaOfInterest)
                                    <span class="inline-flex items-center rounded-full border border-[#0D5C4D]/20 bg-[#0D5C4D]/10 px-2.5 py-0.5 text-xs font-medium text-[#0D5C4D]">{{ $message->areaOfInterest }}</span>
                                @else
                                    <span class="text-xs text-neutral-400">Umum / Pesan</span>
                                @endif
                            </td>
                            <td class="px-5 py-4 text-neutral-700">{{ $message->subject ?? '-' }}</td>
                            <td class="px-5 py-4">
                                <span class="inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium {{ $message->status->inboxBadgeClasses() }}">{{ $message->status->inboxLabel() }}</span>
                            </td>
                            <td class="px-5 py-4 text-neutral-500">{{ $message->createdAt->locale('id')->translatedFormat('d M Y') }}</td>
                            <td class="px-5 py-4 text-right">
                                <a href="{{ route('admin.messages.show', $message) }}" class="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700">Buka</a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-5 py-10 text-center text-neutral-500">Belum ada pesan masuk.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    @if($messages->hasPages())
        <div class="flex justify-end">
            {{ $messages->links() }}
        </div>
    @endif
</div>
@endsection
