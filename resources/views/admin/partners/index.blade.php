@extends('layouts.admin')

@section('title', 'Mitra & Kolaborasi — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-7xl space-y-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Kolaborasi</p>
            <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Mitra &amp; Kolaborasi</h1>
        </div>
        <a href="{{ route('admin.partners.create') }}" class="inline-flex h-11 items-center rounded-xl bg-[#0D5C4D] px-5 text-sm font-semibold text-white">+ Tambah Mitra</a>
    </div>

    <div class="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <form method="GET" action="{{ route('admin.partners.index') }}" class="flex flex-col gap-3 md:flex-row md:items-center">
            <input type="text" name="search" value="{{ $search }}" placeholder="Cari nama mitra atau kategori" class="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none md:max-w-md">
            <select name="status" class="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                <option value="">Semua status</option>
                @foreach(['DRAFT','REVIEW','PUBLISHED','ARCHIVED'] as $state)
                    <option value="{{ $state }}" {{ $status === $state ? 'selected' : '' }}>{{ $state }}</option>
                @endforeach
            </select>
            <button type="submit" class="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-700">Cari</button>
        </form>
    </div>

    <div class="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-neutral-200 text-left text-sm">
                <thead class="bg-neutral-50 text-neutral-600">
                    <tr>
                        <th class="px-5 py-3 font-semibold">Nama</th>
                        <th class="px-5 py-3 font-semibold">Kategori</th>
                        <th class="px-5 py-3 font-semibold">Website</th>
                        <th class="px-5 py-3 font-semibold">Status</th>
                        <th class="px-5 py-3 font-semibold text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-neutral-200">
                    @forelse($partners as $partner)
                        <tr>
                            <td class="px-5 py-4 font-medium text-neutral-900">{{ $partner->name }}</td>
                            <td class="px-5 py-4 text-neutral-600">{{ $partner->category ?? '-' }}</td>
                            <td class="px-5 py-4 text-neutral-500">
                                @if($partner->website)
                                    <a href="{{ $partner->website }}" target="_blank" rel="noopener noreferrer" class="text-brand-teal underline">{{ $partner->website }}</a>
                                @else
                                    -
                                @endif
                            </td>
                            <td class="px-5 py-4">
                                <span class="inline-flex rounded-full {{ $partner->status === \App\Enums\ContentStatus::PUBLISHED ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700' }} px-2.5 py-1 text-xs font-semibold">
                                    {{ $partner->status->value }}
                                </span>
                            </td>
                            <td class="px-5 py-4">
                                <div class="flex justify-end gap-2">
                                    <a href="{{ route('admin.partners.edit', $partner) }}" class="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700">Edit</a>
                                    <form method="POST" action="{{ route('admin.partners.destroy', $partner) }}" onsubmit="return confirm('Hapus mitra ini?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">Hapus</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-5 py-10 text-center text-neutral-500">Belum ada mitra.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    @if($partners->hasPages())
        <div class="flex justify-end">
            {{ $partners->links() }}
        </div>
    @endif
</div>
@endsection
