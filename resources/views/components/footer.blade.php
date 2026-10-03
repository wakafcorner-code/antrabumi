@php
    $isEnglish = request()->cookie('antrabumi_lang') === 'EN';
    $siteName = $siteSettings['site_name'] ?? 'ANTRABUMI';
    $logoUrl = $siteSettings['site_logo_dark_url'] ?? $siteSettings['site_logo_url'] ?? asset('brand/logo-white.svg');
    $navLinks = $isEnglish
        ? [['label' => 'About', 'href' => '/tentang'], ['label' => 'Experiences', 'href' => '/experience'], ['label' => 'Initiatives', 'href' => '/inisiatif'], ['label' => 'Knowledge', 'href' => '/pengetahuan'], ['label' => 'Collaboration', 'href' => '/kolaborasi']]
        : [['label' => 'Tentang', 'href' => '/tentang'], ['label' => 'Pengalaman', 'href' => '/experience'], ['label' => 'Inisiatif', 'href' => '/inisiatif'], ['label' => 'Pengetahuan', 'href' => '/pengetahuan'], ['label' => 'Kolaborasi', 'href' => '/kolaborasi']];
    $socialLinks = [
        'instagram_url' => 'Instagram', 'linkedin_url' => 'LinkedIn', 'youtube_url' => 'YouTube',
        'twitter_url' => 'X / Twitter', 'facebook_url' => 'Facebook', 'whatsapp_url' => 'WhatsApp',
    ];
@endphp
<footer role="contentinfo" class="border-t border-[#0D5C4D]/30 bg-[#0B1E1A] pb-10 pt-16 text-neutral-400">
    <div class="mx-auto max-w-[1280px] px-5 md:px-7 lg:px-10">
        <div class="grid grid-cols-1 gap-12 border-b border-white/10 pb-12 md:grid-cols-12">
            <div class="space-y-4 md:col-span-5">
                <a href="{{ route('home') }}" class="inline-flex items-center gap-3"><img src="{{ $logoUrl }}" alt="{{ $siteName }}" class="h-9 w-auto max-w-[200px] object-contain md:h-10"></a>
                <p class="max-w-xs text-sm font-medium leading-relaxed text-[#E5A823]">{{ $siteSettings['site_tagline'] ?? 'Connecting Knowledge, Nature, & Communities.' }}</p>
                <p class="max-w-xs text-xs leading-relaxed text-neutral-400">{{ $isEnglish ? 'An independent organization working at the intersection of knowledge, nature, and communities.' : 'Organisasi independen yang bekerja di persimpangan pengetahuan, alam, dan komunitas.' }}</p>
                <div class="flex flex-wrap items-center gap-3 pt-2">
                    @foreach($socialLinks as $key => $label)
                        @if(!empty($siteSettings[$key]))
                            <a href="{{ $siteSettings[$key] }}" target="_blank" rel="noopener noreferrer" aria-label="{{ $label }} ANTRABUMI" class="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-neutral-300 transition hover:border-[#E5A823]/50 hover:bg-[#E5A823]/10 hover:text-[#E5A823]">{{ strtoupper(substr($label, 0, 1)) }}</a>
                        @endif
                    @endforeach
                </div>
            </div>
            <div class="space-y-4 md:col-span-3">
                <h2 class="text-xs font-semibold uppercase tracking-widest text-[#E5A823]">{{ $isEnglish ? 'Navigation' : 'Navigasi' }}</h2>
                <ul class="space-y-2.5 text-sm">
                    @foreach($navLinks as $link)<li><a href="{{ $link['href'] }}" class="transition-colors hover:text-[#E5A823]">{{ $link['label'] }}</a></li>@endforeach
                </ul>
            </div>
            <div class="space-y-4 md:col-span-4">
                <h2 class="text-xs font-semibold uppercase tracking-widest text-[#E5A823]">{{ $isEnglish ? 'Contact' : 'Kontak' }}</h2>
                <ul class="space-y-2.5 text-sm">
                    <li><a href="mailto:{{ $siteSettings['contact_email'] ?? 'hello@antrabumi.org' }}" class="hover:text-[#E5A823]">{{ $siteSettings['contact_email'] ?? 'hello@antrabumi.org' }}</a></li>
                    <li><a href="tel:{{ preg_replace('/[^0-9+]/', '', $siteSettings['contact_phone'] ?? '+62-823-3038-7505') }}" class="hover:text-[#E5A823]">{{ $siteSettings['contact_phone'] ?? '+62-823-3038-7505' }}</a></li>
                    <li class="whitespace-pre-line pt-1 text-xs leading-relaxed text-neutral-500">{{ $siteSettings['contact_address'] ?? 'TRIGHA Creative Hub, Sudirman St, 08, Belitung' }}</li>
                </ul>
            </div>
        </div>
        <div class="flex flex-col items-start justify-between gap-4 pt-8 text-xs text-neutral-500 sm:flex-row sm:items-center">
            <p>© {{ date('Y') }} {{ $siteName }}. {{ $isEnglish ? 'All rights reserved.' : 'Seluruh hak dilindungi.' }}</p>
            <a href="https://www.antrabumi.org" class="transition-colors hover:text-[#E5A823]">www.antrabumi.org</a>
        </div>
    </div>
</footer>
