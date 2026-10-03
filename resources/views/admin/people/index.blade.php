@extends('layouts.admin')

@section('title', 'Tim & Pakar — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-7xl space-y-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Tim</p>
            <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Profil Tim &amp; Pakar</h1>
        </div>
        <a href="{{ route('admin.people.create') }}" class="inline-flex h-11 items-center rounded-xl bg-[#0D5C4D] px-5 text-sm font-semibold text-white">+ Tambah Profil</a>
    </div>

    <div class="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <form method="GET" action="{{ route('admin.people.index') }}" class="flex flex-col gap-3 md:flex-row md:items-center">
            <input type="text" name="search" value="{{ $search }}" placeholder="Cari profil atau nama" class="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none md:max-w-md">
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
                        <th class="px-5 py-3 font-semibold">Peran</th>
                        <th class="px-5 py-3 font-semibold">Status</th>
                        <th class="px-5 py-3 font-semibold text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-neutral-200">
                    @forelse($people as $person)
                        <tr>
                            <td class="px-5 py-4">
                                <div class="font-medium text-neutral-900">{{ $person->translations->first()?->name ?? $person->slug }}</div>
                            </td>
                            <td class="px-5 py-4 text-neutral-600">{{ $person->translations->first()?->role ?? '-' }}</td>
                            <td class="px-5 py-4">
                                <span class="inline-flex rounded-full {{ $person->status === \App\Enums\ContentStatus::PUBLISHED ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700' }} px-2.5 py-1 text-xs font-semibold">
                                    {{ $person->status->value }}
                                </span>
                            </td>
                            <td class="px-5 py-4">
                                <div class="flex justify-end gap-2">
                                    <a href="{{ route('admin.people.edit', $person) }}" class="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700">Edit</a>
                                    <form method="POST" action="{{ route('admin.people.destroy', $person) }}" onsubmit="return confirm('Hapus profil tim ini?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">Hapus</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="px-5 py-10 text-center text-neutral-500">Belum ada profil tim.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    @if($people->hasPages())
        <div class="flex justify-end">
            {{ $people->links() }}
        </div>
    @endif
</div>
@endsection
