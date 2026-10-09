@php
    $isEnglish = request()->cookie('antrabumi_lang') === 'EN';
    $siteName = $siteSettings['site_name'] ?? 'ANTRABUMI';
    $logoUrl = $siteSettings['site_logo_url'] ?? asset('brand/logo.svg');
    $returnTo = request()->getRequestUri();
@endphp
<header class="public-header sticky top-0 z-40 w-full border-b border-transparent bg-white/90 backdrop-blur-sm transition-all duration-300" data-public-header>
    <div class="mx-auto flex min-h-16 max-w-[1280px] flex-wrap items-center justify-between px-5 md:px-7 lg:min-h-[68px] lg:px-10">
        <a href="{{ route('home') }}" class="flex items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal">
            @if($logoUrl)
                <img src="{{ $logoUrl }}" alt="{{ $siteName }}" class="h-16 w-auto max-w-[240px] object-contain sm:h-20 sm:max-w-[300px] md:max-w-[360px]">
            @else
                <span class="font-heading text-lg font-bold tracking-tight text-neutral-950 sm:text-xl">{{ $siteName }}</span>
            @endif
        </a>

        @include('components.navigation.main')

        <div class="hidden items-center gap-3 lg:flex">
            <form method="POST" action="{{ route('language.update') }}" class="flex items-center rounded-full border border-neutral-200 bg-neutral-50 p-0.5" aria-label="{{ $isEnglish ? 'Choose language' : 'Pilih bahasa' }}">
                @csrf
                <input type="hidden" name="return_to" value="{{ $returnTo }}">
                <button name="language" value="ID" type="submit" aria-pressed="{{ !$isEnglish ? 'true' : 'false' }}" class="rounded-full px-3 py-1 text-xs font-semibold transition {{ !$isEnglish ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-800' }}">ID</button>
                <button name="language" value="EN" type="submit" aria-pressed="{{ $isEnglish ? 'true' : 'false' }}" class="rounded-full px-3 py-1 text-xs font-semibold transition {{ $isEnglish ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-800' }}">EN</button>
            </form>
            <a href="/kolaborasi#formulir" class="inline-flex h-9 items-center rounded-lg bg-brand-teal px-4 text-sm font-semibold text-white transition hover:bg-brand-teal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal">{{ $isEnglish ? 'Contact Us' : 'Hubungi Kami' }}</a>
        </div>

        <button type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-700 transition hover:bg-neutral-100 lg:hidden" aria-label="{{ $isEnglish ? 'Open main navigation' : 'Buka navigasi utama' }}" aria-controls="public-mobile-navigation" aria-expanded="false" data-menu-toggle data-menu-target="public-mobile-navigation">
            <svg data-menu-icon-open class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            <svg data-menu-icon-close class="hidden h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
    </div>
</header>
