@extends('layouts.app')

@section('title', 'Admin Masuk — ANTRABUMI')

@section('content')
<section class="mx-auto grid min-h-[70vh] max-w-6xl items-center gap-12 px-4 py-12 md:grid-cols-2 sm:px-6">
    <div class="rounded-lg bg-neutral-950 p-8 text-white sm:p-12">
        <p class="font-mono text-xs uppercase tracking-[0.2em] text-brand-gold">ANTRABUMI CMS</p>
        <h1 class="mt-5 font-heading text-4xl font-bold">Connecting Knowledge, Nature, &amp; Communities.</h1>
        <p class="mt-4 text-sm leading-relaxed text-neutral-300">Ruang kerja pengelolaan konten ANTRABUMI.</p>
    </div>
    <div class="mx-auto w-full max-w-md">
        <h2 class="font-heading text-2xl font-bold">Admin Masuk</h2>
        <p class="mt-2 text-sm text-neutral-600">Masuk ke panel administrasi ANTRABUMI.</p>
        @if ($errors->any())
            <div role="alert" class="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ $errors->first() }}</div>
        @endif
        <form method="POST" action="{{ route('login.store') }}" class="mt-6 space-y-4">
            @csrf
            <div>
                <label for="email" class="mb-1 block text-sm font-medium">Email</label>
                <input id="email" name="email" type="email" autocomplete="username" required value="{{ old('email') }}" class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20">
            </div>
            <div>
                <label for="password" class="mb-1 block text-sm font-medium">Password</label>
                <input id="password" name="password" type="password" autocomplete="current-password" required class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20">
            </div>
            <button type="submit" class="w-full rounded-md bg-brand-teal px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-teal-dark">Masuk</button>
        </form>
    </div>
</section>
@endsection
