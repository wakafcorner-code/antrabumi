@extends('layouts.app')

@section('title', $isEnglish ? 'Collaboration with ANTRABUMI' : 'Kolaborasi dengan ANTRABUMI')
@section('description', $cta['body'])
@section('canonical', url('/kolaborasi'))
@section('og_title', $isEnglish ? 'Collaboration with ANTRABUMI' : 'Kolaborasi dengan ANTRABUMI')
@section('og_description', $cta['body'])

@section('content')
<div class="bg-white">
    @if($errors->any())
        <div role="alert" aria-live="assertive" class="mx-auto mt-6 w-full max-w-[980px] rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
            <p class="font-semibold">{{ $isEnglish ? 'Please review the information below.' : 'Periksa kembali informasi yang Anda kirim.' }}</p>
            <ul class="mt-2 list-disc space-y-1 pl-5">
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
    <section class="border-b border-neutral-100 bg-[#F7F6F1] py-16 sm:py-20">
        <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
            <div class="max-w-3xl">
                <p class="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#0D5C4D]">{{ $isEnglish ? 'COLLABORATION' : 'KOLABORASI' }}</p>
                <h1 class="mt-4 font-heading text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">{{ $cta['title'] }}</h1>
                <p class="mt-5 max-w-2xl text-base leading-relaxed text-neutral-700 sm:text-lg">{{ $cta['body'] }}</p>
            </div>
        </div>
    </section>

    <section class="border-b border-neutral-100 bg-white py-16 sm:py-20">
        <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
            <div class="mb-10 max-w-2xl">
                <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#D96B27]">{{ $isEnglish ? 'WHO WE WORK WITH' : 'SIAPA YANG KAMI BANGUN KERJASAMA' }}</p>
                <h2 class="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">{{ $isEnglish ? 'Working across sectors with shared purpose.' : 'Bekerja lintas sektor dengan tujuan bersama.' }}</h2>
            </div>
            <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                @foreach($audiences as $audience)
                    <article class="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm">
                        <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0D5C4D]">{{ $audience['title'] }}</p>
                        <p class="mt-4 text-sm leading-relaxed text-neutral-600">{{ $audience['description'] }}</p>
                    </article>
                @endforeach
            </div>
        </div>
    </section>

    @if(count($partners) > 0)
        <section class="border-b border-neutral-100 bg-[#FAF9F5] py-16 sm:py-20">
            <div class="mx-auto w-full max-w-[1280px] px-5 md:px-7 lg:px-10">
                <div class="mb-10 text-center">
                    <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0D5C4D]">{{ $isEnglish ? 'PARTNERS' : 'MITRA' }}</p>
                    <h2 class="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">{{ $isEnglish ? 'Collaborative network' : 'Jejaring kolaborasi' }}</h2>
                </div>
                <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    @foreach($partners as $partner)
                        <div class="flex h-20 items-center justify-center rounded-2xl border border-neutral-200 bg-white p-4 text-center shadow-sm">
                            @if($partner['logoUrl'])
                                <img src="{{ $partner['logoUrl'] }}" alt="{{ $partner['logoAlt'] ?? $partner['name'] }}" class="max-h-10 max-w-full object-contain">
                            @else
                                <span class="font-heading text-xs font-bold text-neutral-700">{{ $partner['name'] }}</span>
                            @endif
                        </div>
                    @endforeach
                </div>
            </div>
        </section>
    @endif

    <section id="kontak" class="bg-white py-20 sm:py-24">
        <div class="mx-auto w-full max-w-[980px] px-5 md:px-7 lg:px-10">
            @if(session('sent') || session('success'))
                <div class="mb-6 rounded-2xl border border-[#0D5C4D]/20 bg-[#F1F8F5] px-4 py-3 text-sm font-medium text-[#0D5C4D]">
                    {{ session('success') ?: ($isEnglish ? 'Your message has been sent.' : 'Pesan berhasil dikirim.') }}
                </div>
            @endif
            <div class="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div class="rounded-3xl border border-neutral-200 bg-neutral-50 p-7 sm:p-8">
                    <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#D96B27]">{{ $isEnglish ? 'CONTACT' : 'HUBUNGI KAMI' }}</p>
                    <h2 class="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">{{ $isEnglish ? 'Reach the ANTRABUMI team.' : 'Hubungi tim ANTRABUMI.' }}</h2>
                    <ul class="mt-6 space-y-4 text-sm text-neutral-700">
                        <li><span class="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Email</span><a href="mailto:hello@antrabumi.org" class="text-base font-medium text-[#0D5C4D] hover:underline">hello@antrabumi.org</a></li>
                        <li><span class="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Phone</span><a href="tel:+6282330387505" class="text-base font-medium text-[#0D5C4D] hover:underline">+62-823-3038-7505</a></li>
                        <li><span class="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Website</span><a href="https://www.antrabumi.org" target="_blank" rel="noopener noreferrer" class="text-base font-medium text-[#0D5C4D] hover:underline">www.antrabumi.org</a></li>
                        <li><span class="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Instagram</span><a href="https://instagram.com/antrabumi_org" target="_blank" rel="noopener noreferrer" class="text-base font-medium text-[#0D5C4D] hover:underline">@antrabumi_org</a></li>
                        <li><span class="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">LinkedIn</span><a href="https://www.linkedin.com/company/antrabumi" target="_blank" rel="noopener noreferrer" class="text-base font-medium text-[#0D5C4D] hover:underline">Antrabumi</a></li>
                        <li><span class="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Address</span><span class="text-base font-medium text-neutral-800">TRIGHA Creative Hub, Sudirman St, 08, Belitung</span></li>
                    </ul>
                </div>

                <div id="formulir" class="rounded-3xl border border-neutral-200 bg-neutral-50 p-7 sm:p-10">
                    <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#D96B27]">{{ $isEnglish ? 'CONTACT FORM' : 'FORMULIR KONTAK' }}</p>
                    <h2 class="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">{{ $isEnglish ? 'Tell us about your collaboration idea.' : 'Ceritakan ide kolaborasi Anda.' }}</h2>
                    <form method="POST" action="{{ route('contact.store') }}" class="mt-8 space-y-4">
                        @csrf
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label class="mb-2 block text-sm font-medium text-neutral-700" for="name">{{ $isEnglish ? 'Name' : 'Nama' }}</label>
                                <input id="name" name="name" type="text" value="{{ old('name') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm" required>
                                @error('name')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
                            </div>
                            <div>
                                <label class="mb-2 block text-sm font-medium text-neutral-700" for="email">Email</label>
                                <input id="email" name="email" type="email" value="{{ old('email') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm" required>
                                @error('email')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
                            </div>
                        </div>
                        <div>
                            <label class="mb-2 block text-sm font-medium text-neutral-700" for="subject">{{ $isEnglish ? 'Subject' : 'Subjek' }}</label>
                            <input id="subject" name="subject" type="text" value="{{ old('subject') }}" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm" placeholder="{{ $isEnglish ? 'Partnership inquiry' : 'Permintaan kerja sama' }}">
                            @error('subject')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
                        </div>
                        <div>
                            <label class="mb-2 block text-sm font-medium text-neutral-700" for="message">{{ $isEnglish ? 'Message' : 'Pesan' }}</label>
                            <textarea id="message" name="message" rows="5" class="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm" required>{{ old('message') }}</textarea>
                            @error('message')<p class="mt-1 text-xs text-red-700">{{ $message }}</p>@enderror
                        </div>
                        <button type="submit" class="inline-flex h-12 items-center rounded-xl bg-[#0D5C4D] px-6 text-sm font-semibold text-white">{{ $isEnglish ? 'Send message' : 'Kirim pesan' }}</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</div>
@endsection
