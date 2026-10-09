<!doctype html>
<html lang="{{ request()->cookie('antrabumi_lang') === 'EN' ? 'en' : 'id' }}">
<head>
    @php
        $isEnglish = request()->cookie('antrabumi_lang') === 'EN';
        $defaultTitle = $isEnglish ? 'ANTRABUMI — Connecting Knowledge, Nature, & Communities' : 'ANTRABUMI — Menghubungkan Pengetahuan, Alam, & Komunitas';
        $defaultDescription = $isEnglish
            ? 'ANTRABUMI is an independent organization working at the intersection of knowledge, nature, and communities.'
            : 'ANTRABUMI adalah organisasi independen yang bekerja di persimpangan pengetahuan, alam, dan komunitas.';
        $seoTitle = trim($__env->yieldContent('og_title', $__env->yieldContent('title', $defaultTitle)));
        $seoDescription = trim($__env->yieldContent('og_description', $__env->yieldContent('description', $defaultDescription)));
        $seoImage = trim($__env->yieldContent('og_image'));
        $seoImage = $seoImage !== ''
            ? (str_starts_with($seoImage, 'http://') || str_starts_with($seoImage, 'https://') ? $seoImage : url($seoImage))
            : asset('images/pengetahuan/cerita-lapangan.jpg');
        $seoStructuredData = [
            '@context' => 'https://schema.org',
            '@graph' => [
                [
                    '@type' => 'Organization',
                    '@id' => url('/').'#organization',
                    'name' => 'ANTRABUMI',
                    'url' => url('/'),
                    'logo' => ['@type' => 'ImageObject', 'url' => asset('favicon.svg')],
                    'description' => $isEnglish
                        ? 'Connecting knowledge, nature, and communities.'
                        : 'Menghubungkan pengetahuan, alam, dan komunitas.',
                ],
                [
                    '@type' => 'WebSite',
                    '@id' => url('/').'#website',
                    'url' => url('/'),
                    'name' => 'ANTRABUMI',
                    'publisher' => ['@id' => url('/').'#organization'],
                    'inLanguage' => ['id-ID', 'en'],
                ],
            ],
        ];
    @endphp
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
    <meta name="theme-color" content="#0B1E1A">
    <title>@yield('title', $defaultTitle)</title>
    <meta name="description" content="@yield('description', $defaultDescription)">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <link rel="canonical" href="@yield('canonical', url()->current())">
    <meta property="og:type" content="@yield('og_type', 'website')">
    <meta property="og:site_name" content="ANTRABUMI">
    <meta property="og:title" content="{{ $seoTitle }}">
    <meta property="og:description" content="{{ $seoDescription }}">
    <meta property="og:url" content="@yield('canonical', url()->current())">
    <meta property="og:locale" content="{{ request()->cookie('antrabumi_lang') === 'EN' ? 'en_US' : 'id_ID' }}">
    <meta property="og:image" content="{{ $seoImage }}">
    <meta property="og:image:alt" content="{{ $seoTitle }}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $seoTitle }}">
    <meta name="twitter:description" content="{{ $seoDescription }}">
    <meta name="twitter:image" content="{{ $seoImage }}">
    <script type="application/ld+json">
        @php
            echo json_encode(
                $seoStructuredData,
                JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT,
            ) ?: '{}';
        @endphp
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @stack('head')
</head>
<body class="min-h-screen bg-white font-sans text-neutral-900 antialiased">
    <a class="skip-link" href="#main-content">{{ $isEnglish ? 'Skip to main content' : 'Lewati ke konten utama' }}</a>
    @include('components.header')
    <main id="main-content" tabindex="-1">@yield('content')</main>
    @include('components.public.floating-cta')
    @include('components.footer')
    @stack('scripts')
</body>
</html>
