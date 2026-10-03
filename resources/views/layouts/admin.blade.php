<!doctype html>
<html lang="{{ request()->cookie('antrabumi_lang') === 'EN' ? 'en' : 'id' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'CMS ANTRABUMI')</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen bg-neutral-50 font-sans text-neutral-900 antialiased">
    <div class="min-h-screen lg:flex">
        <button type="button" class="fixed inset-0 z-40 hidden bg-neutral-950/30 lg:hidden" aria-label="Tutup navigasi admin" data-menu-backdrop="admin-navigation"></button>
        @include('components.admin.sidebar')
        <div class="min-w-0 flex-1">
            @include('components.admin.header')
            <main id="admin-main" class="p-4 sm:p-6 lg:p-8">
                @include('partials.flash')
                @yield('content')
            </main>
        </div>
    </div>
</body>
</html>
