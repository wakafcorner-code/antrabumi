@extends('layouts.app')

@section('title', $isEnglish ? 'About ANTRABUMI — Connecting Knowledge, Nature, & Communities' : 'Tentang ANTRABUMI — Menghubungkan Pengetahuan, Alam, & Komunitas')
@section('description', $isEnglish ? 'ANTRABUMI works at the intersection of knowledge, nature, and communities.' : 'ANTRABUMI bekerja di persimpangan pengetahuan, alam, dan komunitas.')
@section('canonical', url('/tentang'))
@section('og_title', $isEnglish ? 'About ANTRABUMI' : 'Tentang ANTRABUMI')
@section('og_description', $story['lead'])

@section('content')
<div class="bg-white">
    <section class="border-b border-neutral-100 bg-[#F7F6F1] py-16 sm:py-20">
        <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
            <div class="max-w-3xl">
                <p class="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#0D5C4D]">{{ $story['eyebrow'] }}</p>
                <h1 class="mt-4 font-heading text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">{{ $story['title'] }}</h1>
                <p class="mt-5 max-w-2xl text-base leading-relaxed text-neutral-700 sm:text-lg">{{ $story['lead'] }}</p>
            </div>
        </div>
    </section>

    <section class="border-b border-neutral-100 bg-white py-16 sm:py-20">
        <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
            <div class="grid gap-6 md:grid-cols-3">
                <article class="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
                    <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0D5C4D]">KNOWLEDGE</p>
                    <p class="mt-4 text-sm leading-relaxed text-neutral-600">{{ $isEnglish ? 'Research, evidence, and field learning are combined to understand conditions more clearly.' : 'Riset, bukti, dan pembelajaran lapangan dipadukan untuk memahami kondisi secara lebih jelas.' }}</p>
                </article>
                <article class="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
                    <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0D5C4D]">NATURE</p>
                    <p class="mt-4 text-sm leading-relaxed text-neutral-600">{{ $isEnglish ? 'We work with ecological and environmental realities as the basis for grounded action.' : 'Kami bekerja dengan realitas ekologi dan lingkungan sebagai dasar untuk aksi yang berakar pada konteks.' }}</p>
                </article>
                <article class="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
                    <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0D5C4D]">COMMUNITIES</p>
                    <p class="mt-4 text-sm leading-relaxed text-neutral-600">{{ $isEnglish ? 'Listening to communities shapes the solutions and decisions that follow.' : 'Mendengarkan komunitas membentuk solusi dan keputusan yang berikutnya dibuat.' }}</p>
                </article>
            </div>
        </div>
    </section>

    <section id="perjalanan" class="border-b border-neutral-100 bg-[#FAF9F5] py-16 sm:py-20">
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
