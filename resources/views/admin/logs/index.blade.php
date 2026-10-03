@extends('layouts.admin')

@section('title', 'Audit Log — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-7xl space-y-6">
    <div>
        <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Sistem</p>
        <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Audit Log</h1>
    </div>

    <div class="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <form method="GET" action="{{ route('admin.logs.index') }}" class="flex flex-col gap-3 md:flex-row md:items-center">
            <select name="action" class="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none">
                <option value="">Semua aksi</option>
                @foreach(['LOGIN','LOGOUT','CREATE','UPDATE','DELETE','PUBLISH','UNPUBLISH','ARCHIVE','UPLOAD','USER_ROLE_CHANGED','SETTING_CHANGED'] as $action)
                    <option value="{{ $action }}" {{ $action === request('action') ? 'selected' : '' }}>{{ $action }}</option>
                @endforeach
            </select>
            <input type="text" name="entity" value="{{ request('entity') }}" placeholder="Filter entitas" class="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-[#0D5C4D] focus:outline-none md:max-w-md">
            <button type="submit" class="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-700">Filter</button>
        </form>
    </div>

    <div class="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-neutral-200 text-left text-sm">
                <thead class="bg-neutral-50 text-neutral-600">
                    <tr>
                        <th class="px-5 py-3 font-semibold">Waktu</th>
                        <th class="px-5 py-3 font-semibold">Pengguna</th>
                        <th class="px-5 py-3 font-semibold">Aksi</th>
                        <th class="px-5 py-3 font-semibold">Entitas</th>
                        <th class="px-5 py-3 font-semibold">ID</th>
                        <th class="px-5 py-3 font-semibold">IP</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-neutral-200">
                    @forelse($logs as $log)
                        <tr>
                            <td class="px-5 py-4 text-neutral-500">{{ $log->createdAt->locale('id')->translatedFormat('d M Y H:i') }}</td>
                            <td class="px-5 py-4 text-neutral-700">{{ $log->user?->name ?? 'Sistem' }}</td>
                            <td class="px-5 py-4"><span class="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700">{{ $log->action->value }}</span></td>
                            <td class="px-5 py-4 text-neutral-700">{{ $log->entity ?? '-' }}</td>
                            <td class="px-5 py-4 text-neutral-500">{{ $log->entityId ?? '-' }}</td>
                            <td class="px-5 py-4 font-mono text-xs text-neutral-500">{{ $log->ipAddress ?? '-' }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-5 py-10 text-center text-neutral-500">Belum ada log aktivitas.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    @if($logs->hasPages())
        <div class="flex justify-end">
            {{ $logs->links() }}
        </div>
    @endif
</div>
@endsection
