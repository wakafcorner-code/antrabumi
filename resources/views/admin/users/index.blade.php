@extends('layouts.admin')

@section('title', 'Pengguna — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-7xl space-y-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Sistem</p>
            <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Pengguna &amp; Akses</h1>
        </div>
        <a href="{{ route('admin.users.create') }}" class="inline-flex h-11 items-center rounded-xl bg-[#0D5C4D] px-5 text-sm font-semibold text-white">+ Tambah Pengguna</a>
    </div>

    <div class="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <form method="GET" action="{{ route('admin.users.index') }}" class="flex flex-col gap-3 md:flex-row md:items-center">
            <input type="text" name="q" value="{{ $search }}" placeholder="Cari nama atau email" class="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none md:max-w-md">
            <button type="submit" class="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-700">Cari</button>
        </form>
    </div>

    <div class="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-neutral-200 text-left text-sm">
                <thead class="bg-neutral-50 text-neutral-600">
                    <tr>
                        <th class="px-5 py-3 font-semibold">Nama</th>
                        <th class="px-5 py-3 font-semibold">Email</th>
                        <th class="px-5 py-3 font-semibold">Peran</th>
                        <th class="px-5 py-3 font-semibold">Status</th>
                        <th class="px-5 py-3 font-semibold">Terakhir Login</th>
                        <th class="px-5 py-3 font-semibold text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-neutral-200">
                    @forelse($users as $userItem)
                        <tr>
                            <td class="px-5 py-4">
                                <div class="font-medium text-neutral-900">{{ $userItem->name }}</div>
                            </td>
                            <td class="px-5 py-4 text-neutral-600">{{ $userItem->email }}</td>
                            <td class="px-5 py-4">
                                <span class="inline-flex rounded-full bg-[#0D5C4D]/10 px-2.5 py-1 text-xs font-semibold text-[#0D5C4D]">{{ $userItem->role->value }}</span>
                            </td>
                            <td class="px-5 py-4">
                                <span class="inline-flex rounded-full {{ $userItem->status === \App\Enums\UserStatus::ACTIVE ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700' }} px-2.5 py-1 text-xs font-semibold">
                                    {{ $userItem->status->value }}
                                </span>
                            </td>
                            <td class="px-5 py-4 text-neutral-500">{{ $userItem->lastLoginAt ? $userItem->lastLoginAt->locale('id')->translatedFormat('d M Y H:i') : '-' }}</td>
                            <td class="px-5 py-4">
                                <div class="flex justify-end gap-2">
                                    <a href="{{ route('admin.users.edit', $userItem) }}" class="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700">Edit</a>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-5 py-10 text-center text-neutral-500">Tidak ada pengguna.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    @if($users->hasPages())
        <div class="flex justify-end">
            {{ $users->links() }}
        </div>
    @endif
</div>
@endsection
