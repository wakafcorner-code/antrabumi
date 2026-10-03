@extends('layouts.admin')

@section('title', 'Tambah Pengguna — CMS ANTRABUMI')

@section('content')
<div class="mx-auto max-w-3xl space-y-6">
    <div class="flex items-center justify-between gap-3">
        <div>
            <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Sistem</p>
            <h1 class="mt-2 font-heading text-3xl font-bold text-neutral-950">Tambah Pengguna</h1>
        </div>
        <a href="{{ route('admin.users.index') }}" class="text-sm font-semibold text-neutral-600 hover:text-neutral-900">← Kembali</a>
    </div>

    <form method="POST" action="{{ route('admin.users.store') }}" class="space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        @csrf
        <div class="grid gap-5 md:grid-cols-2">
            <div class="md:col-span-2">
                <label for="name" class="mb-2 block text-sm font-medium text-neutral-700">Nama</label>
                <input id="name" name="name" type="text" value="{{ old('name') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none" required>
                @error('name')<p class="mt-1 text-xs text-red-600">{{ $message }}</p>@enderror
            </div>
            <div class="md:col-span-2">
                <label for="email" class="mb-2 block text-sm font-medium text-neutral-700">Email</label>
                <input id="email" name="email" type="email" value="{{ old('email') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none" required>
                @error('email')<p class="mt-1 text-xs text-red-600">{{ $message }}</p>@enderror
            </div>
            <div>
                <label for="role" class="mb-2 block text-sm font-medium text-neutral-700">Peran</label>
                <select id="role" name="role" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none" required>
                    @foreach($roles as $role)
                        <option value="{{ $role->value }}" {{ old('role') === $role->value ? 'selected' : '' }}>{{ $role->value }}</option>
                    @endforeach
                </select>
                @error('role')<p class="mt-1 text-xs text-red-600">{{ $message }}</p>@enderror
            </div>
            <div class="md:col-span-2">
                <label for="password" class="mb-2 block text-sm font-medium text-neutral-700">Password</label>
                <input id="password" name="password" type="password" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-[#0D5C4D] focus:outline-none" required>
                @error('password')<p class="mt-1 text-xs text-red-600">{{ $message }}</p>@enderror
            </div>
        </div>

        <div class="flex justify-end gap-3">
            <a href="{{ route('admin.users.index') }}" class="inline-flex h-11 items-center rounded-xl border border-neutral-300 px-5 text-sm font-semibold text-neutral-700">Batal</a>
            <button type="submit" class="inline-flex h-11 items-center rounded-xl bg-[#0D5C4D] px-5 text-sm font-semibold text-white">Simpan Pengguna</button>
        </div>
    </form>
</div>
@endsection
