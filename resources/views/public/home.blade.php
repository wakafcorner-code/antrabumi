@extends('layouts.app')

@section('title', $isEnglish ? 'ANTRABUMI — Connecting Knowledge, Nature, & Communities' : 'ANTRABUMI — Menghubungkan Pengetahuan, Alam, & Komunitas')
@section('description', $isEnglish ? 'ANTRABUMI is an independent organization working at the intersection of knowledge, nature, and communities — connecting field research, local knowledge, and cross-sector collaboration.' : 'ANTRABUMI adalah organisasi independen yang bekerja di persimpangan pengetahuan, alam, dan komunitas — menghubungkan riset lapangan, pengetahuan lokal, dan kolaborasi lintas sektor.')
@section('canonical', url('/'))
@section('og_title', $isEnglish ? 'ANTRABUMI — Connecting Knowledge, Nature, & Communities' : 'ANTRABUMI — Menghubungkan Pengetahuan, Alam, & Komunitas')
@section('og_description', $isEnglish ? 'An independent organization connecting research, field experience, local knowledge, and communities to develop contextual approaches.' : 'Organisasi independen yang menghubungkan riset, pengalaman lapangan, pengetahuan lokal, dan komunitas untuk mengembangkan pendekatan yang kontekstual.')

@section('content')
@php
    $content = $homeContent;
    $isEn = $isEnglish;
    $expertise = is_array($expertise[$isEn ? 'EN' : 'ID'] ?? null)
        ? $expertise[$isEn ? 'EN' : 'ID']
        : $expertise;
    $localized = static fn (array $values, string $key, string $fallbackKey = ''): string => (string) (($isEn ? ($values[$key.'En'] ?? null) : null) ?: ($values[$fallbackKey !== '' ? $fallbackKey : $key] ?? ''));
@endphp
<div class="bg-white selection:bg-[#0D5C4D] selection:text-white">
    @include('components.public.hero-slider', ['slides' => $heroSlides, 'config' => $heroConfig, 'isEnglish' => $isEn])

    <section aria-labelledby="why-heading" class="relative border-b border-neutral-100 bg-[#FAF9F5] py-16 sm:py-24 lg:py-28">
        <div class="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-12 px-5 md:px-7 lg:grid-cols-12 lg:gap-16 lg:px-10">
            <div class="space-y-6 lg:col-span-7">
                <div class="inline-flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-[#D96B27]"></span><span class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#D96B27]">{{ $localized($content['whyUs'], 'badge', 'badge') ?: ($isEn ? 'WHY ANTRABUMI EXISTS' : 'MENGAPA KAMI HADIR') }}</span></div>
                <h2 id="why-heading" class="font-heading text-3xl font-bold leading-[1.2] tracking-tight text-neutral-950 sm:text-4xl lg:text-[42px]">{{ $localized($content['whyUs'], 'title') }}</h2>
                <p class="whitespace-pre-line text-base font-normal leading-relaxed text-neutral-700 sm:text-lg">{{ $localized($content['whyUs'], 'leadText') }}</p>
                <div class="relative rounded-2xl border-l-4 border-[#0D5C4D] bg-white p-6 shadow-sm sm:p-8">
                    <span class="absolute -top-3 left-6 font-serif text-5xl font-bold leading-none text-[#0D5C4D]/20">“</span>
                    <h3 class="font-heading text-base font-bold text-neutral-900 sm:text-lg">{{ $localized($content['whyUs'], 'bridgeTitle') }}</h3>
                    <p class="mt-2 text-sm leading-relaxed text-neutral-600 sm:text-base">{{ $localized($content['whyUs'], 'bridgeText') }}</p>
                    <div class="mt-4 flex items-center gap-3 border-t border-neutral-100 pt-3 font-mono text-xs text-neutral-400"><span class="font-semibold text-[#0D5C4D]">ANTRABUMI</span><span>·</span><span>{{ $isEn ? 'Independent Organization' : 'Organisasi Independen' }}</span></div>
                </div>
            </div>
            <div class="relative lg:col-span-5">
                <div class="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-3 shadow-xl">
                    <div class="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-neutral-900">
                        <img src="{{ $content['whyUs']['imageUrl'] ?: '/images/inisiatif/iklim-lanskap.jpg' }}" alt="Bentang alam dan masyarakat pesisir Belitung" class="h-full w-full object-cover brightness-[0.92] contrast-[1.05] transition-transform duration-700 hover:scale-105">
                        <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/20 to-transparent"></div>
                        <div class="absolute bottom-4 left-4 right-4 text-white"><p class="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#E5A823]">{{ $isEn ? 'Field Notes & Landscapes' : 'Catatan Lapangan & Bentang Alam' }}</p><p class="mt-1 font-heading text-sm font-bold leading-snug">{{ $isEn ? 'Connecting field knowledge and community reality with real-world sustainability.' : 'Menghubungkan suara tapak, kearifan lokal, dan sains untuk masa depan yang lestari.' }}</p><p class="mt-1 font-mono text-[10px] text-neutral-300">{{ $isEn ? 'Belitung &amp; the Indonesian Archipelago' : 'Belitung &amp; Kepulauan Nusantara' }}</p></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section aria-labelledby="pillars-heading" class="border-b border-neutral-100 bg-white py-16 sm:py-24 lg:py-28">
        <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
            <div class="mx-auto max-w-3xl text-center"><span class="inline-block rounded-full bg-[#0D5C4D]/10 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-[#0D5C4D]">{{ $isEn ? 'THREE CORE PILLARS' : 'TIGA PILAR UTAMA' }}</span><h2 id="pillars-heading" class="mt-4 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl lg:text-[40px]">{{ $localized($content['about'], 'title') }}</h2><p class="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">{{ $localized($content['about'], 'description') }}</p></div>
            @if(!empty($content['about']['diagramUrl']))
                <figure class="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm sm:mt-12 sm:p-3">
                    <img src="{{ $content['about']['diagramUrl'] }}" alt="{{ $localized($content['about'], 'title') }}" loading="lazy" class="mx-auto max-h-[34rem] w-full rounded-xl object-contain">
                </figure>
            @endif
            <div class="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
                @foreach($content['pillars'] as $index => $pillar)
                    @php
                        $accent = [['#0D5C4D', 'bg-[#0D5C4D]'], ['#116958', 'bg-[#116958]'], ['#D96B27', 'bg-[#D96B27]']][$index % 3];
                        $pillarImage = $pillarImages[$pillar['key']] ?? $fallbackExperienceImages[$index % count($fallbackExperienceImages)];
                    @endphp
                    <article class="group overflow-hidden rounded-3xl border border-neutral-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                        <div class="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900"><img src="{{ $pillarImage }}" alt="{{ $localized($pillar, 'label') }}" class="h-full w-full object-cover brightness-[0.88] transition-transform duration-700 group-hover:scale-105"><div class="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent"></div><span class="absolute left-4 top-4 rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-white {{ $accent[1] }}">0{{ $index + 1 }} · {{ $isEn ? 'PILLAR' : 'PILAR' }}</span><p class="absolute bottom-3 left-4 right-4 font-heading text-xl font-bold tracking-wide text-white">{{ $localized($pillar, 'label') }}</p></div>
                        <div class="flex h-full flex-col justify-between p-6 sm:p-7"><div><h3 class="font-heading text-base font-bold text-neutral-900 transition-colors group-hover:text-brand-teal">{{ $localized($pillar, 'label') }}</h3><p class="mt-2.5 text-sm leading-relaxed text-neutral-600">{{ $localized($pillar, 'description') }}</p></div><div class="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4 font-mono text-[11px] uppercase tracking-wider text-neutral-400"><span>{{ $isEn ? 'Core Foundation' : 'Pilar Fundamental' }}</span><span>→</span></div></div>
                    </article>
                @endforeach
            </div>
        </div>
    </section>

    <section aria-labelledby="journey-heading" class="border-b border-neutral-100 bg-[#FAF9F6] py-16 sm:py-24">
        <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
            <div class="mb-12 max-w-2xl"><span class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#D96B27]">{{ $localized($content['growth'], 'badge') }}</span><h2 id="journey-heading" class="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">{{ $localized($content['growth'], 'title') }}</h2><p class="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-600 sm:text-base">{{ $localized($content['growth'], 'leadText') }}</p></div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                @foreach($content['growth']['timeline'] as $item)
                    <article class="flex flex-col justify-between rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 {{ $loop->last ? 'border-[#0D5C4D] bg-[#0D5C4D] text-white shadow-lg shadow-[#0D5C4D]/25' : 'border-neutral-200/90 bg-white hover:border-[#0D5C4D]/40 hover:shadow-md' }}">
                        <div><div class="flex items-center justify-between"><span class="font-mono text-2xl font-bold tracking-tight {{ $loop->last ? 'text-[#E5A823]' : 'text-[#0D5C4D]' }}">{{ $item['year'] }}</span>@if($loop->last)<span class="rounded-full bg-[#E5A823] px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-neutral-900">{{ $isEn ? 'New' : 'Baru' }}</span>@endif</div><h3 class="mt-2 font-heading text-sm font-bold leading-snug {{ $loop->last ? 'text-white' : 'text-neutral-900' }}">{{ $localized($item, 'label') }}</h3></div>
                        <p class="mt-3 text-xs leading-relaxed {{ $loop->last ? 'text-neutral-200' : 'text-neutral-600' }}">{{ $localized($item, 'description') }}</p>
                    </article>
                @endforeach
            </div>
        </div>
    </section>

    <section aria-labelledby="framework-heading" class="border-b border-neutral-100 bg-white py-16 sm:py-24">
        <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
            <div class="mb-12 max-w-3xl"><span class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-teal">{{ $isEn ? 'OUR WORKING FRAMEWORK' : 'CARA KAMI BEKERJA' }}</span><h2 id="framework-heading" class="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">{{ $localized($content['framework'], 'title') }}</h2><p class="mt-3 text-base leading-relaxed text-neutral-600 sm:text-lg">{{ $isEn ? '“Every collaboration begins with understanding context, not offering solutions.”' : '“Setiap kolaborasi berawal dari memahami konteks, bukan menawarkan solusi.”' }}</p></div>
            <div class="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
                <div class="space-y-3 lg:col-span-7">
                    @foreach($content['framework']['steps'] as $index => $step)
                        @php
                            $stepColors = ['bg-[#0D5C4D] text-white', 'bg-[#116958] text-white', 'bg-[#D96B27] text-white', 'bg-[#2B8282] text-white', 'bg-[#E5A823] text-neutral-900'];
                        @endphp
                        <div class="group flex items-start gap-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-4 transition hover:border-[#0D5C4D]/40 hover:bg-white hover:shadow-md sm:p-5"><span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold shadow-sm {{ $stepColors[$index % count($stepColors)] }}">{{ $step['step'] }}</span><div class="flex-1"><p class="font-heading text-base font-bold tracking-wide text-neutral-950 transition-colors group-hover:text-brand-teal">{{ $localized($step, 'title') }}</p><p class="mt-1 text-xs leading-relaxed text-neutral-600 sm:text-sm">{{ $localized($step, 'desc') }}</p></div></div>
                    @endforeach
                </div>
                <div class="lg:col-span-5"><div class="rounded-3xl border border-[#D96B27]/40 bg-gradient-to-br from-[#FFFDFB] via-white to-[#FDF4EE] p-7 shadow-sm sm:p-8"><span class="inline-flex items-center gap-2 rounded-full bg-[#D96B27]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D96B27]">{{ $isEn ? 'GEDSI IN ACTION' : 'GEDSI DALAM AKSI' }}</span><h3 class="mt-4 font-heading text-xl font-bold text-neutral-950 sm:text-2xl">{{ $localized($content['framework'], 'gedsiTitle') }}</h3><p class="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-base">{{ $localized($content['framework'], 'gedsiText') }}</p><div class="mt-6 space-y-2 border-t border-[#D96B27]/20 pt-4 text-xs text-neutral-600"><div class="flex items-center gap-2"><span class="font-bold text-[#D96B27]">✓</span><span>{{ $isEn ? 'Gender Equality — Equal participation for women and men' : 'Kesetaraan Gender — Pelibatan setara perempuan dan laki-laki' }}</span></div><div class="flex items-center gap-2"><span class="font-bold text-[#D96B27]">✓</span><span>{{ $isEn ? 'Disability Inclusion — Access and rights for persons with disabilities' : 'Inklusi Disabilitas — Akses dan hak bagi penyandang disabilitas' }}</span></div><div class="flex items-center gap-2"><span class="font-bold text-[#D96B27]">✓</span><span>{{ $isEn ? 'Social Inclusion — Ensuring no vulnerable group is left behind' : 'Inklusi Sosial — Memastikan kelompok rentan tidak tertinggal' }}</span></div></div></div></div>
            </div>
        </div>
    </section>

    <section aria-labelledby="contributions-heading" class="border-b border-neutral-100 bg-[#FAF9F5] py-16 sm:py-24">
        <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
            <div class="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><span class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#D96B27]">05 — {{ $isEn ? 'OUR CONTRIBUTION' : 'KONTRIBUSI KAMI' }}</span><h2 id="contributions-heading" class="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">{{ $isEn ? 'Our 6 Contribution Areas' : 'Enam Bidang Kontribusi Kami' }}</h2></div><a href="/inisiatif" class="text-sm font-semibold text-brand-teal underline underline-offset-4 hover:text-brand-teal-dark">{{ $isEn ? 'Explore all initiatives →' : 'Eksplorasi seluruh inisiatif →' }}</a></div>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                @foreach($contributions as $area)
                    <a href="{{ $area['href'] }}" class="group flex flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-teal hover:shadow-xl"><div><div class="flex items-center justify-between"><span class="rounded-md bg-[#0D5C4D]/10 px-2.5 py-0.5 font-mono text-xs font-bold text-brand-teal">{{ $area['no'] }}</span><span class="font-mono text-[10px] uppercase tracking-wider text-neutral-400 transition-colors group-hover:text-brand-teal">{{ $area['tag'] }}</span></div><h3 class="mt-4 font-heading text-lg font-bold leading-snug text-neutral-950 transition-colors group-hover:text-brand-teal">{{ $area['title'] }}</h3><p class="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">{{ $area['desc'] }}</p></div><div class="mt-5 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs font-semibold text-brand-teal opacity-0 transition-opacity group-hover:opacity-100"><span>{{ $isEn ? 'Explore related initiatives' : 'Lihat Inisiatif Terkait' }}</span><span>→</span></div></a>
                @endforeach
            </div>
        </div>
    </section>

    <section aria-labelledby="experiences-heading" class="border-b border-neutral-100 bg-white py-16 sm:py-24">
        <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
            <div class="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><span class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-teal">{{ $isEn ? 'SELECTED EXPERIENCES' : 'PENGALAMAN & INISIATIF TERPILIH' }}</span><h2 id="experiences-heading" class="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">{{ $isEn ? 'Experiences that shape the way we work.' : 'Pengalaman yang membentuk cara kami bekerja.' }}</h2></div><a href="/inisiatif" class="text-sm font-semibold text-brand-teal underline underline-offset-4 hover:text-brand-teal-dark">{{ $isEn ? 'View all initiatives →' : 'Lihat semua inisiatif →' }}</a></div>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                @foreach($experiences as $index => $experience)
                    @php
                        $title = $isEn && $experience['titleEn'] ? $experience['titleEn'] : ($experience['titleId'] ?: $experience['slug']);
                    @endphp
                    <a href="/inisiatif/{{ $experience['slug'] }}" class="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0D5C4D]/60 hover:shadow-xl">
                        <div class="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900"><img src="{{ $experience['coverMediaUrl'] ?: $fallbackExperienceImages[$index % count($fallbackExperienceImages)] }}" alt="{{ $experience['coverMediaAlt'] ?: $title }}" class="h-full w-full object-cover brightness-[0.92] transition-transform duration-700 group-hover:scale-105"><div class="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent"></div>@if($experience['year'])<span class="absolute bottom-2.5 right-2.5 rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] font-semibold text-white backdrop-blur-sm">{{ $experience['year'] }}</span>@endif</div>
                        <div class="flex flex-1 flex-col justify-between p-5"><div><div class="flex flex-wrap items-center gap-1.5"><span class="rounded bg-[#0D5C4D]/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-brand-teal">{{ $isEn ? ($experience['type'] === 'INITIATIVE' ? 'Campaign' : 'Project') : ($experience['type'] === 'INITIATIVE' ? 'Kampanye' : 'Proyek') }}</span>@if($experience['category'])<span class="font-mono text-[10px] text-neutral-400">· {{ $experience['category'] }}</span>@endif</div><h3 class="mt-2.5 line-clamp-2 font-heading text-sm font-bold leading-snug text-neutral-950 transition-colors group-hover:text-brand-teal">{{ $title }}</h3>@if($experience['clientName'])<p class="mt-1 line-clamp-1 text-xs text-neutral-500">{{ $isEn ? 'Partner:' : 'Mitra:' }} {{ $experience['clientName'] }}</p>@endif</div><div class="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs font-semibold text-brand-teal"><span>{{ $isEn ? 'Initiative details' : 'Detail Inisiatif' }}</span><span class="transition-transform group-hover:translate-x-1">→</span></div></div>
                    </a>
                @endforeach
            </div>
        </div>
    </section>

    @if($latestKnowledge)
        <section aria-labelledby="knowledge-heading" class="border-b border-neutral-100 bg-[#FAF9F6] py-16 sm:py-24">
            <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
                <div class="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><span class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-teal">{{ $isEn ? 'KNOWLEDGE HUB' : 'HUB PENGETAHUAN TERKINI' }}</span><h2 id="knowledge-heading" class="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">{{ $isEn ? 'Recent Research & Field Stories' : 'Riset, Publikasi & Cerita Lapangan' }}</h2></div><a href="/pengetahuan" class="text-sm font-semibold text-brand-teal underline underline-offset-4 hover:text-brand-teal-dark">{{ $isEn ? 'View all publications →' : 'Lihat semua publikasi →' }}</a></div>
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    @php
                        $knowledgeTypeLabels = $isEn
                            ? ['ARTICLE' => 'Article', 'RESEARCH_PUBLICATION' => 'Research & Publication', 'STORY' => 'Field Story']
                            : ['ARTICLE' => 'Artikel', 'RESEARCH_PUBLICATION' => 'Riset & Publikasi', 'STORY' => 'Cerita Lapangan'];
                    @endphp
                    @foreach($latestKnowledge as $item)
                        @php
                            $idTranslation = collect($item['translations'])->firstWhere('language', 'ID');
                            $enTranslation = collect($item['translations'])->firstWhere('language', 'EN');
                            $title = $isEn && ($enTranslation['title'] ?? null) ? $enTranslation['title'] : (($idTranslation['title'] ?? null) ?: $item['slug']);
                            $excerpt = $isEn && ($enTranslation['excerpt'] ?? null) ? $enTranslation['excerpt'] : ($idTranslation['excerpt'] ?? '');
                            $cover = $item['coverMedia']['url'] ?? '/images/pengetahuan/cerita-lapangan.jpg';
                            $typeLabel = $knowledgeTypeLabels[$item['type']] ?? $item['type'];
                        @endphp
                        <a href="/pengetahuan/{{ $item['slug'] }}" class="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-teal hover:shadow-xl"><div class="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900"><img src="{{ $cover }}" alt="{{ $title }}" class="h-full w-full object-cover brightness-[0.92] transition-transform duration-700 group-hover:scale-105"><span class="absolute left-3 top-3 rounded-md bg-neutral-900/80 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-white backdrop-blur-sm">{{ $typeLabel }}</span></div><div class="flex flex-1 flex-col justify-between p-6"><div><h3 class="line-clamp-2 font-heading text-base font-bold leading-snug text-neutral-950 transition-colors group-hover:text-brand-teal">{{ $title }}</h3>@if($excerpt)<p class="mt-2 line-clamp-3 text-xs leading-relaxed text-neutral-600">{{ $excerpt }}</p>@endif</div><div class="mt-5 flex items-center justify-between border-t border-neutral-100 pt-3 font-mono text-xs text-neutral-400"><span>@if($item['publishedAt']){{ \Illuminate\Support\Carbon::parse($item['publishedAt'])->locale($isEn ? 'en' : 'id')->isoFormat('L') }}@else ANTRABUMI @endif</span><span class="font-semibold text-brand-teal">{{ $isEn ? 'Read publication →' : 'Baca Publikasi →' }}</span></div></div></a>
                    @endforeach
                </div>
            </div>
        </section>
    @endif

    <section aria-labelledby="expertise-heading" class="bg-[#0B1E1A] py-16 text-white sm:py-24">
        <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
            <div class="mb-10 max-w-2xl"><p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#E5A823]">{{ $isEn ? 'OUR COLLECTIVE EXPERTISE' : 'KEAHLIAN KOLEKTIF KAMI' }}</p><h2 id="expertise-heading" class="mt-3 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">{{ $isEn ? 'Diverse Perspectives, Shared Purpose' : 'Tidak ada satu perspektif yang cukup. Kami mempertemukan pengalaman berbeda untuk melihat persoalan secara utuh.' }}</h2></div>
            <div class="flex flex-wrap gap-2.5 sm:gap-3">@foreach($expertise as $skill)<span class="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-neutral-200 transition hover:border-[#E5A823] hover:bg-white/10 hover:text-white sm:px-5 sm:py-2.5 sm:text-sm">{{ $skill }}</span>@endforeach</div>
            <div class="mt-10"><a href="/tentang#tim" class="inline-flex items-center gap-2 text-sm font-semibold text-[#E5A823] underline underline-offset-4 hover:text-amber-300">{{ $isEn ? 'Meet the team & credentialed specialists →' : 'Kenali profil pakar di balik ANTRABUMI →' }}</a></div>
        </div>
    </section>

    @if(count($partners) > 0)
        <section aria-labelledby="partners-heading" class="border-t border-neutral-100 bg-white py-16 sm:py-20">
            <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10"><div class="mb-10 text-center"><p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">{{ $isEn ? 'Collaboration & Network' : 'Mitra & Jejaring Kolaborasi' }}</p><h2 id="partners-heading" class="mt-2 font-heading text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">{{ $isEn ? 'Growing Together Across Sectors' : 'Bekerja Bersama Lintas Sektor' }}</h2></div><div class="grid grid-cols-2 items-center gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">@foreach($partners as $partner)<div title="{{ $partner['name'] }}" class="flex h-20 items-center justify-center rounded-xl border border-neutral-200/70 bg-neutral-50/50 p-4 shadow-sm transition-all hover:border-[#0D5C4D]/30 hover:bg-white hover:shadow"><a @if($partner['website']) href="{{ $partner['website'] }}" target="_blank" rel="noopener noreferrer" @endif class="flex h-full w-full items-center justify-center">@if($partner['logoUrl'])<img src="{{ $partner['logoUrl'] }}" alt="{{ $partner['logoAlt'] ?: $partner['name'] }}" class="max-h-12 max-w-full object-contain grayscale transition-all hover:grayscale-0">@else<span class="line-clamp-2 text-center font-heading text-xs font-bold text-neutral-600">{{ $partner['name'] }}</span>@endif</a></div>@endforeach</div><div class="mt-8 text-center"><a href="/kolaborasi" class="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-teal hover:underline">{{ $isEn ? 'Learn more about our collaborative ecosystem →' : 'Pelajari ekosistem kolaborasi kami →' }}</a></div></div>
        </section>
    @endif

    <section aria-labelledby="cta-heading" class="border-t border-neutral-100 bg-[#FAF9F5] py-20 sm:py-28">
        <div class="mx-auto w-full max-w-[760px] px-5 md:px-7 lg:px-10"><div class="space-y-6 text-center"><span class="inline-block rounded-full bg-[#0D5C4D]/10 px-4 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-teal">{{ $localized($content['cta'], 'badge') }}</span><h2 id="cta-heading" class="font-heading text-3xl font-bold leading-snug tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">{{ $localized($content['cta'], 'title') }}</h2><p class="mx-auto max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">{{ $localized($content['cta'], 'description') }}</p><div class="flex flex-wrap items-center justify-center gap-4 pt-6"><a href="/kolaborasi#formulir" class="inline-flex h-12 items-center rounded-xl bg-brand-teal px-8 text-sm font-semibold text-white shadow-md shadow-[#0D5C4D]/25 transition hover:-translate-y-0.5 hover:bg-brand-teal-dark hover:shadow-lg">{{ $isEn ? 'Start Collaboration →' : 'Mulai Kolaborasi →' }}</a><a href="/kolaborasi#kontak" class="inline-flex h-12 items-center gap-2 rounded-xl border border-neutral-300 bg-white px-7 text-sm font-semibold text-neutral-800 shadow-sm transition hover:border-brand-teal hover:bg-[#0D5C4D]/5 hover:text-brand-teal">{{ $isEn ? 'Contact Information' : 'Informasi Kontak' }}</a></div></div></div>
    </section>
</div>
@endsection