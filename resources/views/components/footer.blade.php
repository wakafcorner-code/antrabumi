@php
    $isEnglish = request()->cookie('antrabumi_lang') === 'EN';
    $siteName = $siteSettings['site_name'] ?? 'ANTRABUMI';
    $logoUrl = $siteSettings['site_logo_dark_url']
        ?? $siteSettings['site_logo_url']
        ?? asset('brand/logo-white.svg');
    $navLinks = $isEnglish
        ? [
            ['label' => 'About', 'href' => '/tentang'],
            ['label' => 'Experiences', 'href' => '/experience'],
            ['label' => 'Initiatives', 'href' => '/inisiatif'],
            ['label' => 'Knowledge', 'href' => '/pengetahuan'],
            ['label' => 'Collaboration', 'href' => '/kolaborasi'],
        ]
        : [
            ['label' => 'Tentang', 'href' => '/tentang'],
            ['label' => 'Pengalaman', 'href' => '/experience'],
            ['label' => 'Inisiatif', 'href' => '/inisiatif'],
            ['label' => 'Pengetahuan', 'href' => '/pengetahuan'],
            ['label' => 'Kolaborasi', 'href' => '/kolaborasi'],
        ];

    $instagramUrl = filled($siteSettings['instagram_url'] ?? null)
        ? $siteSettings['instagram_url']
        : 'https://instagram.com/antrabumi_org';
    $linkedinUrl = filled($siteSettings['linkedin_url'] ?? null)
        ? $siteSettings['linkedin_url']
        : 'https://www.linkedin.com/company/antrabumi';
    $whatsappUrl = filled($siteSettings['whatsapp_url'] ?? null)
        ? $siteSettings['whatsapp_url']
        : 'https://wa.me/6282330387505';
    $youtubeUrl = $siteSettings['youtube_url'] ?? null;
    $twitterUrl = $siteSettings['twitter_url'] ?? null;
    $facebookUrl = $siteSettings['facebook_url'] ?? null;
    $contactEmail = $siteSettings['contact_email'] ?? 'hello@antrabumi.org';
    $contactPhone = $siteSettings['contact_phone'] ?? '+62-823-3038-7505';
    $contactAddress = $siteSettings['contact_address'] ?? 'TRIGHA Creative Hub, Sudirman St, 08, Belitung';
    $tagline = $siteSettings['site_tagline'] ?? 'Connecting Knowledge, Nature, & Communities.';
@endphp

<footer role="contentinfo" class="border-t border-[#0D5C4D]/30 bg-[#0B1E1A] pb-8 pt-12 text-neutral-400 sm:pb-10 sm:pt-16">
    <div class="mx-auto max-w-[1280px] px-5 md:px-7 lg:px-10">
        <div class="grid grid-cols-1 gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 sm:gap-12 sm:pb-12 lg:grid-cols-12">
            <div class="min-w-0 space-y-4 sm:col-span-2 lg:col-span-5">
                <a href="{{ route('home') }}" class="inline-flex max-w-full items-center gap-3">
                    <img src="{{ $logoUrl }}" alt="{{ $siteName }}" class="h-9 w-auto max-w-[min(200px,70vw)] object-contain md:h-10">
                </a>

                <p class="max-w-xs text-sm font-medium leading-relaxed text-[#E5A823]">{{ $tagline }}</p>
                <p class="max-w-xs text-xs leading-relaxed text-neutral-400">
                    {{ $isEnglish ? 'An independent organization working at the intersection of knowledge, nature, and communities.' : 'Organisasi independen yang bekerja di persimpangan pengetahuan, alam, dan komunitas.' }}
                </p>

                <div class="space-y-3 pt-2">
                    <h2 class="text-xs font-semibold uppercase tracking-widest text-[#E5A823]">
                        {{ $isEnglish ? 'Connect with us' : 'Ikuti & hubungi kami' }}
                    </h2>

                    <div class="flex flex-wrap items-center gap-3">
                        <a href="{{ $instagramUrl }}" target="_blank" rel="noopener noreferrer" aria-label="Instagram ANTRABUMI" class="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:border-[#E5A823] hover:text-[#E5A823] hover:shadow-lg hover:shadow-black/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5A823]">
                            <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <rect x="3" y="3" width="18" height="18" rx="5" />
                                <circle cx="12" cy="12" r="4" />
                                <circle cx="17.5" cy="6.5" r=".75" fill="currentColor" stroke="none" />
                            </svg>
                            <span>Instagram</span>
                        </a>

                        <a href="{{ $linkedinUrl }}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn ANTRABUMI" class="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:border-[#E5A823] hover:text-[#E5A823] hover:shadow-lg hover:shadow-black/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5A823]">
                            <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <rect x="3" y="3" width="18" height="18" rx="3" />
                                <path d="M7 10v7" />
                                <path d="M7 7.2v.01" />
                                <path d="M11 17v-7" />
                                <path d="M11 13.2c0-2.3 5-3.7 5 1V17" />
                            </svg>
                            <span>LinkedIn</span>
                        </a>

                        <a href="{{ $whatsappUrl }}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ANTRABUMI" class="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:border-[#E5A823] hover:text-[#E5A823] hover:shadow-lg hover:shadow-black/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5A823]">
                            <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.4-4.9a8.4 8.4 0 1 1 16.1-3.9Z" />
                                <path d="M8.5 8.2c.3-.6.6-.6 1-.6h.4c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4 0 .7.5.8 1.2 1.5 2 2 .3.2.5.2.7-.1l.8-.9c.2-.2.4-.3.7-.2l1.8.9c.3.1.4.3.4.5 0 .4-.2 1-.6 1.4-.5.5-1.2.7-2 .6-1.1-.2-2.5-.9-3.8-2-1.3-1.1-2.3-2.5-2.6-3.7-.2-.8 0-1.7.6-2.2Z" fill="currentColor" stroke="none" />
                            </svg>
                            <span>WhatsApp</span>
                        </a>

                        @if(filled($youtubeUrl))
                            <a href="{{ $youtubeUrl }}" target="_blank" rel="noopener noreferrer" aria-label="YouTube ANTRABUMI" class="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:border-[#E5A823] hover:text-[#E5A823] hover:shadow-lg hover:shadow-black/20">
                                <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <rect x="2.5" y="5" width="19" height="14" rx="4" />
                                    <path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" />
                                </svg>
                                <span>YouTube</span>
                            </a>
                        @endif

                        @if(filled($twitterUrl))
                            <a href="{{ $twitterUrl }}" target="_blank" rel="noopener noreferrer" aria-label="X Twitter ANTRABUMI" class="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:border-[#E5A823] hover:text-[#E5A823] hover:shadow-lg hover:shadow-black/20">
                                <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <path d="M5 4h3.8L19 20h-3.8z" />
                                    <path d="M19 4l-6 7m-2 2-6 7" />
                                </svg>
                                <span>X</span>
                            </a>
                        @endif

                        @if(filled($facebookUrl))
                            <a href="{{ $facebookUrl }}" target="_blank" rel="noopener noreferrer" aria-label="Facebook ANTRABUMI" class="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:border-[#E5A823] hover:text-[#E5A823] hover:shadow-lg hover:shadow-black/20">
                                <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M14 21v-8h3l.5-4H14V7c0-1.2.4-2 2-2h1.7V1.4C17 1.2 15.8 1 14.4 1 11.2 1 9 2.9 9 6.5V9H6v4h3v8z" />
                                </svg>
                                <span>Facebook</span>
                            </a>
                        @endif
                    </div>
                </div>
            </div>

            <div class="min-w-0 space-y-4 lg:col-span-3">
                <h2 class="text-xs font-semibold uppercase tracking-widest text-[#E5A823]">
                    {{ $isEnglish ? 'Navigation' : 'Navigasi' }}
                </h2>
                <ul class="space-y-2.5 text-sm">
                    @foreach($navLinks as $link)
                        <li>
                            <a href="{{ $link['href'] }}" class="transition-colors hover:text-[#E5A823]">
                                {{ $link['label'] }}
                            </a>
                        </li>
                    @endforeach
                </ul>
            </div>

            <div class="min-w-0 space-y-4 lg:col-span-4">
                <h2 class="text-xs font-semibold uppercase tracking-widest text-[#E5A823]">
                    {{ $isEnglish ? 'Contact' : 'Kontak' }}
                </h2>
                <ul class="space-y-2.5 text-sm">
                    <li class="break-words">
                        <a href="mailto:{{ $contactEmail }}" class="hover:text-[#E5A823]">{{ $contactEmail }}</a>
                    </li>
                    <li class="break-words">
                        <a href="tel:{{ preg_replace('/[^0-9+]/', '', $contactPhone) }}" class="hover:text-[#E5A823]">{{ $contactPhone }}</a>
                    </li>
                    <li class="whitespace-pre-line break-words pt-1 text-xs leading-relaxed text-neutral-500">
                        {{ $contactAddress }}
                    </li>
                </ul>
            </div>
        </div>

        <div class="flex flex-col items-start justify-between gap-3 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:gap-4 sm:pt-8">
            <p>
                © {{ date('Y') }} {{ $siteName }}.
                {{ $isEnglish ? 'All rights reserved.' : 'Seluruh hak dilindungi.' }}
            </p>
            <a href="{{ route('home') }}" class="break-all transition-colors hover:text-[#E5A823]">antrabumi.org</a>
        </div>
    </div>
</footer>
