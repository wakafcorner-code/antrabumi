<!doctype html>
<html lang="{{ request()->cookie('antrabumi_lang') === 'EN' ? 'en' : 'id' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
    <meta name="theme-color" content="#0B1E1A">
    <title>@yield('title', 'ANTRABUMI — Connecting Knowledge, Nature, & Communities')</title>
    <meta name="description" content="@yield('description', 'ANTRABUMI is an independent organization working at the intersection of knowledge, nature, and communities.')">
    <link rel="canonical" href="@yield('canonical', url()->current())">
    <meta property="og:type" content="@yield('og_type', 'website')">
    <meta property="og:site_name" content="ANTRABUMI">
    <meta property="og:title" content="@yield('og_title', trim($__env->yieldContent('title', 'ANTRABUMI — Connecting Knowledge, Nature, & Communities'))) ">
    <meta property="og:description" content="@yield('og_description', trim($__env->yieldContent('description', 'ANTRABUMI is an independent organization working at the intersection of knowledge, nature, and communities.'))) ">
    <meta property="og:url" content="@yield('canonical', url()->current())">
    @if(trim($__env->yieldContent('og_image')) !== '')
        <meta property="og:image" content="@yield('og_image')">
        <meta name="twitter:image" content="@yield('og_image')">
    @endif
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="@yield('og_title', trim($__env->yieldContent('title', 'ANTRABUMI — Connecting Knowledge, Nature, & Communities'))) ">
    <meta name="twitter:description" content="@yield('og_description', trim($__env->yieldContent('description', 'ANTRABUMI is an independent organization working at the intersection of knowledge, nature, and communities.'))) ">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @stack('head')
</head>
<body class="min-h-screen bg-white font-sans text-neutral-900 antialiased">
    <a class="skip-link" href="#main-content">Lewati ke konten utama</a>
    @include('components.header')
    <main id="main-content" tabindex="-1">@yield('content')</main>
    @include('components.public.floating-cta')
    @include('components.footer')
    @stack('scripts')
</body>
</html>
