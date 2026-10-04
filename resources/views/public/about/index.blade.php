@extends('layouts.app')

@section('title', $isEnglish ? 'About ANTRABUMI — Connecting Knowledge, Nature, & Communities' : 'Tentang ANTRABUMI — Menghubungkan Pengetahuan, Alam, & Komunitas')
@section('description', $isEnglish ? 'ANTRABUMI works at the intersection of knowledge, nature, and communities.' : 'ANTRABUMI bekerja di persimpangan pengetahuan, alam, dan komunitas.')
@section('canonical', url('/tentang'))
@section('og_title', $isEnglish ? 'About ANTRABUMI' : 'Tentang ANTRABUMI')
@section('og_description', $story['lead'])

@section('content')
<div class="bg-white">
    <section class="relative isolate overflow-hidden border-b border-neutral-100 bg-gradient-to-br from-[#F7F6F1] via-white to-[#EAF3EF] py-16 sm:py-24 lg:py-28">
        <div aria-hidden="true" class="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#0D5C4D]/10 blur-3xl"></div>
        <div class="relative mx-auto grid w-full max-w-[1280px] items-center gap-10 px-5 md:px-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] lg:gap-16 lg:px-10">
            <div class="max-w-3xl">
                <p class="inline-flex items-center gap-2 rounded-full border border-[#0D5C4D]/15 bg-white/80 px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#0D5C4D] shadow-sm"><span class="h-1.5 w-1.5 rounded-full bg-[#D96B27]"></span>{{ $story['eyebrow'] }}</p>
                <h1 class="mt-5 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">{{ $story['title'] }}</h1>
                <p class="mt-6 max-w-2xl text-base leading-relaxed text-neutral-700 sm:text-lg">{{ $story['lead'] }}</p>
                <a href="#perjalanan" class="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0D5C4D] px-5 text-sm font-semibold text-white shadow-md shadow-[#0D5C4D]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#1A4B43] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D5C4D]">{{ $isEnglish ? 'Explore our journey' : 'Jelajahi perjalanan kami' }} <span aria-hidden="true">↓</span></a>
            </div>
            <div class="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden="true">
                <div class="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[#0D5C4D]/15 via-transparent to-[#E5A823]/20 blur-xl"></div>
                <div class="relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-[#0B1E1A] p-7 text-white shadow-2xl shadow-[#0B1E1A]/15 sm:p-9">
                    <div class="absolute -right-10 -top-12 h-40 w-40 rounded-full border border-white/10"></div>
                    <div class="absolute -right-2 -top-4 h-24 w-24 rounded-full border border-white/10"></div>
                    <img src="/images/illustrations/about-network.svg" alt="" aria-hidden="true" fetchpriority="high" class="relative z-10 -mx-4 -mt-4 mb-2 w-[calc(100%+2rem)] drop-shadow-xl sm:-mx-5 sm:-mt-5 sm:w-[calc(100%+2.5rem)]">
                    <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#E5A823]">ANTRABUMI</p>
                    <p class="mt-6 font-heading text-3xl font-bold leading-tight sm:text-4xl">Knowledge.<br>Nature.<br>Communities.</p>
                    <div class="mt-8 flex items-center gap-3 border-t border-white/15 pt-5 text-sm text-neutral-300"><span class="h-2 w-2 rounded-full bg-[#E5A823]"></span>{{ $isEnglish ? 'Connected for meaningful change' : 'Terhubung untuk perubahan bermakna' }}</div>
                </div>
            </div>
        </div>
    </section>

    <section class="border-b border-neutral-100 bg-white py-16 sm:py-20">
        <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
            <div class="grid gap-5 md:grid-cols-3">
                <article class="group rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#0D5C4D]/30 hover:bg-white hover:shadow-xl">
                    <span class="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0D5C4D]/10 font-mono text-sm font-bold text-[#0D5C4D] transition group-hover:bg-[#0D5C4D] group-hover:text-white">01</span>
                    <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0D5C4D]">KNOWLEDGE</p>
                    <p class="mt-4 text-sm leading-relaxed text-neutral-600">{{ $isEnglish ? 'Research, evidence, and field learning are combined to understand conditions more clearly.' : 'Riset, bukti, dan pembelajaran lapangan dipadukan untuk memahami kondisi secara lebih jelas.' }}</p>
                </article>
                <article class="group rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#0D5C4D]/30 hover:bg-white hover:shadow-xl">
                    <span class="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#116958]/10 font-mono text-sm font-bold text-[#116958] transition group-hover:bg-[#116958] group-hover:text-white">02</span>
                    <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0D5C4D]">NATURE</p>
                    <p class="mt-4 text-sm leading-relaxed text-neutral-600">{{ $isEnglish ? 'We work with ecological and environmental realities as the basis for grounded action.' : 'Kami bekerja dengan realitas ekologi dan lingkungan sebagai dasar untuk aksi yang berakar pada konteks.' }}</p>
                </article>
                <article class="group rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#D96B27]/30 hover:bg-white hover:shadow-xl">
                    <span class="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D96B27]/10 font-mono text-sm font-bold text-[#D96B27] transition group-hover:bg-[#D96B27] group-hover:text-white">03</span>
                    <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0D5C4D]">COMMUNITIES</p>
                    <p class="mt-4 text-sm leading-relaxed text-neutral-600">{{ $isEnglish ? 'Listening to communities shapes the solutions and decisions that follow.' : 'Mendengarkan komunitas membentuk solusi dan keputusan yang berikutnya dibuat.' }}</p>
                </article>
            </div>
        </div>
    </section>

    <section id="perjalanan" class="scroll-mt-24 border-b border-neutral-100 bg-[#FAF9F5] py-16 sm:py-20">
        <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
            <div class="mb-10 max-w-2xl">
                <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#D96B27]">{{ $isEnglish ? 'OUR JOURNEY' : 'PERJALANAN KAMI' }}</p>
                <h2 class="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">{{ $isEnglish ? 'From learning to collaboration' : 'Dari pembelajaran menuju kolaborasi' }}</h2>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
                @foreach($journey as $item)
                    <article class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                        <p class="font-mono text-2xl font-bold text-[#0D5C4D]">{{ $item['year'] }}</p>
                        <h3 class="mt-3 font-heading text-base font-bold text-neutral-900">{{ $item['label'] }}</h3>
                        <p class="mt-2 text-xs leading-relaxed text-neutral-600">{{ $item['description'] }}</p>
                    </article>
                @endforeach
            </div>
        </div>
    </section>

    <section class="border-b border-neutral-100 bg-white py-16 sm:py-20">
        <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
            <div class="mb-10 max-w-3xl">
                <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0D5C4D]">{{ $isEnglish ? 'OUR WORKING FRAMEWORK' : 'CARA KAMI BEKERJA' }}</p>
                <h2 class="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">{{ $isEnglish ? 'Every collaboration begins with understanding context.' : 'Setiap kolaborasi dimulai dari memahami konteks.' }}</h2>
            </div>
            <div class="space-y-4">
                @foreach($framework as $step)
                    <div class="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
                        <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0D5C4D] font-mono text-xs font-bold text-white">{{ $step['step'] }}</span>
                        <div>
                            <p class="font-heading text-lg font-bold text-neutral-900">{{ $step['title'] }}</p>
                            <p class="mt-1 text-sm leading-relaxed text-neutral-600">{{ $step['desc'] }}</p>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    <section class="border-b border-neutral-100 bg-[#FFF8F0] py-16 sm:py-20">
        <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
            <div class="rounded-3xl border border-[#D96B27]/30 bg-gradient-to-br from-[#FFF9F2] to-white p-7 sm:p-10">
                <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#D96B27]">GEDSI</p>
                <h2 class="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">{{ $gedsi['title'] }}</h2>
                <p class="mt-4 max-w-3xl text-base leading-relaxed text-neutral-700">{{ $gedsi['description'] }}</p>
            </div>
        </div>
    </section>

    <section id="tim" class="bg-white py-16 sm:py-20">
        <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
            <div class="mb-10 max-w-2xl">
                <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0D5C4D]">{{ $isEnglish ? 'OUR PEOPLE' : 'TIM KAMI' }}</p>
                <h2 class="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">{{ $isEnglish ? 'A collective of researchers, strategists, and field practitioners.' : 'Kolektif peneliti, perencana, dan praktisi lapangan.' }}</h2>
            </div>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                @foreach($people as $person)
                    <a href="{{ url('/tentang/tim/'.$person['slug']) }}" class="group rounded-3xl border border-neutral-200 bg-neutral-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div class="overflow-hidden rounded-2xl bg-neutral-200">
                            <img src="{{ $person['imageUrl'] ?? '/images/default-person.jpg' }}" alt="{{ $person['name'] }}" class="h-64 w-full object-cover transition group-hover:scale-[1.02]">
                        </div>
                        <div class="mt-5">
                            <h3 class="font-heading text-xl font-bold text-neutral-950">{{ $person['name'] }}</h3>
                            @if($person['degree'])<p class="mt-1 text-xs font-medium uppercase tracking-wider text-neutral-500">{{ $person['degree'] }}</p>@endif
                            @if($person['role'])<p class="mt-2 text-sm text-[#0D5C4D]">{{ $person['role'] }}</p>@endif
                        </div>
                    </a>
                @endforeach
            </div>
        </div>
    </section>

    <section class="border-t border-neutral-100 bg-[#FAF9F5] py-20 sm:py-24">
        <div class="mx-auto w-full max-w-[760px] px-5 md:px-7 lg:px-10 text-center">
            <p class="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#0D5C4D]">{{ $isEnglish ? 'COLLABORATION' : 'KOLABORASI' }}</p>
            <h2 class="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">{{ $isEnglish ? 'Let’s build grounded and meaningful work together.' : 'Mari membangun kerja yang kontekstual dan bermakna bersama.' }}</h2>
            <div class="mt-8 flex flex-wrap justify-center gap-4">
                <a href="/kolaborasi" class="inline-flex h-12 items-center rounded-xl bg-[#0D5C4D] px-6 text-sm font-semibold text-white">{{ $isEnglish ? 'Start Collaboration' : 'Mulai Kolaborasi' }}</a>
                <a href="/kolaborasi#formulir" class="inline-flex h-12 items-center rounded-xl border border-neutral-300 bg-white px-6 text-sm font-semibold text-neutral-800">{{ $isEnglish ? 'Contact Us' : 'Hubungi Kami' }}</a>
            </div>
        </div>
    </section>
</div>
@endsection
