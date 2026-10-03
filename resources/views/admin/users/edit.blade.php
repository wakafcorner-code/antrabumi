@extends('layouts.admin')

@section('title', 'Edit Pengguna — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-3xl space-y-6">
    <div class="flex items-center justify-between gap-3">
        <div>
            <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Sistem</p>
            <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Edit Pengguna</h1>
        </div>
        <a href="{{ route('admin.users.index') }}" class="text-sm font-semibold text-neutral-600 hover:text-neutral-900">← Kembali</a>
    </div>

    <form method="POST" action="{{ route('admin.users.update', $user) }}" class="space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        @csrf
        @method('PUT')
        <div class="grid gap-5 md:grid-cols-2">
            <div class="md:col-span-2">
                <label for="name" class="mb-2 block text-sm font-medium text-neutral-700">Nama</label>
                <input id="name" name="name" type="text" maxlength="100" value="{{ old('name', $user->name) }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none" required>
                @error('name')<p class="mt-1 text-xs text-red-600">{{ $message }}</p>@enderror
            </div>
            <div class="md:col-span-2">
                <label for="email" class="mb-2 block text-sm font-medium text-neutral-700">Email</label>
                <input id="email" name="email" type="email" value="{{ old('email', $user->email) }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none" required>
                @error('email')<p class="mt-1 text-xs text-red-600">{{ $message }}</p>@enderror
            </div>
        </div>

        <div class="flex justify-end gap-3">
            <a href="{{ route('admin.users.index') }}" class="inline-flex h-11 items-center rounded-xl border border-neutral-300 px-5 text-sm font-semibold text-neutral-700">Batal</a>
            <button type="submit" class="inline-flex h-11 items-center rounded-xl bg-[#0D5C4D] px-5 text-sm font-semibold text-white">Simpan Profil</button>
        </div>
    </form>

    <div class="grid gap-5 lg:grid-cols-2">
        @if($user->id !== auth()->id())
            <form method="POST" action="{{ route('admin.users.role', $user) }}" class="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                @csrf
                @method('PATCH')
                <h2 class="font-heading text-lg font-semibold text-neutral-900">Peran</h2>
                <label for="role" class="sr-only">Peran</label>
                <select id="role" name="role" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none" required>
                    @foreach($roles as $role)
                        <option value="{{ $role->value }}" {{ old('role', $user->role->value) === $role->value ? 'selected' : '' }}>{{ $role->value }}</option>
                    @endforeach
                </select>
                @error('role')<p class="text-xs text-red-600">{{ $message }}</p>@enderror
                <button type="submit" class="inline-flex h-10 items-center rounded-xl bg-[#0D5C4D] px-4 text-sm font-semibold text-white">Perbarui Peran</button>
            </form>

            <form method="POST" action="{{ route('admin.users.status', $user) }}" class="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                @csrf
                @method('PATCH')
                <h2 class="font-heading text-lg font-semibold text-neutral-900">Status Akun</h2>
                <label for="status" class="sr-only">Status Akun</label>
                <select id="status" name="status" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none" required>
                    @foreach($statuses as $status)
                        <option value="{{ $status->value }}" {{ old('status', $user->status->value) === $status->value ? 'selected' : '' }}>{{ $status->value }}</option>
                    @endforeach
                </select>
                @error('status')<p class="text-xs text-red-600">{{ $message }}</p>@enderror
                <button type="submit" class="inline-flex h-10 items-center rounded-xl bg-[#0D5C4D] px-4 text-sm font-semibold text-white">Perbarui Status</button>
            </form>
        @endif

        <form method="POST" action="{{ route('admin.users.password', $user) }}" class="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:col-span-2">
            @csrf
            @method('PATCH')
            <h2 class="font-heading text-lg font-semibold text-neutral-900">Ganti Password</h2>
            <div class="grid gap-4 md:grid-cols-2">
                <div>
                    <label for="password" class="mb-2 block text-sm font-medium text-neutral-700">Password Baru</label>
                    <input id="password" name="password" type="password" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none" required>
                    @error('password')<p class="mt-1 text-xs text-red-600">{{ $message }}</p>@enderror
                </div>
                <div>
                    <label for="confirmPassword" class="mb-2 block text-sm font-medium text-neutral-700">Konfirmasi Password Baru</label>
                    <input id="confirmPassword" name="confirmPassword" type="password" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none" required>
                    @error('confirmPassword')<p class="mt-1 text-xs text-red-600">{{ $message }}</p>@enderror
                </div>
            </div>
            <button type="submit" class="inline-flex h-10 items-center rounded-xl border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-700">Ganti Password</button>
        </form>
    </div>
</div>
@endsection
