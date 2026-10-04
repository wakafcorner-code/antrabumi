@php
    $isEnglish = request()->cookie('antrabumi_lang') === 'EN';
    $navItems = [
        ['href' => '/tentang', 'id' => 'Tentang', 'en' => 'About', 'footerId' => 'Lihat Profil Lengkap →', 'footerEn' => 'View Full Profile →', 'children' => [
            ['href' => '/tentang', 'id' => 'Siapa Kami', 'en' => 'Who We Are', 'descId' => 'Organisasi yang menghubungkan pengetahuan, alam, dan komunitas', 'descEn' => 'An organization connecting knowledge, nature, and communities', 'icon' => '🌿'],
            ['href' => '/tentang#perjalanan', 'id' => 'Perjalanan Kami', 'en' => 'Our Journey', 'descId' => 'Jejak organisasi sejak 2021 hingga babak baru 2026', 'descEn' => 'Organizational milestones from 2021 to a new chapter in 2026', 'icon' => '🗺️'],
            ['href' => '/tentang#tim', 'id' => 'Tim & Keahlian', 'en' => 'Team & Expertise', 'descId' => 'Kumpulan pakar lintas disiplin yang bekerja bersama', 'descEn' => 'A multidisciplinary team combining diverse perspectives', 'icon' => '🤝'],
        ]],
        ['href' => '/inisiatif', 'id' => 'Inisiatif', 'en' => 'Initiatives', 'footerId' => 'Semua Inisiatif →', 'footerEn' => 'All Initiatives →', 'children' => [
            ['href' => '/inisiatif?kategori=campaign', 'id' => 'Kampanye', 'en' => 'Campaign', 'descId' => 'Advokasi publik, aksi bersama, dan kesadaran lingkungan', 'descEn' => 'Public advocacy, collective action, and environmental awareness', 'icon' => '📢'],
            ['href' => '/inisiatif?kategori=project', 'id' => 'Proyek', 'en' => 'Project', 'descId' => 'Program lapangan, intervensi kontekstual, dan pendampingan', 'descEn' => 'Field programs, contextual interventions, and stewardship', 'icon' => '🌱'],
        ]],
        ['href' => '/pengetahuan', 'id' => 'Pengetahuan', 'en' => 'Knowledge', 'footerId' => 'Semua Publikasi →', 'footerEn' => 'All Publications →', 'children' => [
            ['href' => '/pengetahuan?kategori=artikel', 'id' => 'Artikel', 'en' => 'Article', 'descId' => 'Wawasan, analisis kontekstual, dan refleksi pemikiran', 'descEn' => 'Insights, contextual perspectives, and reflective analyses', 'icon' => '✍️'],
            ['href' => '/pengetahuan?kategori=riset', 'id' => 'Riset & Publikasi', 'en' => 'Research & Publication', 'descId' => 'Laporan kajian berbasis bukti, policy briefs, dan riset', 'descEn' => 'Evidence-based assessment reports, policy briefs, and studies', 'icon' => '📑'],
            ['href' => '/pengetahuan?kategori=cerita', 'id' => 'Cerita Lapangan', 'en' => 'Field Story', 'descId' => 'Catatan interaksi nyata bersama masyarakat di bentang alam', 'descEn' => 'Real stories from communities, places, and living realities', 'icon' => '🧭'],
        ]],
        ['href' => '/kolaborasi', 'id' => 'Kolaborasi', 'en' => 'Collaboration', 'footerId' => 'Mulai Kolaborasi →', 'footerEn' => 'Start Collaboration →', 'children' => [
            ['href' => '/kolaborasi#mitra', 'id' => 'Mitra & Jaringan', 'en' => 'Partners & Network', 'descId' => 'Lembaga, pemerintah, akademisi, dan sektor swasta yang bergabung', 'descEn' => 'Organizations, governments, academics, and private sector partners', 'icon' => '🌐'],
            ['href' => '/kolaborasi#formulir', 'id' => 'Hubungi Kami', 'en' => 'Contact Us', 'descId' => 'Diskusikan peluang kemitraan dan program bersama ANTRABUMI', 'descEn' => 'Discuss partnership opportunities and programs with ANTRABUMI', 'icon' => '💬'],
        ]],
    ];
@endphp

<nav aria-label="{{ $isEnglish ? 'Main navigation' : 'Navigasi Utama' }}" class="hidden items-center gap-1 lg:flex">
    @foreach($navItems as $item)
        <div class="relative" data-nav-dropdown>
            <button type="button" aria-expanded="false" aria-haspopup="true" data-nav-trigger class="group flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100/80 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal">
                {{ $isEnglish ? $item['en'] : $item['id'] }}
                <svg class="h-3.5 w-3.5 text-neutral-400 transition-transform group-aria-expanded:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m6 9 6 6 6-6" /></svg>
            </button>
            <div hidden data-nav-panel class="absolute left-1/2 top-full z-50 w-[340px] -translate-x-1/2 pt-3">
                <div class="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xl ring-1 ring-neutral-950/5">
                    <a href="{{ $item['href'] }}" class="flex items-center justify-between bg-gradient-to-r from-[#0B1F1A] to-[#0D5C4D] px-5 py-4 text-white">
                        <span><span class="block font-mono text-[10px] font-semibold uppercase tracking-widest text-[#E5A823]">ANTRABUMI</span><span class="mt-0.5 block font-heading text-base font-bold">{{ $isEnglish ? $item['en'] : $item['id'] }}</span></span>
                        <span aria-hidden="true" class="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">→</span>
                    </a>
                    <div class="space-y-0.5 p-2.5">
                        @foreach($item['children'] as $child)
                            <a href="{{ $child['href'] }}" class="group flex items-start gap-3.5 rounded-xl p-3 transition hover:bg-neutral-50">
                                <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-base">{{ $child['icon'] }}</span>
                                <span class="min-w-0 flex-1"><span class="block text-xs font-semibold text-neutral-900 group-hover:text-brand-teal">{{ $isEnglish ? $child['en'] : $child['id'] }}</span><span class="mt-0.5 block text-[11px] leading-snug text-neutral-500">{{ $isEnglish ? $child['descEn'] : $child['descId'] }}</span></span>
                            </a>
                        @endforeach
                    </div>
                    <div class="border-t border-neutral-100 bg-neutral-50/70 px-4 py-2.5"><a href="{{ $item['href'] }}" class="text-xs font-semibold text-brand-teal">{{ $isEnglish ? $item['footerEn'] : $item['footerId'] }}</a></div>
                </div>
            </div>
        </div>
    @endforeach
</nav>

<div id="public-mobile-navigation" data-menu-panel class="hidden basis-full border-t border-neutral-100 pb-5 pt-3 lg:hidden">
    <nav aria-label="{{ $isEnglish ? 'Mobile main navigation' : 'Navigasi Mobile' }}">
        <ul class="flex flex-col gap-0.5">
            @foreach($navItems as $item)
                <li>
                    <div class="flex items-center rounded-xl hover:bg-neutral-50">
                        <a href="{{ $item['href'] }}" class="flex-1 px-4 py-3 text-sm font-medium text-neutral-800">{{ $isEnglish ? $item['en'] : $item['id'] }}</a>
                        <details class="group relative mr-2">
                            <summary aria-label="Toggle submenu {{ $isEnglish ? $item['en'] : $item['id'] }}" class="flex h-10 w-10 cursor-pointer list-none items-center justify-center text-neutral-400 transition hover:text-brand-teal [&::-webkit-details-marker]:hidden"><svg class="h-4 w-4 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m6 9 6 6 6-6" /></svg></summary>
                            <div class="absolute right-0 z-20 mt-1 w-[min(88vw,22rem)] rounded-2xl border border-neutral-200/70 bg-neutral-50/95 p-2 shadow-xl">
                                @foreach($item['children'] as $child)
                                    <a href="{{ $child['href'] }}" class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-neutral-700 hover:bg-white hover:text-brand-teal"><span class="flex h-8 w-8 items-center justify-center rounded-lg bg-white">{{ $child['icon'] }}</span><span><span class="block font-medium">{{ $isEnglish ? $child['en'] : $child['id'] }}</span><span class="block text-xs text-neutral-500">{{ $isEnglish ? $child['descEn'] : $child['descId'] }}</span></span></a>
                                @endforeach
                            </div>
                        </details>
                    </div>
                </li>
            @endforeach
        </ul>
    </nav>
    <div class="mt-4 flex items-center justify-between gap-4 border-t border-neutral-100 px-1 pt-4">
        <form method="POST" action="{{ route('language.update') }}" class="flex items-center rounded-full border border-neutral-200 bg-neutral-50 p-0.5">
            @csrf<input type="hidden" name="return_to" value="{{ request()->getRequestUri() }}">
            <button name="language" value="ID" type="submit" aria-pressed="{{ !$isEnglish ? 'true' : 'false' }}" class="rounded-full px-3 py-1 text-xs font-semibold {{ !$isEnglish ? 'bg-neutral-900 text-white' : 'text-neutral-500' }}">ID</button>
            <button name="language" value="EN" type="submit" aria-pressed="{{ $isEnglish ? 'true' : 'false' }}" class="rounded-full px-3 py-1 text-xs font-semibold {{ $isEnglish ? 'bg-neutral-900 text-white' : 'text-neutral-500' }}">EN</button>
        </form>
        <a href="/kolaborasi#formulir" class="inline-flex h-10 items-center rounded-xl bg-brand-teal px-5 text-sm font-semibold text-white">{{ $isEnglish ? 'Contact Us' : 'Hubungi Kami' }}</a>
    </div>
</div>
