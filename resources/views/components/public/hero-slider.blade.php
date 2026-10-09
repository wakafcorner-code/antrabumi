@php
    $activeSlides = array_values(array_filter($slides, static fn (array $slide): bool => !empty($slide['isActive'])));
    $displaySlides = $activeSlides !== [] ? $activeSlides : $slides;
    $interval = max(2000, min(30000, (int) ($config['intervalMs'] ?? 6000)));
@endphp
<section aria-label="{{ $isEnglish ? 'Homepage hero slider' : 'Slider utama beranda' }}" data-hero-slider data-autoplay="{{ !empty($config['autoplay']) ? 'true' : 'false' }}" data-interval="{{ $interval }}" data-pause-on-hover="{{ !empty($config['pauseOnHover']) ? 'true' : 'false' }}" class="relative flex min-h-[75vh] flex-col justify-between overflow-hidden bg-[#061512] text-white sm:min-h-[82vh] lg:min-h-[88vh]">
    <div class="absolute inset-0 z-0" aria-hidden="true">
        @foreach($displaySlides as $index => $slide)
            <div data-hero-slide @if($index > 0) hidden @endif class="absolute inset-0 transition-opacity duration-1000 ease-in-out" aria-hidden="{{ $index === 0 ? 'false' : 'true' }}">
                @if(!empty($slide['imageUrl']))<img src="{{ $slide['imageUrl'] }}" alt="" class="h-full w-full object-cover object-center">@else<div class="h-full w-full bg-gradient-to-br from-[#061814] via-[#0B2520] to-[#04100D]"><div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(13,92,77,.34),transparent_45%),radial-gradient(ellipse_at_80%_75%,rgba(229,168,35,.12),transparent_40%)]"></div></div>@endif
            </div>
        @endforeach
        <div class="absolute inset-0 bg-gradient-to-r from-[#051411]/95 via-[#051411]/80 to-[#051411]/40 md:via-[#051411]/65"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-[#051411]/95 via-transparent to-[#051411]/60"></div>
        <div class="pointer-events-none absolute inset-0 opacity-[0.035]" style="background-image: repeating-linear-gradient(0deg,transparent,transparent 60px,#fff 60px,#fff 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,#fff 60px,#fff 61px)"></div>
    </div>
    <div class="relative z-10 flex flex-1 flex-col justify-between pb-10 pt-16 sm:pb-14 sm:pt-20 lg:pb-16 lg:pt-28">
        <div class="mx-auto flex w-full max-w-[1280px] flex-1 flex-col justify-center px-5 md:px-7 lg:px-10">
            <div class="max-w-4xl space-y-6 sm:space-y-8">
                @foreach($displaySlides as $index => $slide)
                    @php
                        $tagline = $isEnglish ? ($slide['taglineEn'] ?? null) : null;
                        $title = $isEnglish ? ($slide['titleEn'] ?? null) : null;
                        $subtitle = $isEnglish ? ($slide['subtitleEn'] ?? null) : null;
                        $primaryText = $isEnglish ? ($slide['primaryCtaTextEn'] ?? null) : null;
                        $secondaryText = $isEnglish ? ($slide['secondaryCtaTextEn'] ?? null) : null;
                    @endphp
                    <div data-hero-copy @if($index > 0) hidden @endif class="space-y-6 sm:space-y-8">
                        <div class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 shadow-sm backdrop-blur-md"><span class="h-2 w-2 rounded-full bg-[#E5A823]"></span><span class="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-white/95 sm:text-xs">{{ $tagline ?: ($slide['tagline'] ?? ($isEnglish ? 'ANTRABUMI — Independent Organization' : 'ANTRABUMI — Organisasi Independen')) }}</span></div>
                        <h1 class="font-heading text-4xl font-bold leading-[1.06] tracking-tight text-white drop-shadow-sm sm:text-5xl md:text-6xl lg:text-7xl">{{ $title ?: ($slide['title'] ?? '') }}</h1>
                        <p class="max-w-2xl text-base font-light leading-relaxed text-neutral-200/90 drop-shadow-sm sm:text-xl">{{ $subtitle ?: ($slide['subtitle'] ?? '') }}</p>
                        <div class="flex flex-wrap items-center gap-4 pt-2">
                            @php($primaryLink = $slide['primaryCtaLink'] ?? '/kolaborasi#kontak')
                            @if(($primaryText ?: ($slide['primaryCtaText'] ?? null)))<a href="{{ $primaryLink }}" class="inline-flex h-12 items-center rounded-xl bg-gradient-to-r from-[#0D5C4D] via-[#116958] to-[#147A66] px-8 text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:brightness-110">{{ $primaryText ?: $slide['primaryCtaText'] }}</a>@endif
                            @php($secondaryLink = $slide['secondaryCtaLink'] ?? '/tentang')
                            @if(($secondaryText ?: ($slide['secondaryCtaText'] ?? null)))<a href="{{ $secondaryLink }}" class="inline-flex h-12 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/20">{{ $secondaryText ?: $slide['secondaryCtaText'] }} <span aria-hidden="true">→</span></a>@endif
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
        @if(count($displaySlides) > 1)
            <div class="mx-auto mt-10 flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-4 border-t border-white/15 px-5 pt-5 sm:mt-12 sm:px-7 sm:pt-6 lg:px-10">
                <div class="flex items-center gap-4"><div class="flex items-center gap-2" role="tablist" aria-label="{{ $isEnglish ? 'Slide indicators' : 'Indikator slide' }}">@foreach($displaySlides as $index => $slide)<button type="button" data-hero-indicator aria-label="{{ $isEnglish ? 'Go to slide' : 'Buka slide' }} {{ $index + 1 }}" aria-selected="{{ $index === 0 ? 'true' : 'false' }}" class="h-2 rounded-full transition-all duration-300 {{ $index === 0 ? 'w-10 bg-[#E5A823]' : 'w-2.5 bg-white/30 hover:bg-white/60' }}"></button>@endforeach</div><span data-hero-count class="font-mono text-xs font-semibold text-white/75">01 / {{ str_pad((string) count($displaySlides), 2, '0', STR_PAD_LEFT) }}</span></div>
                <div class="flex items-center gap-2"><button type="button" data-hero-pause aria-label="{{ $isEnglish ? 'Pause autoplay' : 'Jeda putar otomatis' }}" class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:border-white/40 hover:bg-white/20 sm:h-10 sm:w-10">Ⅱ</button><button type="button" data-hero-prev aria-label="{{ $isEnglish ? 'Previous slide' : 'Slide Sebelumnya' }}" class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20 sm:h-10 sm:w-10">←</button><button type="button" data-hero-next aria-label="{{ $isEnglish ? 'Next slide' : 'Slide Selanjutnya' }}" class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20 sm:h-10 sm:w-10">→</button></div>
            </div>
        @endif
    </div>
</section>